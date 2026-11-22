<script lang="ts" generics="Item">
	// COMPONENTS
	// LIBRARIES
	import { m } from '@/lib/paraglide/messages';

	import { Spinner } from '@/components/ui/spinner';

	// TYPES
	import type { Snippet } from 'svelte';

	type Props = {
		query: PromiseLike<Item[]> | Item[];
		getKey: (item: Item) => string | number;
		children: Snippet<[Item]>;
		loading?: Snippet;
		pending?: boolean;
		loadingMessage?: string;
		emptyTitle?: string;
		emptyDescription?: string;
		errorMessage?: string;
	};

	let {
		query,
		getKey,
		children,
		loading,
		pending = false,
		loadingMessage = m['Ui.loadingItems'](),
		emptyTitle = m['Ui.emptyTitle'](),
		emptyDescription = m['Ui.emptyDescription'](),
		errorMessage = m['Ui.itemsError']()
	}: Props = $props();

	const isPending = $derived($state.eager(pending));
</script>

<div class="relative flex flex-col gap-8">
	{#await query}
		{#if loading}
			{@render loading()}
		{:else}
			<p role="status" class="flex items-center gap-2 text-sm text-muted-foreground">
				<Spinner />
				{loadingMessage}
			</p>
		{/if}
	{:then items}
		{#if isPending && loading}
			{@render loading()}
		{:else if items.length > 0}
			<ul class="divide-y divide-border border-y" aria-busy={isPending}>
				{#each items as item (getKey(item))}
					{@render children(item)}
				{/each}
			</ul>
		{:else}
			<div class="flex flex-col gap-2 py-10 text-center">
				<h2 class="text-lg font-medium">{emptyTitle}</h2>
				<p class="text-sm text-muted-foreground">{emptyDescription}</p>
			</div>
		{/if}
	{:catch}
		<p role="alert" class="text-sm text-destructive">{errorMessage}</p>
	{/await}
</div>
