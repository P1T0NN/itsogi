<script lang="ts">
	// HOOKS
	import { useInView } from '@/hooks/useInView.svelte';

	// UTILS
	import { cn } from '@/utils/utils';

	let { class: className }: { class?: string } = $props();

	const reveal = useInView(0.2);
	const uid = $props.id();
	const clipId = `goal-mouth-${uid}`;

	// Drawn in real pixels of the box (measured below) so lines never stretch and draw-ins finish exactly.
	const INSET = 0.05;
	const DEPTH = 46;
	const GAP = 30;
	const STAGGER_MS = 25;
	const MESH_START_MS = 700;

	let size = $state({ width: 600, height: 420 });

	function measure(node: SVGSVGElement) {
		const observer = new ResizeObserver(([entry]) => {
			const { width, height } = entry.contentRect;
			const hasSize = width > 0 && height > 0;
			if (hasSize) size = { width, height };
		});
		observer.observe(node);
		return () => observer.disconnect();
	}

	const goal = $derived.by(() => {
		const left = Math.round(size.width * INSET);
		const right = Math.round(size.width * (1 - INSET));
		const top = Math.round(size.height * INSET * 0.6);
		const bottom = Math.round(size.height * 0.98);
		const width = right - left;
		const height = bottom - top;

		// Front frame, then the back bar and the side nets angling back to it, which give the goal depth.
		const frame = [
			`M${left} ${bottom}V${top}H${right}V${bottom}`,
			`M${left + DEPTH} ${top + DEPTH}H${right - DEPTH}`,
			`M${left} ${top}L${left + DEPTH} ${top + DEPTH}M${right} ${top}L${right - DEPTH} ${top + DEPTH}`
		];

		const count = Math.ceil((width + height) / GAP);
		const mesh = Array.from({ length: count }, (_, index) => {
			const x = left + index * GAP;
			const delay = MESH_START_MS + index * STAGGER_MS;
			return [
				{ d: `M${x - height} ${top}L${x} ${bottom}`, delay },
				{ d: `M${x} ${top}L${x - height} ${bottom}`, delay: delay + STAGGER_MS * 4 }
			];
		}).flat();

		return { left, top, width, height, frame, mesh };
	});
</script>

<!-- Chalk football goal: the frame draws first, then the net weaves in, once, on scroll. -->
<svg
	viewBox="0 0 {size.width} {size.height}"
	preserveAspectRatio="none"
	class={cn('pointer-events-none absolute', className)}
	class:drawn={reveal.inView}
	fill="none"
	stroke="currentColor"
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden="true"
	{@attach measure}
	{@attach reveal.attach}
>
	<defs>
		<clipPath id={clipId}>
			<rect x={goal.left} y={goal.top} width={goal.width} height={goal.height} />
		</clipPath>
	</defs>

	<g clip-path="url(#{clipId})" class="text-foreground/10" stroke-width="1.2">
		{#each goal.mesh as line (line.d)}
			<path d={line.d} pathLength="1" class="line" style:animation-delay="{line.delay}ms" />
		{/each}
	</g>

	<g class="text-foreground/30">
		{#each goal.frame as part, index (index)}
			<path
				d={part}
				pathLength="1"
				class="line"
				stroke-width={index === 0 ? 6 : 3}
				style:animation-delay="{index * 150}ms"
			/>
		{/each}
	</g>
</svg>

<style>
	@media (prefers-reduced-motion: no-preference) {
		.line {
			stroke-dasharray: 1;
			stroke-dashoffset: 1;
		}

		.drawn .line {
			animation: draw 1000ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
		}
	}

	@keyframes draw {
		to {
			stroke-dashoffset: 0;
		}
	}
</style>
