<script lang="ts">
	// COMPONENTS
	import { Button, type ButtonVariant } from '@/components/ui/button';

	// UTILS
	import { cn } from '@/utils/utils';

	// TYPES
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	const uid = $props.id();

	let {
		id = uid,
		triggerLabel,
		triggerVariant = 'outline',
		triggerClass,
		label,
		class: className,
		children,
		...props
	}: Omit<HTMLAttributes<HTMLElement>, 'children' | 'popover'> & {
		triggerLabel: string;
		triggerVariant?: ButtonVariant;
		triggerClass?: string;
		label?: string;
		children: Snippet;
	} = $props();
</script>

<Button
	type="button"
	variant={triggerVariant}
	class={triggerClass}
	popovertarget={id}
	popovertargetaction="toggle"
>
	{triggerLabel}
</Button>

<section
	{...props}
	{id}
	popover="auto"
	data-slot="native-popover"
	aria-label={label ?? triggerLabel}
	class={cn(
		'fixed m-auto max-h-dvh w-80 max-w-full overflow-y-auto overscroll-contain rounded-2xl border bg-popover p-4 text-sm text-popover-foreground shadow-lg',
		className
	)}
>
	<div class="flex min-w-0 flex-col gap-3 wrap-anywhere">
		{@render children()}
	</div>
</section>

<style>
	@supports (position-area: block-end) {
		section {
			inset: auto;
			margin: 0;
			margin-block: 0.5rem;
			position-area: block-end span-inline-end;
			position-try-fallbacks:
				flip-block,
				flip-inline,
				flip-block flip-inline;
		}
	}
</style>
