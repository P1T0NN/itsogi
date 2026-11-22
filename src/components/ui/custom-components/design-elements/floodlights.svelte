<script lang="ts">
	// HOOKS
	import { useInView } from '@/hooks/useInView.svelte';

	// UTILS
	import { cn } from '@/utils/utils';

	let {
		off = false,
		class: className
	}: {
		/** Keep the lamps dark, e.g. when there is nothing to light up. */
		off?: boolean;
		class?: string;
	} = $props();

	const reveal = useInView(0.2);

	// Server HTML, no-JS and reduced motion show the lamps already on; only an armed browser flickers.
	let armed = $state(false);

	function arm(node: Element) {
		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (prefersReducedMotion) return;

		armed = true;
		return reveal.attach(node);
	}

	const lampState = $derived(off ? 'off' : armed && !reveal.inView ? 'waiting' : 'on');

	// Head center height. Heads hang from roof trusses in the top corners, tilted at the pitch.
	const HEAD_Y = 68;

	const lamps = [
		{ x: 150, tilt: -8, beam: '110,96 190,96 920,620 360,620', delay: 0 },
		{ x: 1050, tilt: 8, beam: '1090,96 1010,96 280,620 840,620', delay: 420 }
	];

	// A 4 x 2 rack of lamps, in head-local coordinates.
	const lenses = [-45, -15, 15, 45].flatMap((x) => [-8, 14].map((y) => ({ x, y })));

	// Zig-zag bracing between the two truss rails, from the roof down to the yoke.
	const trussBracing = 'M-8 0L8 8L-8 16L8 24L-8 32L8 40';
</script>

<!-- Stadium floodlights that flicker on, one pylon after the other, when the section scrolls in. -->
<svg
	viewBox="0 0 1200 620"
	preserveAspectRatio="xMidYMin slice"
	class={cn('pointer-events-none absolute inset-0 size-full text-foreground', className)}
	aria-hidden="true"
	data-state={lampState}
	{@attach arm}
>
	<defs>
		<linearGradient id="floodlight-beam" x1="0" y1="0" x2="0" y2="1">
			<stop offset="0" stop-color="currentColor" stop-opacity="0.34" />
			<stop offset="0.55" stop-color="currentColor" stop-opacity="0.08" />
			<stop offset="1" stop-color="currentColor" stop-opacity="0" />
		</linearGradient>
		<filter id="floodlight-blur" x="-20%" y="-20%" width="140%" height="140%">
			<feGaussianBlur stdDeviation="14" />
		</filter>
		<filter id="floodlight-bloom" x="-50%" y="-50%" width="200%" height="200%">
			<feGaussianBlur stdDeviation="10" />
		</filter>

		<!-- Painted steel housing: catches a little light on top, darker underneath. -->
		<linearGradient id="floodlight-metal" x1="0" y1="0" x2="0" y2="1">
			<stop offset="0" class="stop-muted" />
			<stop offset="1" class="stop-card" />
		</linearGradient>
		<!-- Unlit lens: dark glass with a faint reflector behind it. -->
		<radialGradient id="floodlight-glass" cx="0.4" cy="0.35" r="0.7">
			<stop offset="0" class="stop-muted" />
			<stop offset="1" class="stop-background" />
		</radialGradient>
		<!-- Lit lens: white-hot core falling off towards the reflector rim. -->
		<radialGradient id="floodlight-lens" cx="0.5" cy="0.45" r="0.55">
			<stop offset="0" stop-color="currentColor" stop-opacity="1" />
			<stop offset="0.5" stop-color="currentColor" stop-opacity="0.95" />
			<stop offset="0.85" stop-color="currentColor" stop-opacity="0.55" />
			<stop offset="1" stop-color="currentColor" stop-opacity="0.2" />
		</radialGradient>
	</defs>

	{#each lamps as lamp (lamp.x)}
		<!-- Roof truss: two rails with zig-zag bracing. -->
		<g transform="translate({lamp.x} 0)" class="fill-none stroke-muted">
			<path d="M-8 0V42M8 0V42" stroke-width="3" />
			<path d={trussBracing} stroke-width="1.5" />
		</g>

		<g class="light" style:animation-delay="{lamp.delay}ms">
			<polygon points={lamp.beam} fill="url(#floodlight-beam)" filter="url(#floodlight-blur)" />
		</g>

		<g transform="translate({lamp.x} {HEAD_Y}) rotate({lamp.tilt})">
			<!-- Yoke the head pivots in, bolted at both ends. -->
			<path d="M-72 4V-30H72V4" class="fill-none stroke-muted" stroke-width="5" />
			<circle cx="-72" cy="4" r="4" class="fill-muted" />
			<circle cx="72" cy="4" r="4" class="fill-muted" />

			<!-- Hood over the top edge, then the housing. -->
			<path d="M-68 -24H68L60 -32H-60Z" class="fill-card" />
			<rect x="-66" y="-24" width="132" height="52" rx="4" fill="url(#floodlight-metal)" />
			<path d="M-62 -23H62" class="stroke-foreground/15" stroke-width="1" />

			{#each lenses as lens (`${lens.x}-${lens.y}`)}
				<circle cx={lens.x} cy={lens.y} r="12.5" class="fill-background" />
				<circle cx={lens.x} cy={lens.y} r="10" fill="url(#floodlight-glass)" />
			{/each}

			<g class="light" style:animation-delay="{lamp.delay}ms">
				<ellipse
					cx="0"
					cy="3"
					rx="78"
					ry="36"
					fill="currentColor"
					opacity="0.3"
					filter="url(#floodlight-bloom)"
				/>
				{#each lenses as lens (`${lens.x}-${lens.y}`)}
					<circle cx={lens.x} cy={lens.y} r="10" fill="url(#floodlight-lens)" />
					<!-- Faceted reflector ring visible through the glass. -->
					<circle
						cx={lens.x}
						cy={lens.y}
						r="6.5"
						class="fill-none stroke-background/25"
						stroke-width="1"
					/>
				{/each}
			</g>

			<!-- Glass glint, there whether the lamp is on or off. -->
			{#each lenses as lens (`${lens.x}-${lens.y}`)}
				<circle cx={lens.x - 4} cy={lens.y - 4} r="2" fill="currentColor" opacity="0.5" />
			{/each}
		</g>
	{/each}
</svg>

<style>
	.stop-muted {
		stop-color: var(--muted);
	}

	.stop-card {
		stop-color: var(--card);
	}

	.stop-background {
		stop-color: var(--background);
	}

	/* Only the light flickers; the housings and trusses are always there. */
	.light {
		opacity: 1;
		transition: opacity 600ms ease;
	}

	[data-state='off'] .light,
	[data-state='waiting'] .light {
		opacity: 0;
	}

	@media (prefers-reduced-motion: no-preference) {
		[data-state='on'] .light {
			animation: flicker 1.1s steps(1, end) both;
		}
	}

	@keyframes flicker {
		0% {
			opacity: 0;
		}
		12% {
			opacity: 0.85;
		}
		18% {
			opacity: 0.1;
		}
		30% {
			opacity: 0.95;
		}
		36% {
			opacity: 0.25;
		}
		52% {
			opacity: 1;
		}
		100% {
			opacity: 1;
		}
	}
</style>
