<script lang="ts">
	// UTILS
	import { i18nHref } from '@/utils/i18nHref';

	// TYPES
	import type { Locale } from '@/lib/paraglide/runtime';
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	type Props = HTMLAnchorAttributes & {
		href: string;
		locale?: Locale;
		resolved?: boolean;
		children?: Snippet;
	};

	let { href, locale, resolved = false, children, ...rest }: Props = $props();
</script>

<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- Resolved URLs already include the base path and locale; i18nHref resolves other URLs. -->
<a {...rest} href={resolved ? href : i18nHref(href, { locale })}>
	{@render children?.()}
</a>
