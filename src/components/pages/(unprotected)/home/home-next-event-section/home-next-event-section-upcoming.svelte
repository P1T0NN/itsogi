<script lang="ts">
	// LIBRARIES
	import { m } from '@/lib/paraglide/messages';

	// UTILS
	import { formatPrize } from '@/features/winstreak/utils/formatPrize';

	// TYPES
	import type { UpcomingGameEvent } from '@/features/events/types/eventsTypes';

	let { laterEvents }: { laterEvents: UpcomingGameEvent[] } = $props();
</script>

<div class="mt-20 border-t border-border pt-8">
	<h3 class="font-heading text-3xl leading-none font-extrabold uppercase font-stretch-condensed">
		{m['HomePage.HomeNextEventSectionUpcoming.title']()}
	</h3>
	<ul class="mt-2 divide-y divide-border">
		{#each laterEvents as event (event.startsAt)}
			<li>
				<a
					href={event.mapsUrl}
					target="_blank"
					rel="external noopener noreferrer"
					class="group flex flex-wrap items-baseline gap-x-6 gap-y-1 py-5 transition-colors hover:text-primary"
				>
					<time
						datetime={event.isoStart}
						class="font-heading text-4xl font-black uppercase font-stretch-extra-condensed"
					>
						{event.day} · <span class="text-primary">{event.time}</span>
					</time>
					<span class="text-lg font-bold">{event.place}</span>
					<span class="text-muted-foreground">{event.city}</span>
					{#if event.prize}
						<span class="text-sm font-bold text-primary uppercase">
							{#if event.beatKey}
								{m['HomePage.HomeNextEventSectionUpcoming.prizeIfYouBeat']({
									prize: formatPrize(event.prize),
									rivals: m[event.beatKey]()
								})}
							{:else}
								{m['HomePage.HomeNextEventSectionUpcoming.prizeIfYouBeatMe']({
									prize: formatPrize(event.prize)
								})}
							{/if}
						</span>
					{/if}
					<span
						class="ml-auto icon-[lucide--arrow-up-right] size-6 self-center transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
						aria-hidden="true"
					></span>
					<span class="sr-only">{m['HomePage.HomeNextEventSectionUpcoming.directions']()}</span>
				</a>
			</li>
		{/each}
	</ul>
</div>
