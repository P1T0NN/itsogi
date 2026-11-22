// SVELTEKIT IMPORTS
import { browser } from '$app/env';
import { goto } from '$app/navigation';
import { page } from '$app/state';
import { createSubscriber, SvelteURL, SvelteURLSearchParams } from 'svelte/reactivity';

const SEARCH_PARAMS_CHANGE_EVENT = 'app:search-params-change';

function _formatSearchParams(
	current: URLSearchParams,
	keys: string[],
	values: Record<string, string>
): string {
	const params = new SvelteURLSearchParams(current);
	for (const key of keys) {
		params.delete(key);
		const value = values[key];
		if (value) params.set(key, value);
	}
	return params.toString();
}

/**
 * Universal URL search-params plumbing. `keys` are the params this hook
 * *owns*: `write` updates only them and preserves every other param, the
 * pathname and the hash. Reading is unrestricted — `get`/`read` work for any
 * key. Callers keep their own `$state` (debounce, min-chars, mode) on top.
 *
 * Writes are shallow (`goto` with `shallow: true`). Reads use the browser's
 * current URL and react to shallow writes and back/forward, even when
 * `page.url` is unchanged.
 *
 * `get(key)` — raw read (`string | null`, matches `URLSearchParams.get`).
 * `read(key)` — read with `''` fallback (the string url-mode state wants).
 * `write(values)` updates the owned params (replace history by default; pass
 * `{ history: 'push' }` when each change should create a history entry).
 * `buildUrl(values)` — current-route URL with the owned params updated;
 * use with `goto` when the change must load new page data.
 * `href(pathname, values)` — link target for the owned params (only non-empty
 * values) on another route; for anchors or `goto`.
 * `onPopState(cb)` — re-run `cb` on back/forward; returns the cleanup.
 */
export function useSearchParams(
	keys: string[] | (() => string[]) = [],
	{ history = 'replace' }: { history?: 'replace' | 'push' } = {}
) {
	const getKeys = Array.isArray(keys) ? () => keys : keys;
	const subscribeToHistory = createSubscriber((update) => {
		const unsubscribe = onPopState(update);
		window.addEventListener(SEARCH_PARAMS_CHANGE_EVENT, update);
		return () => {
			unsubscribe();
			window.removeEventListener(SEARCH_PARAMS_CHANGE_EVENT, update);
		};
	});
	const get = (key: string): string | null => {
		subscribeToHistory();
		// Track full SvelteKit navigations as well as shallow history changes.
		const url = page.url;
		return (browser ? new SvelteURL(window.location.href) : url).searchParams.get(key);
	};

	const read = (key: string): string => get(key) ?? '';

	function buildUrl(values: Record<string, string>): string {
		const url = new SvelteURL(browser ? window.location.href : page.url.href);
		url.search = _formatSearchParams(url.searchParams, getKeys(), values);
		return `${url.pathname}${url.search}${url.hash}`;
	}

	function href(pathname: string, values: Record<string, string>): string {
		const search = _formatSearchParams(new SvelteURLSearchParams(), getKeys(), values);
		return search ? `${pathname}?${search}` : pathname;
	}

	async function write(values: Record<string, string>): Promise<void> {
		const url = buildUrl(values);
		const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
		if (url !== currentUrl) {
			// eslint-disable-next-line svelte/no-navigation-without-resolve -- buildUrl preserves the current base path and locale.
			await goto(url, { state: {}, shallow: true, replace: history === 'replace' });
			// Shallow navigation does not update page.url or emit popstate.
			window.dispatchEvent(new Event(SEARCH_PARAMS_CHANGE_EVENT));
		}
	}

	function onPopState(callback: () => void): () => void {
		const handler = () => callback();
		window.addEventListener('popstate', handler);
		return () => window.removeEventListener('popstate', handler);
	}

	return { get, read, write, buildUrl, href, onPopState };
}
