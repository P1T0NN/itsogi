/* oxlint-disable anti-slop/no-module-mocking -- These framework-owned route globals need a faithful test implementation. */
import { afterEach, expect, it, vi } from 'vitest';
import { useSearchParams } from '../useSearchParams.svelte';

const environment = vi.hoisted(() => ({ browser: true }));
const route = vi.hoisted(() => ({ url: new URL('https://example.com/base/en/todo?filter=open') }));
vi.mock('$app/env', () => environment);
vi.mock('$app/state', () => ({ page: route }));

afterEach(() => vi.unstubAllGlobals());

it('builds pagination links on the server without a window', () => {
	environment.browser = false;
	try {
		expect(useSearchParams(['cursor', 'page']).buildUrl({ cursor: 'saved', page: '3' })).toBe(
			'/base/en/todo?filter=open&cursor=saved&page=3'
		);
	} finally {
		environment.browser = true;
	}
});

it('builds a page URL while preserving the base, locale, other parameters, and hash', () => {
	const current = new URL('https://example.com/base/en/todo?filter=open&tag=a&tag=b&page=210#list');
	vi.stubGlobal('window', { location: current });
	const params = useSearchParams(['page']);
	expect(params.buildUrl({ page: '211', filter: 'closed' })).toBe(
		'/base/en/todo?filter=open&tag=a&tag=b&page=211#list'
	);
	expect(current.search).toBe('?filter=open&tag=a&tag=b&page=210');
});

it('removes every page parameter when returning to the first page', () => {
	vi.stubGlobal('window', {
		location: new URL('https://example.com/todo?filter=open&page=210&page=211')
	});
	expect(useSearchParams(['page']).buildUrl({ page: '' })).toBe('/todo?filter=open');
});

it('clears omitted owned keys and safely encodes their new values', () => {
	vi.stubGlobal('window', {
		location: new URL('https://example.com/todo?query=old&page=2&filter=open')
	});
	expect(useSearchParams(['query', 'page']).buildUrl({ query: 'a&b c' })).toBe(
		'/todo?filter=open&query=a%26b+c'
	);
});
