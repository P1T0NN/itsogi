<script lang="ts">
	// LIBRARIES
	import { m } from '@/lib/paraglide/messages';

	// COMPONENTS
	import StaticImage from '@/components/ui/custom-components/static-image/static-image.svelte';
	import EventCountdown from '@/features/events/components/event-countdown.svelte';

	// TYPES
	import type { UpcomingGameEvent } from '@/features/events/types/eventsTypes';

	let { nextEvent, isPast }: { nextEvent: UpcomingGameEvent; isPast: boolean } = $props();
</script>

<!-- Phones show the countdown before the poster, so it is not pushed a screen down. -->
<div class="flex flex-col gap-10 lg:justify-self-end">
	{#if nextEvent.poster}
		<StaticImage
			src={nextEvent.poster}
			alt={m['HomePage.HomeNextEventSectionCountdown.posterAlt']({
				day: nextEvent.calendarDay,
				place: nextEvent.place
			})}
			class="order-last h-auto w-full max-w-sm rounded-xl shadow-2xl ring-1 ring-border lg:order-first lg:w-0 lg:max-w-none lg:min-w-full"
			loading="lazy"
		/>
	{/if}
	{#if isPast}
		<p
			class="font-heading text-7xl leading-none font-black whitespace-pre-line text-muted-foreground uppercase font-stretch-extra-condensed sm:text-8xl"
		>
			{m['HomePage.HomeNextEventSectionCountdown.ended']()}
		</p>
	{:else}
		<EventCountdown startsAtSeconds={nextEvent.startsAtSeconds} />
	{/if}
</div>
