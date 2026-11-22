<script lang="ts">
	import { Pagination as PaginationPrimitive } from 'bits-ui';
	import { buttonVariants, type ButtonSize } from '@/components/ui/button/index.js';
	import { cn } from '@/utils/utils.js';
	let {
		ref = $bindable(null),
		class: className,
		size = 'icon',
		isActive,
		page,
		children,
		child: customChild,
		disabled = false,
		...restProps
	}: PaginationPrimitive.PageProps & {
		size?: ButtonSize;
		isActive: boolean;
	} = $props();
</script>

{#snippet Fallback()}
	{page.value}
{/snippet}

<PaginationPrimitive.Page
	bind:ref
	{page}
	{disabled}
	aria-current={isActive ? 'page' : undefined}
	data-slot="pagination-link"
	data-active={isActive}
	data-size={size}
	class={cn(buttonVariants({ size, variant: isActive ? 'secondary' : 'ghost' }), className)}
	{...restProps}
>
	{#snippet child(childProps)}
		{#if customChild}
			{@render customChild(childProps)}
		{:else}
			<!-- Forward native disabled semantics; the primitive only guards page-change handlers. -->
			<button {...childProps.props} {disabled}>
				{#if children}
					{@render children()}
				{:else}
					{@render Fallback()}
				{/if}
			</button>
		{/if}
	{/snippet}
</PaginationPrimitive.Page>
