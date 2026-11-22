import { expect, it, vi } from 'vitest';
import { verifyTurnstile } from '../helpers/verifyTurnstile';

it('posts the token privately and requires matching action and hostname', async () => {
	const request = vi
		.fn<typeof fetch>()
		.mockResolvedValue(
			Response.json({ success: true, action: 'createTodo', hostname: 'example.test' })
		);
	const dependencies = { secret: 'private-test-secret', fetch: request };
	expect(await verifyTurnstile('token', 'createTodo', 'example.test', dependencies)).toBe(true);
	const [url, options] = request.mock.calls[0];
	expect(url).toBe('https://challenges.cloudflare.com/turnstile/v0/siteverify');
	expect(options?.method).toBe('POST');
	expect(options?.body).toEqual(
		new URLSearchParams({ secret: 'private-test-secret', response: 'token' })
	);
	expect(options?.signal).toBeInstanceOf(AbortSignal);
});

it.each([
	{ success: true, hostname: 'example.com', 'error-codes': [] },
	{ success: true, hostname: 'localhost', action: 'test', cdata: 'test-data' }
])(
	'accepts successful Cloudflare test-key metadata for a local form action: %j',
	async (response) => {
		const request = vi.fn<typeof fetch>().mockResolvedValue(Response.json(response));
		expect(
			await verifyTurnstile('XXXX.DUMMY.TOKEN.XXXX', 'createTodo', '127.0.0.1', {
				secret: '1x0000000000000000000000000000000AA',
				fetch: request
			})
		).toBe(true);
		expect(request).toHaveBeenCalledTimes(1);
	}
);

it('does not accept a failed provider response with the public passing test key', async () => {
	const request = vi.fn<typeof fetch>().mockResolvedValue(Response.json({ success: false }));
	expect(
		await verifyTurnstile('XXXX.DUMMY.TOKEN.XXXX', 'createTodo', 'localhost', {
			secret: '1x0000000000000000000000000000000AA',
			fetch: request
		})
	).toBe(false);
});

it.each([
	{ success: false, 'error-codes': ['timeout-or-duplicate'] },
	{ success: true, action: 'otherAction', hostname: 'example.test' },
	{ success: true, action: 'createTodo', hostname: 'other.test' },
	{ success: true, hostname: 'example.com', 'error-codes': [] },
	{ success: true, hostname: 'localhost', action: 'test', cdata: 'test-data' },
	{ success: true }
])('rejects unsuccessful or mismatched verification: %j', async (response) => {
	const request = vi.fn<typeof fetch>().mockResolvedValue(Response.json(response));
	expect(
		await verifyTurnstile('token', 'createTodo', 'example.test', {
			secret: 'secret',
			fetch: request
		})
	).toBe(false);
});

it.each(['', 'x'.repeat(2049)])(
	'rejects invalid token lengths before contacting Cloudflare',
	async (token) => {
		const request = vi.fn<typeof fetch>();
		expect(
			await verifyTurnstile(token, 'createTodo', 'example.test', {
				secret: 'secret',
				fetch: request
			})
		).toBe(false);
		expect(request).not.toHaveBeenCalled();
	}
);

it('fails closed when the private key is missing', async () => {
	const request = vi.fn<typeof fetch>();
	await expect(
		verifyTurnstile('token', 'createTodo', 'example.test', { secret: undefined, fetch: request })
	).rejects.toMatchObject({ status: 503 });
	expect(request).not.toHaveBeenCalled();
});

it.each([
	() => new Response(null, { status: 503 }),
	() => new Response('invalid JSON'),
	() => Response.json({ success: 'yes' }),
	() => {
		throw new DOMException('Timed out', 'TimeoutError');
	}
])('fails closed on provider, network and malformed-response failures', async (respond) => {
	const request = vi.fn<typeof fetch>().mockImplementation(async () => respond());
	await expect(
		verifyTurnstile('token', 'createTodo', 'example.test', { secret: 'secret', fetch: request })
	).rejects.toMatchObject({ status: 503 });
	expect(request).toHaveBeenCalledTimes(1);
});
