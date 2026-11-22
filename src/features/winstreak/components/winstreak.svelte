<script lang="ts">
	// LIBRARIES
	import { m } from '@/lib/paraglide/messages';

	// COMPONENTS
	import * as Carousel from '@/components/ui/carousel';
	import WinstreakSvg from './winstreak-svg.svelte';

	// HOOKS
	import { useInView } from '@/hooks/useInView.svelte';

	// UTILS
	import { calculateWinstreakView } from '../utils/calculateWinstreakView';
	import { formatPrize } from '../utils/formatPrize';

	// TYPES
	import type { CarouselAPI } from '@/components/ui/carousel/context';

	let { streak }: { streak: number } = $props();

	// Roughly how many groups fit in the row; only the newest ones play the entrance in order.
	const VISIBLE_GROUPS = 6;

	const view = $derived(calculateWinstreakView(streak));
	const firstAnimatedGroup = $derived(Math.max(0, view.groups.length - VISIBLE_GROUPS));

	const reveal = useInView();

	let api = $state<CarouselAPI>();
	let canScrollPrev = $state(false);
	let canScrollNext = $state(false);
	let progress = $state(1);
	// The row only turns into a carousel when the groups no longer fit.
	const scrollable = $derived(canScrollPrev || canScrollNext);

	function syncControls(carousel: CarouselAPI) {
		canScrollPrev = carousel.canScrollPrev();
		canScrollNext = carousel.canScrollNext();
		progress = Math.min(1, Math.max(0, carousel.scrollProgress()));
	}

	$effect(() => {
		if (!api) return;
		const carousel = api;

		// Open on the newest group, the one being filled right now.
		carousel.scrollTo(carousel.scrollSnapList().length - 1, true);
		syncControls(carousel);
		carousel.on('select', syncControls).on('scroll', syncControls).on('reInit', syncControls);

		return () => {
			carousel.off('select', syncControls).off('scroll', syncControls).off('reInit', syncControls);
		};
	});
</script>

<div {@attach reveal.attach}>
	<Carousel.Root
		opts={{ align: 'start', dragFree: true, slidesToScroll: 'auto' }}
		setApi={(carousel) => (api = carousel)}
		aria-label={m['Winstreak.carouselLabel']({ count: streak })}
	>
		<Carousel.Content>
			{#each view.groups as count, group (group)}
				<Carousel.Item class="basis-auto">
					<div class="flex flex-col items-center gap-1.5 text-accent">
						<WinstreakSvg
							{count}
							order={Math.max(0, group - firstAnimatedGroup)}
							inView={reveal.inView}
						/>
						<span
							class="text-xs font-bold tabular-nums {count === 5
								? 'text-accent'
								: 'text-muted-foreground'}"
						>
							{formatPrize((group + 1) * 5)}
						</span>
					</div>
				</Carousel.Item>
			{/each}
		</Carousel.Content>

		{#if scrollable}
			<div class="mt-6 flex items-center gap-4">
				<Carousel.Previous
					size="icon-lg"
					class="static my-0 border-2 border-foreground/15 bg-transparent text-foreground/70 hover:border-primary hover:bg-primary hover:text-primary-foreground disabled:opacity-30"
				/>
				<div class="h-1 flex-1 overflow-hidden rounded-full bg-border" aria-hidden="true">
					<div
						class="h-full origin-left rounded-full bg-primary"
						style:transform="scaleX({progress})"
					></div>
				</div>
				<Carousel.Next
					size="icon-lg"
					class="static my-0 border-2 border-foreground/15 bg-transparent text-foreground/70 hover:border-primary hover:bg-primary hover:text-primary-foreground disabled:opacity-30"
				/>
			</div>
		{/if}
	</Carousel.Root>
</div>
