<script lang="ts">
	// SVELTEKIT IMPORTS
	import { page } from '$app/state';

	// LIBRARIES
	import { m } from '@/lib/paraglide/messages';
	import { getLocale, locales } from '@/lib/paraglide/runtime';

	// COMPONENTS
	import Link from '@/components/ui/custom-components/link/link.svelte';

	// TYPES
	import type { Locale } from '@/lib/paraglide/runtime';

	/** `menu`: compact "EN" button with a dropdown, for the header. `list`: a plain row, for the footer. */
	let { variant = 'menu' }: { variant?: 'menu' | 'list' } = $props();

	const menuId = $props.id();
	const currentLocale = getLocale();

	// Each language is shown in its own language ("Español", not "Spanish"), so visitors find theirs.
	function formatLanguageName(locale: Locale) {
		const name = new Intl.DisplayNames([locale], { type: 'language' }).of(locale) ?? locale;
		return name.charAt(0).toLocaleUpperCase(locale) + name.slice(1);
	}

	const languages = locales.map((locale) => ({ locale, name: formatLanguageName(locale) }));
	const currentName = formatLanguageName(currentLocale);
</script>

{#if variant === 'menu'}
	<button
		type="button"
		popovertarget={menuId}
		aria-label={m['LanguageSwitcher.menuLabel']({ language: currentName })}
		class="language-trigger flex h-10 items-center gap-1.5 rounded-full px-3 text-sm font-bold uppercase transition-colors hover:bg-foreground/10 hover:text-primary"
	>
		<span class="icon-[lucide--globe] size-4" aria-hidden="true"></span>
		{currentLocale}
		<span class="icon-[lucide--chevron-down] size-3.5" aria-hidden="true"></span>
	</button>

	<nav
		id={menuId}
		popover
		aria-label={m['LanguageSwitcher.label']()}
		class="language-menu min-w-40 rounded-2xl border border-border bg-card p-1.5 text-card-foreground shadow-2xl"
	>
		<ul>
			{#each languages as language (language.locale)}
				<li>
					<Link
						href={page.url.pathname}
						locale={language.locale}
						hreflang={language.locale}
						lang={language.locale}
						aria-current={language.locale === currentLocale ? 'true' : undefined}
						data-sveltekit-reload
						class="flex items-center justify-between gap-4 rounded-xl px-3 py-2.5 font-semibold transition-colors hover:bg-foreground/10 aria-current:text-primary"
					>
						{language.name}
						{#if language.locale === currentLocale}
							<span class="icon-[lucide--check] size-4" aria-hidden="true"></span>
						{/if}
					</Link>
				</li>
			{/each}
		</ul>
	</nav>
{:else}
	<nav aria-label={m['LanguageSwitcher.label']()}>
		<ul class="flex flex-wrap items-center gap-x-4 gap-y-2">
			<li aria-hidden="true">
				<span class="icon-[lucide--globe] size-4 text-muted-foreground"></span>
			</li>
			{#each languages as language (language.locale)}
				<li>
					<Link
						href={page.url.pathname}
						locale={language.locale}
						hreflang={language.locale}
						lang={language.locale}
						aria-current={language.locale === currentLocale ? 'true' : undefined}
						data-sveltekit-reload
						class="text-sm font-semibold text-muted-foreground transition-colors hover:text-primary aria-current:text-foreground"
					>
						{language.name}
					</Link>
				</li>
			{/each}
		</ul>
	</nav>
{/if}

<style>
	/* The dropdown opens under its button, right-aligned; browsers without anchor positioning centre it. */
	.language-trigger {
		anchor-name: --language-trigger;
	}

	.language-menu {
		position-anchor: --language-trigger;
		inset: auto;
		top: anchor(bottom);
		right: anchor(right);
		margin: 0.5rem 0 0;
		position-try-fallbacks: flip-block;
	}
</style>
