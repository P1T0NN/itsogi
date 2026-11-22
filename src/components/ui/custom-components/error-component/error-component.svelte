<script lang="ts">
	// LIBRARIES
	import { m } from '@/lib/paraglide/messages';

	// COMPONENTS
	import { Button } from '@/components/ui/button';
	import * as Card from '@/components/ui/card/index.js';

	// UTILS
	import { cn } from '@/utils/utils.js';

	// TYPES
	import type { Snippet } from 'svelte';

	type Props = {
		message?: string;
		retry?: () => void;
		retryLabel?: string;
		actions?: Snippet;
		card?: boolean;
		class?: string;
	};

	let {
		message = m['Errors.unexpected'](),
		retry = () => globalThis.location?.reload(),
		retryLabel = m['Ui.tryAgain'](),
		actions,
		card = false,
		class: className
	}: Props = $props();
</script>

{#snippet errorContent()}
	<div class={cn('flex flex-col items-center gap-3 py-10 text-center', className)} role="alert">
		<p class="text-sm text-destructive">{message}</p>
		{#if actions}
			{@render actions()}
		{:else}
			<Button type="button" variant="outline" size="sm" onclick={retry}>{retryLabel}</Button>
		{/if}
	</div>
{/snippet}

{#if card}
	<Card.Root>
		<Card.Content class="p-0">{@render errorContent()}</Card.Content>
	</Card.Root>
{:else}
	{@render errorContent()}
{/if}
