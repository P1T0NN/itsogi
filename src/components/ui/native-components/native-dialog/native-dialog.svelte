<script lang="ts">
	// LIBRARIES
	import { m } from '@/lib/paraglide/messages';

	// COMPONENTS
	import { Button, type ButtonVariant } from '@/components/ui/button';

	// UTILS
	import { cn } from '@/utils/utils';

	// TYPES
	import type { Snippet } from 'svelte';
	import type { HTMLDialogAttributes } from 'svelte/elements';

	const uid = $props.id();

	let {
		id = uid,
		triggerLabel,
		triggerVariant = 'outline',
		triggerClass,
		title,
		description,
		closeLabel = m['Ui.close'](),
		forcedClose = false,
		closedby = 'any',
		class: className,
		children,
		...props
	}: Omit<HTMLDialogAttributes, 'children' | 'open'> & {
		triggerLabel?: string;
		triggerVariant?: ButtonVariant;
		triggerClass?: string;
		title: string;
		description?: string;
		closeLabel?: string;
		forcedClose?: boolean;
		children: Snippet;
	} = $props();
</script>

{#if triggerLabel}
	<Button
		type="button"
		variant={triggerVariant}
		class={triggerClass}
		command="show-modal"
		commandfor={id}
		aria-haspopup="dialog"
	>
		{triggerLabel}
	</Button>
{/if}

<dialog
	{...props}
	{id}
	closedby={forcedClose ? 'none' : closedby}
	data-slot="native-dialog"
	aria-labelledby={`${id}-title`}
	aria-describedby={description ? `${id}-description` : undefined}
	class={cn(
		'fixed inset-0 m-auto max-h-dvh w-11/12 max-w-md overflow-hidden rounded-4xl border bg-popover p-6 text-popover-foreground shadow-xl backdrop:bg-black/50 open:flex open:flex-col',
		className
	)}
>
	<div class="flex min-h-0 flex-col gap-6">
		<header class="flex shrink-0 flex-col gap-2 pr-10">
			<h2 id={`${id}-title`} class="text-base leading-snug font-medium wrap-anywhere">{title}</h2>
			{#if description}
				<p id={`${id}-description`} class="text-sm leading-relaxed text-muted-foreground">
					{description}
				</p>
			{/if}
		</header>

		<div class="flex min-h-0 flex-col gap-6 overflow-y-auto overscroll-contain">
			{@render children()}
		</div>

		{#if forcedClose}
			<footer class="flex shrink-0 justify-end border-t pt-4">
				<Button type="button" variant="outline" command="close" commandfor={id}>
					{closeLabel}
				</Button>
			</footer>
		{/if}
	</div>

	<Button
		type="button"
		variant="ghost"
		size="icon-sm"
		class="absolute top-4 right-4"
		command="close"
		commandfor={id}
		aria-label={closeLabel}
	>
		<span class="icon-[lucide--x] size-4" aria-hidden="true"></span>
	</Button>
</dialog>

<style>
	:global(html:has(dialog[data-slot='native-dialog'])) {
		scrollbar-gutter: stable;
	}

	:global(html:has(dialog[data-slot='native-dialog']:modal)),
	:global(body:has(dialog[data-slot='native-dialog']:modal)) {
		overflow: hidden;
	}
</style>
