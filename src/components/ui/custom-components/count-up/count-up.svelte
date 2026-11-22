<script lang="ts">
	// HOOKS
	import { useInView } from '@/hooks/useInView.svelte';

	let { value, duration = 1400 }: { value: number; duration?: number } = $props();

	const reveal = useInView();

	// Undefined until the browser arms the animation, so server HTML and no-JS show the real number.
	let shown = $state<number>();
	let armed = false;

	function arm(node: HTMLElement) {
		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (prefersReducedMotion) return;

		shown = 0;
		armed = true;
		return reveal.attach(node);
	}

	$effect(() => {
		if (!reveal.inView || !armed) return;

		let frame = 0;
		let start: number | undefined;

		// requestAnimationFrame supplies the frame timestamp; ease-out-quart slows into the final number.
		function tick(time: number) {
			start ??= time;
			const progress = Math.min(1, (time - start) / duration);
			shown = Math.round((1 - (1 - progress) ** 4) * value);
			if (progress < 1) frame = requestAnimationFrame(tick);
		}

		frame = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(frame);
	});
</script>

<!-- Counts up from 0 to `value`, once, when it scrolls into view. -->
<span {@attach arm}>
	<span class="sr-only">{value}</span>
	<span aria-hidden="true" class="tabular-nums">{shown ?? value}</span>
</span>
