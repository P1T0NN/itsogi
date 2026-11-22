<script lang="ts">
	let { value }: { value: string } = $props();
</script>

<!-- One split-flap scoreboard tile. A new value flaps down from the top half. -->
<span
	class="relative inline-flex h-14 w-9 items-center justify-center overflow-hidden rounded-md bg-card font-heading text-4xl font-black tabular-nums shadow-lg ring-1 ring-border sm:h-24 sm:w-16 sm:text-7xl lg:h-20 lg:w-12 lg:text-6xl"
>
	{#key value}
		<span class="flap">{value}</span>
	{/key}
	<!-- The hinge line across the middle of the tile. -->
	<span class="absolute inset-x-0 top-1/2 h-px bg-background" aria-hidden="true"></span>
</span>

<style>
	@media (prefers-reduced-motion: no-preference) {
		.flap {
			animation: flap 420ms cubic-bezier(0.3, 1.4, 0.5, 1) both;
			transform-origin: 50% 0;
		}
	}

	@keyframes flap {
		from {
			opacity: 0.3;
			transform: perspective(300px) rotateX(-90deg);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}
</style>
