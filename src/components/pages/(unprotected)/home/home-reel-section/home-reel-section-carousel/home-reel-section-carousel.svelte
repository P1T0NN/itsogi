<script lang="ts">
	// LIBRARIES
	import { m } from '@/lib/paraglide/messages';

	// CONFIG
	import { FEATURED_VIDEOS } from '@/shared/config';

	// COMPONENTS
	import * as Carousel from '@/components/ui/carousel';
	import HomeReelSectionItem from '../home-reel-section-item.svelte';
	import HomeReelSectionCarouselControls from './home-reel-section-carousel-controls.svelte';

	// HOOKS
	import { useReelCarousel } from './useReelCarousel.svelte';

	const reel = useReelCarousel();
</script>

<Carousel.Root
	opts={reel.options}
	setApi={reel.setApi}
	class="mx-auto mt-6 w-full max-w-6xl mask-x-from-80% mask-x-to-100%"
	aria-label={m['HomePage.HomeReelSectionCarousel.label']()}
	{@attach reel.attach}
>
	<Carousel.Content class="ms-0 pt-10 pb-28 sm:pb-32">
		{#each FEATURED_VIDEOS as video, index (video.id)}
			<HomeReelSectionItem
				{video}
				selected={index === reel.selectedIndex}
				onfocusslide={() => reel.scrollTo(index)}
			/>
		{/each}
	</Carousel.Content>
</Carousel.Root>

<HomeReelSectionCarouselControls
	selectedIndex={reel.selectedIndex}
	onselect={reel.scrollTo}
	onprev={reel.scrollPrev}
	onnext={reel.scrollNext}
/>
