import { afterEach, expect, it, vi } from 'vitest';
import { dev } from '$app/env';
import { handle } from '@/hooks.server';

// TYPES
import type { RequestEvent } from '@sveltejs/kit';

const internalModuleName = '@sveltejs/kit/internal/server';
const {
	with_request_store
}: {
	with_request_store: <Output>(
		store: { event: RequestEvent; state: { remote: { data: null; implicit: null } } },
		callback: () => Output
	) => Output;
} = await import(internalModuleName);

afterEach(() => vi.restoreAllMocks());

function _event(url = 'http://localhost:5173/', isRemoteRequest = false) {
	const requestUrl = new URL(url);
	const request = new Request(url);
	const cookies: RequestEvent['cookies'] = {
		get: () => undefined,
		getAll: () => [],
		set: vi.fn(),
		delete: vi.fn(),
		parse: vi.fn(),
		serialize: () => ''
	};
	// SAFETY: the hook chain only accesses these fields; resolve is supplied by each test.
	return {
		url: requestUrl,
		request,
		locals: {},
		cookies,
		isRemoteRequest
	} as RequestEvent;
}

function _respond(event: RequestEvent, response: Response) {
	return with_request_store({ event, state: { remote: { data: null, implicit: null } } }, () =>
		handle({
			event,
			resolve: async () => {
				return response;
			}
		})
	);
}

it('wraps immutable redirects without changing their status or location', async () => {
	const original = Response.redirect('https://example.test/sign-in', 303);
	const response = await _respond(_event(), original);

	expect(response.status).toBe(303);
	expect(response.headers.get('location')).toBe('https://example.test/sign-in');
	expect(response.headers.get('x-content-type-options')).toBe('nosniff');
	expect(response.headers.get('referrer-policy')).toBe('strict-origin-when-cross-origin');
	expect(response.headers.get('x-frame-options')).toBe('DENY');
	expect(response.headers.get('permissions-policy')).toBe(
		'camera=(), microphone=(), geolocation=()'
	);
});

it('preserves streamed errors, CSP, retry headers and separate cookies', async () => {
	const headers = new Headers({
		'Content-Security-Policy': "script-src 'self' 'nonce-example'",
		'Retry-After': '30'
	});
	headers.append('Set-Cookie', 'first=1; Path=/; HttpOnly');
	headers.append('Set-Cookie', 'second=2; Path=/; HttpOnly');
	const original = new Response('Too many requests', { status: 429, headers });
	const response = await _respond(_event(), original);

	expect(response.status).toBe(429);
	expect(response.headers.get('content-security-policy')).toBe("script-src 'self' 'nonce-example'");
	expect(response.headers.get('retry-after')).toBe('30');
	expect(response.headers.getSetCookie()).toEqual(headers.getSetCookie());
	expect(response.headers.get('cache-control')).toBe('private, no-store');
	expect(await response.text()).toBe('Too many requests');
});

it.each(['remote', 'authorization'])(
	'prevents shared caching of %s responses even if a handler requested public caching',
	async (kind) => {
		const event = _event('http://localhost:5173/', kind === 'remote');
		if (kind === 'authorization') event.request.headers.set('Authorization', 'Bearer example');
		const original = new Response(null, { headers: { 'Cache-Control': 'public, max-age=3600' } });
		const response = await _respond(event, original);

		expect(response.headers.get('cache-control')).toBe('private, no-store');
	}
);

it('preserves public caching and omits HSTS over HTTP', async () => {
	const original = new Response('public', { headers: { 'Cache-Control': 'public, max-age=60' } });
	const response = await _respond(_event(), original);

	expect(response.headers.get('cache-control')).toBe('public, max-age=60');
	expect(response.headers.has('strict-transport-security')).toBe(false);
});

it('only advertises HSTS for HTTPS outside development', async () => {
	const event = _event('https://example.test/');
	const response = await _respond(event, new Response(null));

	expect(response.headers.get('strict-transport-security')).toBe(dev ? null : 'max-age=31536000');
});

it('permanently redirects the English prefix to the unprefixed URL, keeping the query', async () => {
	const response = await _respond(
		_event('http://localhost:5173/en?ref=tiktok'),
		new Response('page')
	);

	expect(response.status).toBe(308);
	expect(response.headers.get('location')).toBe('/?ref=tiktok');
});
