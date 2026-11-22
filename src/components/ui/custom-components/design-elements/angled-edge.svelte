<script lang="ts">
	// UTILS
	import { cn } from '@/utils/utils';

	let {
		dip,
		class: className
	}: {
		/** Side where the section above reaches furthest down into this one. */
		dip: 'left' | 'right';
		/** Must include the text color of the section above, for example `text-card`. */
		class?: string;
	} = $props();

	const points = $derived(dip === 'right' ? '0,0 100,0 100,10' : '0,0 100,0 0,10');
</script>

<!--
	Diagonal boundary between sections, tilted like the tape strip under the hero. Sits at the top
	of the lower section and is filled with the upper section's color, so the edge between them slants.
-->
<svg
	viewBox="0 0 100 10"
	preserveAspectRatio="none"
	class={cn(
		'pointer-events-none absolute inset-x-0 -top-px h-6 w-full fill-current sm:h-12 lg:h-20',
		className
	)}
	aria-hidden="true"
>
	<polygon {points} />
</svg>
