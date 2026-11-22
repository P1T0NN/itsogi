import { TURNSTILE_CONFIG } from '@/shared/features/turnstile/config';

type TurnstileApi = {
	render(
		element: HTMLElement,
		options: {
			sitekey: string;
			action: string;
			language: string;
			size: 'flexible' | 'compact';
			theme: 'light' | 'dark' | 'auto';
			'response-field': false;
			callback: (token: string) => void;
			'error-callback': () => void;
			'expired-callback': () => void;
			'timeout-callback': () => void;
		}
	): string;
	remove(widgetId: string): void;
};

declare global {
	interface Window {
		turnstile?: TurnstileApi;
	}
}

let pending: Promise<TurnstileApi> | undefined;

export function loadTurnstile(): Promise<TurnstileApi> {
	if (pending) return pending;

	pending = new Promise<TurnstileApi>((resolve, reject) => {
		const script = document.createElement('script');
		const timeout = window.setTimeout(_fail, 15000);

		function _fail() {
			window.clearTimeout(timeout);
			script.remove();
			pending = undefined;
			reject(new Error('Turnstile script failed to load'));
		}

		script.src = TURNSTILE_CONFIG.SCRIPT_URL;
		script.async = true;
		script.onerror = _fail;
		script.onload = () => {
			const api = window.turnstile;
			if (!api) {
				_fail();
				return;
			}
			window.clearTimeout(timeout);
			resolve(api);
		};
		document.head.append(script);
	});

	return pending;
}
