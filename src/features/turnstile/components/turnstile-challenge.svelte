<script lang="ts">
	// SVELTEKIT IMPORTS
	import { PUBLIC_TURNSTILE_KEY } from '$app/env/public';

	// LIBRARIES
	import { m } from '@/lib/paraglide/messages';
	import { getLocale } from '@/lib/paraglide/runtime';

	// COMPONENTS
	import { Button } from '@/components/ui/button';

	// UTILS
	import { loadTurnstile } from '@/features/turnstile/utils/loadTurnstile';

	// TYPES
	import type { TurnstileOptions } from '@/shared/features/turnstile/types/turnstileTypes';

	let { options, token = $bindable('') }: { options: TurnstileOptions; token?: string } = $props();

	let retry = $state(0);
	let failed = $state(false);
	let status = $state<string>(m['Turnstile.loading']());
	let width = $state(300);

	const siteKey = $derived(options.siteKey ?? PUBLIC_TURNSTILE_KEY);
	const size = $derived(width < 300 ? 'compact' : 'flexible');

	function retryChallenge() {
		token = '';
		failed = false;
		status = m['Turnstile.loading']();
		retry++;
	}

	function attachChallenge(element: HTMLDivElement) {
		const action = options.action;
		const key = siteKey;
		const widgetSize = size;

		token = '';

		let active = true;
		let removeWidget: (() => void) | undefined;

		function showFailure(message: string) {
			if (!active) return;
			token = '';
			failed = true;
			status = message;
		}

		if (!key) {
			showFailure(m['Turnstile.unavailable']());
			return;
		}

		void loadTurnstile()
			.then((api) => {
				if (!active) return;

				const widget = api.render(element, {
					sitekey: key,
					action,
					language: getLocale(),
					size: widgetSize,
					// The site is dark on every page, so the widget matches it instead of following the OS.
					theme: 'dark',
					'response-field': false,
					callback: (value) => {
						if (!active) return;
						token = value;
						failed = false;
						status = m['Turnstile.complete']();
					},
					'error-callback': () => showFailure(m['Turnstile.failed']()),
					'expired-callback': () => showFailure(m['Turnstile.expired']()),
					'timeout-callback': () => showFailure(m['Turnstile.timedOut']())
				});

				removeWidget = () => api.remove(widget);

				const awaitingVerification = !failed && !token;

				if (awaitingVerification) status = m['Turnstile.ready']();
			})
			.catch(() => showFailure(m['Turnstile.loadFailed']()));

		return () => {
			active = false;
			removeWidget?.();
		};
	}
</script>

<div class="flex min-w-0 flex-col gap-2">
	{#key retry}
		<div bind:clientWidth={width} {@attach attachChallenge}></div>
	{/key}

	<p class="text-sm text-muted-foreground" aria-live="polite">{status}</p>

	{#if failed}
		<Button type="button" variant="outline" size="sm" class="self-start" onclick={retryChallenge}>
			{m['Turnstile.retry']()}
		</Button>
	{/if}

	<noscript
		><p class="text-sm text-destructive">
			{m['Turnstile.enableJavaScript']()}
		</p></noscript
	>
</div>
