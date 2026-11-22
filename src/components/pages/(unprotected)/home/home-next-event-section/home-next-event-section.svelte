<script lang="ts">
	// LIBRARIES
	import { m } from '@/lib/paraglide/messages';
	import { baseLocale, getLocale } from '@/lib/paraglide/runtime';

	// CONFIG
	import { EVENTS, EVENT_TIME_ZONE } from '@/features/events/config';

	// COMPONENTS
	import AngledEdge from '@/components/ui/custom-components/design-elements/angled-edge.svelte';
	import Floodlights from '@/components/ui/custom-components/design-elements/floodlights.svelte';
	import HomeNextEventSectionContent from './home-next-event-section-content.svelte';
	import HomeNextEventSectionEmpty from './home-next-event-section-empty.svelte';

	// UTILS
	import { calculateRelativeDay } from '@/features/events/utils/calculateRelativeDay';
	import { selectPreviousEvent } from '@/features/events/utils/selectPreviousEvent';
	import { selectUpcomingEvents } from '@/features/events/utils/selectUpcomingEvents';
	import { formatDateLabel } from '@/shared/features/time/utils/formatDateLabel';
	import { readCurrentTimestampSeconds } from '@/shared/features/time/utils/readCurrentTimestampSeconds';

	// TYPES
	import type { GameEvent, UpcomingGameEvent } from '@/features/events/types/eventsTypes';

	// shortcut: worked out once with the render-time clock, so a game that ends, or "Tomorrow" turning
	// into "Today", while the page is open only updates on reload.
	const nowSeconds = readCurrentTimestampSeconds();
	const locale = getLocale();
	const dateLocale = locale === baseLocale ? undefined : locale;

	function labelEvent(event: GameEvent & { startsAtSeconds: number }): UpcomingGameEvent {
		const date = new Date(event.startsAt);
		const calendarDay = formatDateLabel(
			date,
			{ day: 'numeric', month: 'long' },
			EVENT_TIME_ZONE,
			dateLocale
		);
		const clock = formatDateLabel(
			date,
			{ hour: '2-digit', minute: '2-digit', hourCycle: 'h23' },
			EVENT_TIME_ZONE,
			dateLocale
		);
		const time = m['HomePage.HomeNextEventSection.time']({ clock });
		const relativeDay = calculateRelativeDay(event.startsAtSeconds, nowSeconds);
		const relativeDayLabels = {
			today: m['HomePage.HomeNextEventSection.today'](),
			tomorrow: m['HomePage.HomeNextEventSection.tomorrow']()
		};
		const day = relativeDay ? relativeDayLabels[relativeDay] : calendarDay;
		const isoStart = date.toISOString();

		return { ...event, day, calendarDay, relativeDay, time, isoStart };
	}

	const [nextEvent, ...laterEvents] = selectUpcomingEvents(EVENTS, nowSeconds).map(labelEvent);
	// With nothing coming up, the last game stays on show, marked as past.
	const previousEvent = nextEvent ? undefined : selectPreviousEvent(EVENTS, nowSeconds);
	const pastEvent = previousEvent && labelEvent(previousEvent);
</script>

<section id="events" class="relative isolate scroll-mt-20 overflow-hidden bg-background">
	<AngledEdge dip="left" class="text-card" />
	<!-- Scene: stadium floodlights; they stay dark when there is no game to light up. -->
	<Floodlights off={!nextEvent} class="-z-10" />

	<div class="mx-auto max-w-7xl px-4 pt-36 pb-20 sm:px-6 lg:px-10 lg:pt-48 lg:pb-28">
		{#if nextEvent}
			<HomeNextEventSectionContent {nextEvent} {laterEvents} />
		{:else if pastEvent}
			<HomeNextEventSectionContent nextEvent={pastEvent} laterEvents={[]} isPast />
		{:else}
			<HomeNextEventSectionEmpty />
		{/if}
	</div>
</section>
