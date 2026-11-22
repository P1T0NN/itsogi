<script lang="ts">
	// LIBRARIES
	import { m } from '@/lib/paraglide/messages';

	// HELPERS
	import { trackEvent } from '@/features/analytics/helpers/trackEvent';

	// COMPONENTS
	import RevealText from '@/components/ui/custom-components/reveal-text/reveal-text.svelte';
	import CountUp from '@/components/ui/custom-components/count-up/count-up.svelte';

	// TYPES
	import type { UpcomingGameEvent } from '@/features/events/types/eventsTypes';

	let { nextEvent, isPast }: { nextEvent: UpcomingGameEvent; isPast: boolean } = $props();

	function handleDirectionsClick() {
		trackEvent('event_directions_clicked', {
			place: nextEvent.place,
			event_date: nextEvent.startsAt
		});
	}
</script>

<div>
	<h2
		class="font-heading text-7xl leading-none font-black uppercase font-stretch-extra-condensed sm:text-8xl lg:text-9xl"
	>
		<span class="sr-only"
			>{isPast
				? m['HomePage.HomeNextEventSectionInformation.srPreviousLabel']()
				: m['HomePage.HomeNextEventSectionInformation.srLabel']()}</span
		>

		<time datetime={nextEvent.isoStart}>
			<RevealText text={nextEvent.day} class="block" />
			<RevealText
				text={nextEvent.time}
				offset={nextEvent.day.length}
				class="mt-1 block text-primary normal-case"
			/>
			<!-- "Today" and "Tomorrow" still show the actual date under the time. -->
			{#if nextEvent.relativeDay}
				<span
					class="mt-3 block text-3xl text-muted-foreground font-stretch-condensed sm:mt-4 sm:text-4xl lg:text-5xl"
				>
					{nextEvent.calendarDay}
				</span>
			{/if}
		</time>
	</h2>

	{#if nextEvent.prize}
		<p class="mt-8 flex items-center gap-3 sm:mt-10 sm:gap-4">
			<!-- shortcut: "€" plus a plain count, so prizes of 1000+ show without a thousands separator. -->
			<span
				class="shrink-0 font-heading text-7xl leading-none font-black whitespace-nowrap font-stretch-extra-condensed *:inline-flex sm:text-8xl"
				>€<CountUp value={nextEvent.prize} /></span
			>
			<span
				class="font-heading text-xl leading-none font-extrabold whitespace-pre-line text-primary uppercase font-stretch-condensed sm:text-2xl"
			>
				{#if nextEvent.beatKey}
					{m['HomePage.HomeNextEventSectionInformation.ifYouBeat']({
						rivals: m[nextEvent.beatKey]()
					})}
				{:else}
					{m['HomePage.HomeNextEventSectionInformation.ifYouBeatMe']()}
				{/if}
			</span>
		</p>
	{/if}

	<p class="mt-8 flex flex-wrap items-center gap-x-2 text-xl font-bold sm:mt-10 sm:text-2xl">
		<span class="icon-[lucide--map-pin] size-6 shrink-0 text-primary" aria-hidden="true"></span>
		{nextEvent.place}<span class="text-muted-foreground">· {nextEvent.city}</span>
	</p>

	<a
		href={nextEvent.mapsUrl}
		onclick={handleDirectionsClick}
		target="_blank"
		rel="external noopener noreferrer"
		class="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 font-bold text-primary-foreground transition-colors hover:bg-foreground hover:text-background sm:inline-flex sm:w-auto"
	>
		<span class="icon-[lucide--navigation] size-4.5" aria-hidden="true"></span>
		{m['HomePage.HomeNextEventSectionInformation.getDirections']()}
	</a>
</div>
