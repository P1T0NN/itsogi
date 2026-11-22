<script lang="ts">
	// COMPONENTS
	import { Button, type ButtonProps } from '@/components/ui/button';

	type RefreshableQuery = {
		readonly loading: boolean;
		refresh: () => Promise<void>;
	};

	let {
		query,
		onrefresh,
		label = 'Refresh',
		variant = 'outline',
		class: className,
		...restProps
	}: {
		query: RefreshableQuery;
		onrefresh?: () => void | Promise<void>;
		label?: string;
	} & Omit<ButtonProps, 'onclick' | 'children'> = $props();

	async function refresh() {
		await onrefresh?.();

		try {
			await query.refresh();
		} catch {
			// The query's error state is displayed inline by the calling list or table.
		}
	}
</script>

<Button {...restProps} {variant} class={className} onclick={refresh} disabled={query.loading}>
	<span
		data-icon="inline-start"
		aria-hidden="true"
		class={[
			'icon-[lucide--refresh-cw] size-4 shrink-0',
			query.loading && 'animate-spin motion-reduce:animate-none'
		]}
	></span>

	{label}
</Button>
