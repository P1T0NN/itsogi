<script lang="ts">
	// LIBRARIES
	import { m } from '@/lib/paraglide/messages';

	// CONFIG
	import { FEATURED_VIDEOS } from '@/shared/config';

	let {
		selectedIndex,
		onselect,
		onprev,
		onnext
	}: {
		selectedIndex: number;
		onselect: (index: number) => void;
		onprev: () => void;
		onnext: () => void;
	} = $props();
</script>

<div class="flex items-center justify-center gap-2 px-4 sm:gap-4">
	<button
		type="button"
		onclick={onprev}
		class="flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-foreground/15 text-foreground/70 transition-colors hover:border-primary hover:text-primary md:size-12"
	>
		<span class="icon-[lucide--chevron-left] size-5" aria-hidden="true"></span>
		<span class="sr-only">{m['HomePage.HomeReelSectionCarouselControls.previous']()}</span>
	</button>

	<div class="flex min-w-0 items-center sm:gap-2">
		{#each FEATURED_VIDEOS as video, index (video.id)}
			<button
				type="button"
				onclick={() => onselect(index)}
				aria-current={index === selectedIndex ? 'true' : undefined}
				class="group flex size-6 shrink-0 items-center justify-center"
			>
				<span
					class="size-2 rounded-full bg-foreground/20 transition-all duration-300 group-aria-current:scale-150 group-aria-current:bg-primary"
					aria-hidden="true"
				></span>
				<span class="sr-only"
					>{m['HomePage.HomeReelSectionCarouselControls.videoNumber']({ number: index + 1 })}</span
				>
			</button>
		{/each}
	</div>

	<button
		type="button"
		onclick={onnext}
		class="flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-foreground/15 text-foreground/70 transition-colors hover:border-primary hover:text-primary md:size-12"
	>
		<span class="icon-[lucide--chevron-right] size-5" aria-hidden="true"></span>
		<span class="sr-only">{m['HomePage.HomeReelSectionCarouselControls.next']()}</span>
	</button>
</div>
