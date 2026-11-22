<script lang="ts">
	// LIBRARIES
	import { m } from '@/lib/paraglide/messages';

	// COMPONENTS
	import HomeNextEventSectionInformation from './home-next-event-section-information.svelte';
	import HomeNextEventSectionCountdown from './home-next-event-section-countdown.svelte';
	import HomeNextEventSectionUpcoming from './home-next-event-section-upcoming.svelte';

	// TYPES
	import type { UpcomingGameEvent } from '@/features/events/types/eventsTypes';

	let {
		nextEvent,
		laterEvents,
		isPast = false
	}: {
		nextEvent: UpcomingGameEvent;
		laterEvents: UpcomingGameEvent[];
		isPast?: boolean;
	} = $props();
</script>

<p
	class="font-heading text-3xl leading-none font-extrabold text-primary uppercase font-stretch-condensed"
	aria-hidden="true"
>
	{isPast
		? m['HomePage.HomeNextEventSectionContent.previousLabel']()
		: m['HomePage.HomeNextEventSectionContent.label']()}
</p>

<div class="mt-4 grid gap-12 lg:grid-cols-2 lg:items-start lg:gap-16">
	<HomeNextEventSectionInformation {nextEvent} {isPast} />
	<HomeNextEventSectionCountdown {nextEvent} {isPast} />
</div>

{#if laterEvents.length > 0}
	<HomeNextEventSectionUpcoming {laterEvents} />
{/if}
