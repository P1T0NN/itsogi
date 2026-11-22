<script lang="ts">
	// UTILS
	import { cn } from '@/utils/utils';

	let { class: className }: { class?: string } = $props();

	// Center pentagon, seams running out from each corner, then forking to the edge.
	function point(radius: number, angle: number) {
		const radians = ((angle - 90) * Math.PI) / 180;
		return `${50 + radius * Math.cos(radians)} ${50 + radius * Math.sin(radians)}`;
	}

	const corners = [0, 72, 144, 216, 288];
	const pentagon = `M${corners.map((angle) => point(15, angle)).join('L')}Z`;
	const seams = corners
		.map(
			(angle) =>
				`M${point(15, angle)}L${point(30, angle)}M${point(30, angle)}L${point(48, angle - 22)}M${point(30, angle)}L${point(48, angle + 22)}`
		)
		.join('');
</script>

<svg
	viewBox="0 0 100 100"
	class={cn('pointer-events-none absolute text-foreground/7', className)}
	fill="none"
	stroke="currentColor"
	stroke-width="1.2"
	stroke-linejoin="round"
	aria-hidden="true"
>
	<circle cx="50" cy="50" r="48" />
	<path d={pentagon} fill="currentColor" fill-opacity="0.6" />
	<path d={seams} />
</svg>
