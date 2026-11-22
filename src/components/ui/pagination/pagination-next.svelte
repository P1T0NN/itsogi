<script lang="ts">
	// LIBRARIES
	import { m } from '@/lib/paraglide/messages';

	import { Pagination as PaginationPrimitive } from 'bits-ui';
	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
	import { buttonVariants } from '@/components/ui/button/index.js';
	import { cn } from '@/utils/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: PaginationPrimitive.NextButtonProps = $props();
</script>

<PaginationPrimitive.NextButton
	bind:ref
	aria-label={m['Ui.nextPage']()}
	class={cn(buttonVariants({ variant: 'ghost', size: 'default' }), 'pr-2!', className)}
	{...restProps}
>
	<span class="hidden sm:block">{m['Ui.next']()}</span>
	<ChevronRightIcon data-icon="inline-end" class="cn-rtl-flip" />
</PaginationPrimitive.NextButton>
