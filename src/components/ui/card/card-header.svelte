<script lang="ts">
	import { cn, type WithElementRef } from '@/utils/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div
	bind:this={ref}
	data-slot="card-header"
	class={cn(
		'group/card-header @container/card-header grid auto-rows-min items-start gap-1.5 rounded-t-4xl px-(--card-spacing) has-data-[slot=card-action]:grid-cols-2 has-data-[slot=card-description]:grid-rows-2 [.border-b]:pb-(--card-spacing)',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>
