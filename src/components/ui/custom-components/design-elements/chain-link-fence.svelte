<script lang="ts">
	// HOOKS
	import { useInView } from '@/hooks/useInView.svelte';

	// UTILS
	import { cn } from '@/utils/utils';

	let { class: className }: { class?: string } = $props();

	const reveal = useInView();

	// Drawing space; the SVG scales it to cover whatever box the caller gives it.
	const WIDTH = 800;
	const HEIGHT = 640;
	const GAP = 36;
	// Each wire starts this much later than the previous one; the crossing set waits for the first.
	const STAGGER_MS = 22;
	const CROSSING_DELAY_MS = 450;

	const count = Math.ceil((WIDTH + HEIGHT) / GAP);
	const wires = Array.from({ length: count }, (_, index) => {
		const x = index * GAP;
		const delay = index * STAGGER_MS;
		return [
			{ d: `M${x - HEIGHT} 0L${x} ${HEIGHT}`, delay },
			{ d: `M${x} 0L${x - HEIGHT} ${HEIGHT}`, delay: delay + CROSSING_DELAY_MS }
		];
	}).flat();
</script>

<!-- Cage fence: a diamond wire grid that draws itself once, wire by wire, when it scrolls into view. -->
<svg
	viewBox="0 0 {WIDTH} {HEIGHT}"
	preserveAspectRatio="xMidYMid slice"
	class={cn(
		'pointer-events-none absolute mask-radial-from-0% mask-radial-to-70% text-foreground/15',
		className
	)}
	class:drawn={reveal.inView}
	fill="none"
	stroke="currentColor"
	stroke-width="1.5"
	aria-hidden="true"
	{@attach reveal.attach}
>
	{#each wires as wire (wire.d)}
		<path d={wire.d} pathLength="1" class="wire" style:animation-delay="{wire.delay}ms" />
	{/each}
</svg>

<style>
	@media (prefers-reduced-motion: no-preference) {
		.wire {
			stroke-dasharray: 1;
			stroke-dashoffset: 1;
		}

		.drawn .wire {
			animation: draw 1100ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
		}
	}

	@keyframes draw {
		to {
			stroke-dashoffset: 0;
		}
	}
</style>
