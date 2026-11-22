<script lang="ts">
	// LIBRARIES
	import { m } from '@/lib/paraglide/messages';

	// COMPONENTS
	import AngledEdge from '@/components/ui/custom-components/design-elements/angled-edge.svelte';
	import BallOutline from '@/components/ui/custom-components/design-elements/ball-outline.svelte';
	import HomeReelSectionCarousel from './home-reel-section-carousel/home-reel-section-carousel.svelte';
</script>

<section id="reel" class="relative isolate scroll-mt-20 overflow-hidden bg-card py-20 lg:py-28">
	<AngledEdge dip="right" class="text-background" />
	<!-- Scene: a big ball behind the heading. -->
	<BallOutline class="-top-32 -right-32 -z-10 size-96 lg:-top-40 lg:size-136" />

	<div class="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-10">
		<h2
			class="font-heading text-7xl leading-none font-black text-foreground uppercase font-stretch-extra-condensed lg:text-9xl"
		>
			{m['HomePage.HomeReelSection.title']()}
		</h2>
		<p class="mx-auto mt-4 max-w-md text-muted-foreground">
			{m['HomePage.HomeReelSection.description']()}
		</p>
	</div>

	<HomeReelSectionCarousel />
</section>
