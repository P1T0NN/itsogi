<script lang="ts">
	// LIBRARIES
	import { m } from '@/lib/paraglide/messages';

	// HELPERS
	import { trackEvent } from '@/features/analytics/helpers/trackEvent';

	// CONFIG
	import { HERO_PHOTO } from '@/shared/config';

	// COMPONENTS
	import Link from '@/components/ui/custom-components/link/link.svelte';
	import Crown from '@/components/ui/custom-components/design-elements/crown.svelte';
	import StaticImage from '@/components/ui/custom-components/static-image/static-image.svelte';
</script>

<section class="relative isolate flex min-h-svh overflow-hidden bg-background text-foreground">
	<img
		src={HERO_PHOTO.src}
		srcset={HERO_PHOTO.srcset}
		sizes={HERO_PHOTO.sizes}
		alt={m['HomePage.HomeHeroSection.photoAlt']()}
		fetchpriority="high"
		class="hero-photo absolute inset-0 -z-20 size-full object-cover md:left-auto md:w-3/5 md:mask-l-from-50%"
		style:--hero-photo-focus={HERO_PHOTO.focus}
	/>
	<!-- Phones: dim the photo and fade it out at the bottom. Desktop: fade into black from the left. -->
	<div
		class="absolute inset-0 -z-10 bg-linear-to-t from-background via-background/60 via-30% to-background/30 md:bg-linear-to-r md:from-25% md:via-background/70 md:via-50% md:to-transparent"
		aria-hidden="true"
	></div>
	<div
		class="absolute inset-x-0 top-0 -z-10 h-40 bg-linear-to-b from-background/80 to-transparent"
		aria-hidden="true"
	></div>

	<div
		class="mx-auto flex w-full max-w-7xl flex-col items-center justify-center px-4 pt-36 pb-48 text-center sm:px-6 md:pt-28 md:pb-72 lg:px-10"
	>
		<Crown class="mb-3 w-20 sm:w-24 lg:w-28" />
		<StaticImage
			src="logo/opt/ogi-wordmark-transparent-primary-color-640w.webp"
			alt="Ogi"
			width={640}
			height={213}
			class="mb-2 w-32 sm:w-40 lg:w-48"
		/>

		<h1
			class="font-heading text-7xl leading-none font-black uppercase font-stretch-extra-condensed sm:text-8xl lg:text-9xl"
		>
			{m['HomePage.HomeHeroSection.titleStart']()}
			<span class="text-primary normal-case">{m['HomePage.HomeHeroSection.titleHighlight']()}</span>
		</h1>

		<div class="mt-10 flex flex-wrap items-center justify-center gap-3">
			<Link
				href="/#events"
				onclick={() => trackEvent('hero_cta_clicked', { cta: 'next_event' })}
				class="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-4 font-bold text-primary-foreground transition-colors hover:bg-foreground hover:text-background"
			>
				<span class="icon-[lucide--calendar] size-4.5" aria-hidden="true"></span>
				{m['HomePage.HomeHeroSection.nextEvent']()}
			</Link>
			<Link
				href="/#streak"
				onclick={() => trackEvent('hero_cta_clicked', { cta: 'see_streak' })}
				class="inline-flex items-center gap-2 rounded-full px-6 py-4 font-bold ring-2 ring-foreground/25 transition-colors hover:bg-foreground hover:text-background"
			>
				{m['HomePage.HomeHeroSection.seeStreak']()}
				<span class="icon-[lucide--arrow-down] size-4" aria-hidden="true"></span>
			</Link>
		</div>
	</div>
</section>

<style>
	.hero-photo {
		object-position: var(--hero-photo-focus);
	}

	@media (width < 48rem) {
		.hero-photo {
			/* Stop shifting once the photo reaches the left edge. */
			object-position: min(0px, 50% + 24vw) 85%;
		}
	}
</style>
