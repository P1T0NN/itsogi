<script lang="ts">
	// UTILS
	import { cn } from '@/utils/utils';

	let { class: className }: { class?: string } = $props();
</script>

<!-- Chalk tactics board: O beats the X with a curled run. -->
<svg
	viewBox="0 0 400 260"
	class={cn('pointer-events-none absolute text-foreground/15', className)}
	fill="none"
	stroke="currentColor"
	stroke-width="3"
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden="true"
>
	<circle cx="60" cy="200" r="20" />
	<path d="M160 70l30 30M190 70l-30 30" class="text-primary/60" stroke="currentColor" />
	<path d="M330 40l24 24M354 40l-24 24" />

	<path stroke-dasharray="10 12" d="M82 188C140 160 120 110 170 120S260 190 300 120" />
	<path d="M292 112l10 6-4 11" />
	<path stroke-dasharray="10 12" d="M60 176C60 120 90 60 150 40" />
	<path d="M140 36l12 3-6 10" />
</svg>
