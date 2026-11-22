<script lang="ts">
	// SVELTEKIT
	import { page } from '$app/state';
	import { innerHeight, scrollY } from 'svelte/reactivity/window';

	// LIBRARIES
	import { m } from '@/lib/paraglide/messages';

	// HELPERS
	import { trackEvent } from '@/features/analytics/helpers/trackEvent';

	// CONFIG
	import { COMPANY_DATA, HEADER_SECTIONS } from '@/shared/config';

	// COMPONENTS
	import Link from '@/components/ui/custom-components/link/link.svelte';
	import Logo from '@/components/ui/custom-components/logo/logo.svelte';
	import LanguageSwitcher from '@/components/ui/custom-components/language-switcher/language-switcher.svelte';
	import HeaderMobileMenu from './header-mobile-menu.svelte';

	// UTILS
	import { i18nHref } from '@/utils/i18nHref';

	// A section counts as current once its top passes this share of the viewport.
	const ACTIVE_LINE = 0.35;

	// On the home page the header floats over the hero until the visitor scrolls.
	const onHome = $derived(page.url.pathname === i18nHref('/'));
	const scrolled = $derived((scrollY.current ?? 0) > 8);
	const solid = $derived(!onHome || scrolled);
	const activeId = $derived(findActiveSection(scrollY.current, innerHeight.current));

	function findActiveSection(offset: number | undefined, viewportHeight: number | undefined) {
		const cannotMeasure = !onHome || offset === undefined || viewportHeight === undefined;
		if (cannotMeasure) return null;

		// The last section is too short to reach the line, so the page bottom selects it.
		const atPageBottom = offset + viewportHeight >= document.documentElement.scrollHeight - 2;
		if (atPageBottom) return HEADER_SECTIONS.at(-1)?.id ?? null;

		let active: string | null = null;
		for (const section of HEADER_SECTIONS) {
			const top = document.getElementById(section.id)?.getBoundingClientRect().top;
			const hasReachedLine = top !== undefined && top <= viewportHeight * ACTIVE_LINE;
			if (hasReachedLine) active = section.id;
		}
		return active;
	}
</script>

<header
	class={[
		'inset-x-0 top-0 z-30 border-b text-foreground transition-colors duration-300',
		onHome ? 'fixed' : 'sticky',
		solid ? 'border-border bg-background' : 'border-transparent'
	]}
>
	<div
		class="mx-auto grid min-h-20 max-w-7xl grid-cols-2 items-center gap-3 px-4 sm:px-6 lg:grid-cols-3 lg:px-10"
	>
		<Link
			href="/"
			class="justify-self-start rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
		>
			<Logo showText={false} imageClass="size-11" />
		</Link>

		<!-- Below lg the pill and socials no longer fit; the hamburger menu replaces them. -->
		<nav aria-label={m['Header.mainNavigation']()} class="hidden justify-self-center lg:block">
			<ul
				class="flex items-center gap-0.5 rounded-full bg-background/50 p-1 ring-1 ring-foreground/15"
			>
				{#each HEADER_SECTIONS as section (section.id)}
					<li>
						<Link
							href="/#{section.id}"
							aria-current={activeId === section.id ? 'location' : undefined}
							class="block rounded-full px-4 py-2 text-sm font-semibold tracking-wide text-foreground/80 uppercase font-stretch-semi-condensed transition-colors not-aria-[current=location]:hover:text-primary aria-[current=location]:bg-primary aria-[current=location]:text-primary-foreground"
						>
							{m[section.label]()}
						</Link>
					</li>
				{/each}
			</ul>
		</nav>

		<div class="hidden items-center gap-1 justify-self-end lg:flex">
			<a
				href={COMPANY_DATA.TIKTOK_URL}
				onclick={() =>
					trackEvent('social_follow_clicked', { platform: 'TikTok', location: 'header' })}
				target="_blank"
				rel="external noopener noreferrer"
				class="flex size-10 items-center justify-center rounded-full transition-colors hover:bg-foreground/10 hover:text-primary"
			>
				<span class="icon-[simple-icons--tiktok] size-4.5" aria-hidden="true"></span>
				<span class="sr-only">TikTok</span>
			</a>

			<a
				href={COMPANY_DATA.INSTAGRAM_URL}
				onclick={() =>
					trackEvent('social_follow_clicked', { platform: 'Instagram', location: 'header' })}
				target="_blank"
				rel="external noopener noreferrer"
				class="flex size-10 items-center justify-center rounded-full transition-colors hover:bg-foreground/10 hover:text-primary"
			>
				<span class="icon-[simple-icons--instagram] size-4.5" aria-hidden="true"></span>
				<span class="sr-only">Instagram</span>
			</a>

			<a
				href={COMPANY_DATA.YOUTUBE_URL}
				onclick={() =>
					trackEvent('social_follow_clicked', { platform: 'YouTube', location: 'header' })}
				target="_blank"
				rel="external noopener noreferrer"
				class="flex size-10 items-center justify-center rounded-full transition-colors hover:bg-foreground/10 hover:text-primary"
			>
				<span class="icon-[simple-icons--youtube] size-4.5" aria-hidden="true"></span>
				<span class="sr-only">YouTube</span>
			</a>

			<span class="mx-1 h-5 w-px bg-border" aria-hidden="true"></span>
			<LanguageSwitcher />
		</div>

		<div class="justify-self-end lg:hidden">
			<HeaderMobileMenu {activeId} />
		</div>
	</div>
</header>
