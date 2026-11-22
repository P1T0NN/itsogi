<script lang="ts">
	let {
		count,
		order,
		inView
	}: {
		count: number;
		/** Position in the entrance sequence; later groups slash in after earlier ones. */
		order: number;
		inView: boolean;
	} = $props();

	type Point = [number, number];

	// Four downward claw scratches and one slash across them, each leaning a little differently.
	const marks: { from: Point; to: Point; width: number; bend: number; across?: boolean }[] = [
		{ from: [9, 5], to: [11, 55], width: 2.6, bend: 1.2 },
		{ from: [22, 7], to: [21, 54], width: 2.9, bend: -1 },
		{ from: [33, 4], to: [35, 56], width: 2.5, bend: 1.4 },
		{ from: [46, 6], to: [45, 53], width: 2.8, bend: -1.2 },
		{ from: [2, 47], to: [55, 11], width: 3.4, bend: 2.5, across: true }
	];

	// A tapered blade: pointed at both ends, widest in the middle, curved by `bend`.
	function bladePath(from: Point, to: Point, width: number, bend: number) {
		const [x1, y1] = from;
		const [x2, y2] = to;
		const length = Math.hypot(x2 - x1, y2 - y1);
		const normalX = (y1 - y2) / length;
		const normalY = (x2 - x1) / length;
		const midX = (x1 + x2) / 2;
		const midY = (y1 + y2) / 2;
		// A quadratic curve peaks at half its control offset, hence the doubling.
		const outer = 2 * (bend + width);
		const inner = 2 * (bend - width);
		const round = (value: number) => Math.round(value * 100) / 100;
		const control = (offset: number) =>
			`${round(midX + normalX * offset)} ${round(midY + normalY * offset)}`;
		return `M${x1} ${y1}Q${control(outer)} ${x2} ${y2}Q${control(inner)} ${x1} ${y1}Z`;
	}

	const blades = marks.map((mark) => ({
		d: bladePath(mark.from, mark.to, mark.width, mark.bend),
		across: mark.across ?? false
	}));
</script>

<svg
	viewBox="0 0 56 60"
	class="h-14 w-13 sm:h-16 sm:w-15 lg:h-22 lg:w-20"
	class:in-view={inView}
	aria-hidden="true"
>
	{#each blades as blade, index (index)}
		{@const drawn = index < count}
		<path
			d={blade.d}
			class={[drawn ? 'tally fill-current' : 'fill-border', blade.across && 'across']}
			style:animation-delay="{(order * 5 + index) * 70}ms"
		/>
	{/each}
</svg>

<style>
	@media (prefers-reduced-motion: no-preference) {
		/* Scratches rake downwards from the top; the slash cuts across from its low end. */
		.tally {
			opacity: 0;
			transform: scaleY(0);
			transform-box: fill-box;
			transform-origin: top;
		}

		.tally.across {
			transform: scale(0);
			transform-origin: left bottom;
		}

		.in-view .tally {
			animation: scratch 320ms cubic-bezier(0.25, 1, 0.5, 1) forwards;
		}
	}

	@keyframes scratch {
		to {
			opacity: 1;
			transform: none;
		}
	}
</style>
