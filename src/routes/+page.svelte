<script lang="ts">
	// SVELTEKIT
	import { PUBLIC_ORIGIN } from '$app/env/public';

	// LIBRARIES
	import { m } from '@/lib/paraglide/messages';

	// CONFIG
	import { EVENTS } from '@/features/events/config';
	import { COMPANY_DATA } from '@/shared/config';

	// COMPONENTS
	import SvelteHead from '@/components/ui/custom-components/svelte-head/svelte-head.svelte';
	import HomeHeroSection from '@/components/pages/(unprotected)/home/home-hero-section/home-hero-section.svelte';
	import HomeMarqueeSection from '@/components/pages/(unprotected)/home/home-marquee-section/home-marquee-section.svelte';
	import HomeWinstreakSection from '@/components/pages/(unprotected)/home/home-winstreak-section/home-winstreak-section.svelte';
	import HomeNextEventSection from '@/components/pages/(unprotected)/home/home-next-event-section/home-next-event-section.svelte';
	import HomeReelSection from '@/components/pages/(unprotected)/home/home-reel-section/home-reel-section.svelte';
	import HomeClosingSection from '@/components/pages/(unprotected)/home/home-closing-section/home-closing-section.svelte';
	import HomeContactSection from '@/components/pages/(unprotected)/home/home-contact-section/home-contact-section.svelte';

	// UTILS
	import { formatSportsEventJsonLd } from '@/features/events/utils/formatSportsEventJsonLd';
	import { selectUpcomingEvents } from '@/features/events/utils/selectUpcomingEvents';
	import { formatPrize } from '@/features/winstreak/utils/formatPrize';
	import { formatSiteOrigin } from '@/shared/features/seo/utils/formatSiteOrigin';
	import { readCurrentTimestampSeconds } from '@/shared/features/time/utils/readCurrentTimestampSeconds';

	const origin = $derived(formatSiteOrigin(PUBLIC_ORIGIN));

	// Upcoming events as structured data, so search and AI answers can show the date, place and prize.
	const eventsJsonLd = $derived(
		selectUpcomingEvents(EVENTS, readCurrentTimestampSeconds()).map((event) => {
			const rivals = event.beatKey ? m[event.beatKey]() : COMPANY_DATA.NAME;
			const description = event.prize
				? m['HomePage.SEO.eventDescriptionWithPrize']({ prize: formatPrize(event.prize), rivals })
				: m['HomePage.SEO.eventDescription']();

			return formatSportsEventJsonLd({
				event,
				startsAtSeconds: event.startsAtSeconds,
				origin,
				performerId: `${origin}/#person`,
				name: m['HomePage.SEO.eventName']({ place: event.place }),
				description
			});
		})
	);
</script>

<SvelteHead
	title={m['HomePage.SEO.title']()}
	description={m['HomePage.SEO.description']()}
	suffixSiteName={false}
	jsonLd={eventsJsonLd}
/>

<main>
	<HomeHeroSection />
	<HomeMarqueeSection />
	<HomeWinstreakSection />
	<HomeNextEventSection />
	<HomeReelSection />
	<HomeClosingSection />
	<HomeContactSection />
</main>
