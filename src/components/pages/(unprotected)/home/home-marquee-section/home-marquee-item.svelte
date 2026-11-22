<script lang="ts">
	let { sponsors }: { sponsors: string[] } = $props();
</script>

<div class="flex shrink-0">
	{#each sponsors as sponsor (sponsor)}
		<span
			class="flex items-center gap-6 pr-6 font-heading text-2xl font-black whitespace-nowrap uppercase font-stretch-condensed"
		>
			{sponsor}
			<span class="text-primary-foreground/40">/</span>
		</span>
	{/each}
</div>
