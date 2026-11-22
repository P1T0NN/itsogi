import { afterEach, beforeEach, expect, expectTypeOf, it, vi } from 'vitest';
import { z } from 'zod';
import { invalid } from '@sveltejs/kit';
import { safeForm } from '@/wrappers/safeForm';

// TYPES
import type { RequestEvent } from '@sveltejs/kit';
import type { RemoteForm, RemoteFormInput } from '$app/server';

const internalModuleName = '@sveltejs/kit/internal/server';
const {
	with_request_store
}: {
	with_request_store: <Output>(
		store: { event: RequestEvent; state: { remote: { data: null; implicit: null } } },
		callback: () => Output
	) => Output;
} = await import(internalModuleName);

let event: RequestEvent;
beforeEach(() => {
	vi.spyOn(globalThis, 'fetch').mockImplementation(async () =>
		Response.json({ success: true, action: 'createTodo', hostname: 'example.test' })
	);
	// SAFETY: the real remote factories only access these request fields on the tested paths.
	event = {
		locals: {},
		request: new Request('https://example.test/todo', { method: 'POST' }),
		url: new URL('https://example.test/todo'),
		isRemoteRequest: true
	} as RequestEvent;
});
afterEach(() => vi.restoreAllMocks());

function _submit<Output>(
	form: Pick<RemoteForm<void, Output>, 'result'>,
	input: { title?: string; _turnstileToken?: string },
	validateOnly = false
) {
	// SAFETY: exercise the installed framework's dispatch callback, keeping real validation and invalid() handling.
	const nativeForm = form as typeof form & {
		__: {
			fn: (
				data: RemoteFormInput,
				meta: { validate_only: boolean },
				formData: FormData
			) => Promise<{ result?: Output; issues?: { message: string }[]; input?: RemoteFormInput }>;
		};
	};
	const formData = new FormData();
	for (const [key, value] of Object.entries(input)) {
		// Native field names include the action ID, which is empty for these directly created factories.
		if (value !== undefined) formData.set(`${key}/`, value);
	}
	return with_request_store({ event, state: { remote: { data: null, implicit: null } } }, () =>
		nativeForm.__.fn(input, { validate_only: validateOnly }, formData)
	);
}

const options = { turnstile: { action: 'createTodo' } } as const;
const schema = z.strictObject({
	title: z
		.string()
		.min(1)
		.transform((title) => title.length)
});

it('verifies the token, strips it and preserves transformed fields and issue typing', async () => {
	const form = safeForm(options, schema, (input, issue) => {
		expectTypeOf(input.title).toEqualTypeOf<number>();
		expectTypeOf(issue.title).toBeCallableWith('Invalid title');
		expect(input).toEqual({ title: 4 });
		expect(fetch).toHaveBeenCalledTimes(1);
		return input.title;
	});
	expectTypeOf(form).toEqualTypeOf<RemoteForm<{ title: string }, number>>();
	expect(await _submit(form, { title: 'milk', _turnstileToken: 'token' })).toMatchObject({
		result: 4
	});
});

it('prevents direct requests without a token from reaching business work', async () => {
	const handler = vi.fn(() => 42);
	const form = safeForm(options, schema, handler);
	expect(await _submit(form, { title: 'milk' })).toMatchObject({
		issues: [{ message: 'Please complete the verification and try again.' }]
	});
	expect(handler).not.toHaveBeenCalled();
	expect(fetch).not.toHaveBeenCalled();
});

it('does not redeem tokens during validation-only requests or failed business validation', async () => {
	const handler = vi.fn(() => 42);
	const form = safeForm(options, schema, handler);
	expect(await _submit(form, { title: 'milk', _turnstileToken: 'token' }, true)).toEqual([]);
	expect(await _submit(form, { title: '', _turnstileToken: 'token' })).toHaveProperty('issues');
	expect(handler).not.toHaveBeenCalled();
	expect(fetch).not.toHaveBeenCalled();
});

it('rejects expired or replayed tokens and keeps the token out of repopulated inputs', async () => {
	vi.mocked(fetch).mockResolvedValue(
		Response.json({ success: false, 'error-codes': ['timeout-or-duplicate'] })
	);
	const handler = vi.fn(() => 42);
	const form = safeForm(options, schema, handler);
	const result = await _submit(form, { title: 'milk', _turnstileToken: 'spent-token' });
	expect(result).toMatchObject({
		issues: [{ message: 'Please complete the verification and try again.' }]
	});
	expect(result.input).toEqual({ title: 'milk' });
	expect(handler).not.toHaveBeenCalled();
});

it('preserves native programmatic field errors after successful verification', async () => {
	const form = safeForm(options, schema, (_input, issue) => invalid(issue.title('Already exists')));
	expect(await _submit(form, { title: 'milk', _turnstileToken: 'token' })).toMatchObject({
		issues: [{ message: 'Already exists', path: ['title'] }]
	});
});

it('fails closed when Cloudflare is unavailable', async () => {
	vi.mocked(fetch).mockRejectedValue(new Error('Private provider detail'));
	const handler = vi.fn(() => 42);
	const form = safeForm(options, schema, handler);
	await expect(_submit(form, { title: 'milk', _turnstileToken: 'token' })).rejects.toMatchObject({
		status: 503
	});
	expect(handler).not.toHaveBeenCalled();
});

it('supports no-input forms with Turnstile', async () => {
	const handler = vi.fn(() => 42);
	const form = safeForm(options, handler);
	expectTypeOf(form).toEqualTypeOf<RemoteForm<void, number>>();
	expect(await _submit(form, {})).toHaveProperty('issues');
	expect(handler).not.toHaveBeenCalled();
	expect(await _submit(form, { _turnstileToken: 'token' })).toMatchObject({ result: 42 });
	expect(handler).toHaveBeenCalledExactlyOnceWith();
});

it('does not change unprotected forms or contact Cloudflare when the option is omitted', async () => {
	const form = safeForm({}, schema, (input) => input.title);
	expect(await _submit(form, { title: 'milk' })).toMatchObject({ result: 4 });
	expect(fetch).not.toHaveBeenCalled();
});

it('rejects invalid action configuration when declaring a protected form', () => {
	expect(() =>
		safeForm({ ...options, turnstile: { action: 'invalid action' } }, schema, () => 42)
	).toThrow();
});
