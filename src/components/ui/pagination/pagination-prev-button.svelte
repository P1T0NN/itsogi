<script lang="ts">
	// LIBRARIES
	import { m } from '@/lib/paraglide/messages';

	import { Pagination as PaginationPrimitive } from 'bits-ui';
	import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';
	import { cn } from '@/utils/utils.js';
	import { buttonVariants } from '../button/index.js';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: PaginationPrimitive.PrevButtonProps = $props();
</script>

{#snippet Fallback()}
	<ChevronLeftIcon class={cn('cn-rtl-flip size-4', className)} />
	<span>{m['Ui.previous']()}</span>
{/snippet}

<PaginationPrimitive.PrevButton
	bind:ref
	aria-label={m['Ui.previousPage']()}
	class={cn(buttonVariants({ variant: 'ghost' }), 'pl-2!', className)}
	{...restProps}
>
	{#if children}
		{@render children?.()}
	{:else}
		{@render Fallback()}
	{/if}
</PaginationPrimitive.PrevButton>
