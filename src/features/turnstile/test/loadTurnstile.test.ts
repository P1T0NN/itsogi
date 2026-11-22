import { afterEach, expect, it, vi } from 'vitest';
import { loadTurnstile } from '../utils/loadTurnstile';

afterEach(() => {
	vi.unstubAllGlobals();
	vi.useRealTimers();
});

it('resolves after the async script loads without calling the incompatible ready API', async () => {
	vi.useFakeTimers();
	const script = {
		src: '',
		async: false,
		onload: () => {},
		onerror: () => {},
		remove: vi.fn()
	};
	const api = {
		render: vi.fn(),
		remove: vi.fn(),
		ready: vi.fn((callback: () => void) => {
			if (script.async) {
				throw new Error(
					'[Cloudflare Turnstile] Remove async/defer from the Turnstile api.js script tag before using turnstile.ready().'
				);
			}
			callback();
		})
	};
	const append = vi.fn();
	vi.stubGlobal('window', { setTimeout, clearTimeout, turnstile: api });
	vi.stubGlobal('document', { createElement: () => script, head: { append } });

	const first = loadTurnstile();
	const second = loadTurnstile();
	expect(first).toBe(second);
	expect(append).toHaveBeenCalledExactlyOnceWith(script);
	expect(script.async).toBe(true);
	expect(() => script.onload()).not.toThrow();
	await expect(first).resolves.toBe(api);
	expect(api.ready).not.toHaveBeenCalled();
	expect(vi.getTimerCount()).toBe(0);
});
