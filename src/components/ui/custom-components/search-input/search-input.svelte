<script lang="ts">
	// COMPONENTS
	import { Input } from '@/components/ui/input';

	// UTILS
	import { cn } from '@/utils/utils';

	// TYPES
	import type { HTMLInputAttributes } from 'svelte/elements';

	let {
		value = $bindable(),
		class: className,
		...props
	}: Omit<HTMLInputAttributes, 'type' | 'value' | 'files'> & { value?: string } = $props();
</script>

<div class="relative min-w-0 flex-1" data-slot="search-input">
	<span
		class="pointer-events-none absolute top-1/2 left-3 icon-[lucide--search] size-4 -translate-y-1/2 text-muted-foreground"
		aria-hidden="true"
	></span>
	<Input {...props} type="search" bind:value class={cn('pl-9', className)} />
</div>

<style>
	/* Keep the native clear control in forced-colors mode. */
	@media (forced-colors: none) {
		div :global(input[type='search']::-webkit-search-cancel-button) {
			appearance: none;
			width: 1rem;
			height: 1rem;
			margin-inline-start: 0.5rem;
			cursor: pointer;
			background-color: var(--muted-foreground);
			mask: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round"%3E%3Cpath d="m18 6-12 12M6 6l12 12"/%3E%3C/svg%3E')
				center / 0.75rem 0.75rem no-repeat;
		}

		div :global(input[type='search']::-webkit-search-cancel-button:hover) {
			background-color: var(--foreground);
		}
	}
</style>
