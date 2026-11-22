import { error, isHttpError, redirect } from '@sveltejs/kit';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { paraglideMiddleware } from '@/lib/paraglide/server';
import '@/shared/features/errors/config';
import { handleRemoteFunctionsError } from '../utils/handleRemoteFunctionsError';

function _createHttpError(status: number, properties: Omit<App.Error, 'status' | 'message'> = {}) {
	try {
		error(status, 'Private database detail', properties);
	} catch (cause) {
		if (!isHttpError(cause)) throw cause;
		return cause;
	}
}

describe('safe remote error presentation', () => {
	it.each([500, 502, 503, 504, 599])('uses a generic message for HTTP %s', (status) => {
		const cause = _createHttpError(status);
		const notify = vi.fn();

		expect(handleRemoteFunctionsError(cause, notify)).toBe(true);
		expect(notify).toHaveBeenCalledExactlyOnceWith('Something went wrong. Please try again.');
	});

	it.each([
		{ retryAfter: 42, message: 'Too many requests. Try again in 42 seconds.' },
		{ retryAfter: 1, message: 'Too many requests. Try again in 1 second.' },
		{ retryAfter: 1.2, message: 'Too many requests. Try again in 2 seconds.' },
		{ retryAfter: undefined, message: 'Too many requests. Please try again later.' },
		{ retryAfter: 0, message: 'Too many requests. Please try again later.' },
		{ retryAfter: -1, message: 'Too many requests. Please try again later.' }
	])('preserves the 429 toast with retryAfter=$retryAfter', ({ retryAfter, message }) => {
		const cause = _createHttpError(429, { retryAfter });
		const notify = vi.fn();

		expect(handleRemoteFunctionsError(cause, notify)).toBe(true);
		expect(notify).toHaveBeenCalledExactlyOnceWith(message);
	});

	it('uses the Spanish request locale for validation and retry messages', async () => {
		const notify = vi.fn();
		await paraglideMiddleware(new Request('https://example.test/es'), () => {
			const result = z.string().min(2).safeParse('a');
			expect(result.error?.issues[0].message).toBe('Introduce al menos 2 caracteres.');
			expect(handleRemoteFunctionsError(_createHttpError(429, { retryAfter: 1 }), notify)).toBe(
				true
			);
			expect(notify).toHaveBeenCalledExactlyOnceWith(
				'Demasiadas solicitudes. Vuelve a intentarlo en 1 segundo.'
			);
			return new Response();
		});
	});

	it.each([400, 401, 403, 404])('leaves HTTP %s for the caller to propagate', (status) => {
		const notify = vi.fn();
		expect(handleRemoteFunctionsError(_createHttpError(status), notify)).toBe(false);
		expect(notify).not.toHaveBeenCalled();
	});

	it('leaves raw errors, plain initial-page bodies and redirects unhandled by the toast handler', () => {
		const notify = vi.fn();
		expect(handleRemoteFunctionsError(new Error('Private database detail'), notify)).toBe(false);
		expect(handleRemoteFunctionsError(_createHttpError(503).body, notify)).toBe(false);
		try {
			redirect(303, '/login');
		} catch (cause) {
			expect(handleRemoteFunctionsError(cause, notify)).toBe(false);
		}
		expect(notify).not.toHaveBeenCalled();
	});
});
