<script lang="ts">
	// CONFIG
	import { COMPANY_DATA } from '@/shared/config';

	// COMPONENTS
	import StaticImage from '@/components/ui/custom-components/static-image/static-image.svelte';

	// UTILS
	import { cn } from '@/utils/utils.js';

	let {
		showImage = true,
		showText = true,
		class: className,
		imageClass,
		textClass
	}: {
		showImage?: boolean;
		showText?: boolean;
		class?: string;
		imageClass?: string;
		textClass?: string;
	} = $props();
</script>

<span class={cn('inline-flex max-w-full min-w-0 items-center gap-2', className)}>
	{#if showImage}
		<StaticImage
			src={COMPANY_DATA.LOGO}
			alt={showText ? '' : COMPANY_DATA.NAME}
			width={509}
			height={490}
			class={cn('size-8 shrink-0 object-contain', imageClass)}
		/>
	{/if}
	{#if showText}
		<span class={cn('truncate', textClass)}>{COMPANY_DATA.NAME}</span>
	{/if}
</span>
