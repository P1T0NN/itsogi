<script lang="ts">
	// UTILS
	import { cn } from '@/utils/utils';

	// TYPES
	import type { Snippet } from 'svelte';
	import type { HTMLSelectAttributes } from 'svelte/elements';

	let {
		value = $bindable(),
		class: className,
		children,
		...props
	}: Omit<HTMLSelectAttributes, 'children' | 'value' | 'multiple' | 'size'> & {
		value?: string;
		children: Snippet;
	} = $props();
</script>

<select
	{...props}
	bind:value
	data-slot="native-select"
	class={cn(
		'h-9 w-full min-w-0 appearance-auto rounded-3xl border border-transparent bg-input/50 px-3 py-2 text-sm text-foreground transition outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
		className
	)}
>
	{@render children()}
</select>

<style>
	select {
		background-image: none;
	}

	@supports (appearance: base-select) {
		select,
		select::picker(select) {
			appearance: base-select;
		}

		select::picker(select) {
			max-block-size: min(20rem, calc(100dvh - 2rem));
			overflow-y: auto;
			overscroll-behavior: contain;
			border: 1px solid var(--border);
			border-radius: var(--radius-2xl);
			padding: 0.375rem;
			background: var(--popover);
			color: var(--popover-foreground);
			box-shadow: 0 8px 24px rgb(0 0 0 / 0.12);
		}

		select::picker-icon {
			margin-inline-start: auto;
			color: var(--muted-foreground);
		}

		select:open::picker-icon {
			rotate: 180deg;
		}

		select :global(option) {
			gap: 0.5rem;
			border-radius: var(--radius-xl);
			padding: 0.5rem 0.75rem;
			font-size: 0.875rem;
		}

		select :global(option:checked) {
			background: var(--secondary);
			color: var(--secondary-foreground);
			font-weight: 500;
		}

		select :global(option:not(:disabled):hover),
		select :global(option:focus-visible) {
			background: var(--accent);
			color: var(--accent-foreground);
		}

		select :global(option:disabled) {
			opacity: 0.5;
		}

		select :global(option::checkmark) {
			color: currentColor;
		}
	}
</style>
