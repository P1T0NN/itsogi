<script lang="ts">
	// UTILS
	import { cn } from '@/utils/utils';

	// TYPES
	import type { Snippet } from 'svelte';
	import type { HTMLDetailsAttributes } from 'svelte/elements';

	let {
		title,
		class: className,
		children,
		...props
	}: Omit<HTMLDetailsAttributes, 'children'> & {
		title: string;
		children: Snippet;
	} = $props();
</script>

<details
	{...props}
	data-slot="native-accordion"
	class={cn('group/native-accordion border-b', className)}
>
	<summary
		class="flex cursor-pointer list-none items-center justify-between gap-4 rounded-sm py-4 text-sm font-medium outline-none hover:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background [&::-webkit-details-marker]:hidden"
	>
		{title}
		<span
			class="icon-[lucide--chevron-down] size-4 shrink-0 text-muted-foreground transition-transform group-open/native-accordion:rotate-180 motion-reduce:transition-none"
			aria-hidden="true"
		></span>
	</summary>
	<div class="pb-4 text-sm leading-relaxed text-muted-foreground">
		{@render children()}
	</div>
</details>
