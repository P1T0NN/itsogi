<script lang="ts">
	// UTILS
	import { cn } from '@/utils/utils';

	let { class: className }: { class?: string } = $props();

	const uid = $props.id();
	const clipId = `crown-${uid}`;

	const BODY = 'M12 64L3 20L33 43L60 5L87 43L117 20L108 64Z';
	const orbs = [
		{ cx: 3, cy: 20, r: 6, delay: 520 },
		{ cx: 60, cy: 6, r: 7, delay: 600 },
		{ cx: 117, cy: 20, r: 6, delay: 680 }
	];
</script>

<!--
	Five-point crown that builds itself once on load: the band slides out, the points rise,
	the orbs pop on, the gems appear, then a single glint sweeps across.
-->
<!-- The view box reaches past 0..120 so the outer orb tips are not clipped. -->
<svg viewBox="-4 -2 128 86" class={cn('fill-primary', className)} aria-hidden="true">
	<defs>
		<clipPath id={clipId}>
			<path d={BODY} />
			<rect x="9" y="62" width="102" height="18" rx="3" />
			{#each orbs as orb (orb.cx)}
				<circle cx={orb.cx} cy={orb.cy} r={orb.r} />
			{/each}
		</clipPath>
	</defs>

	<g class="body">
		<path d={BODY} />
		<circle cx="33" cy="43" r="3.5" />
		<circle cx="87" cy="43" r="3.5" />
	</g>
	{#each orbs as orb (orb.cx)}
		<circle class="orb" cx={orb.cx} cy={orb.cy} r={orb.r} style:animation-delay="{orb.delay}ms" />
	{/each}
	<rect class="band" x="9" y="62" width="102" height="18" rx="3" />

	<g class="gems fill-background">
		<path d="M60 26L67 39L60 52L53 39Z" />
		<path d="M24 54L28 50L32 54L28 58Z" />
		<path d="M88 54L92 50L96 54L92 58Z" />
		<rect x="9" y="61" width="102" height="2.5" />
		<path d="M30 71L34 67L38 71L34 75Z" />
		<path d="M56 71L60 66L64 71L60 76Z" />
		<path d="M82 71L86 67L90 71L86 75Z" />
	</g>

	<g clip-path="url(#{clipId})">
		<path class="glint fill-foreground" d="M-30 0H-16L-38 84H-52Z" />
	</g>
</svg>

<style>
	.body,
	.orb,
	.band {
		transform-box: fill-box;
	}

	.glint {
		opacity: 0;
	}

	@media (prefers-reduced-motion: no-preference) {
		.band {
			transform-origin: center;
			animation: band 500ms cubic-bezier(0.16, 1, 0.3, 1) both;
		}

		.body {
			transform-origin: bottom;
			animation: rise 650ms 180ms cubic-bezier(0.16, 1, 0.3, 1) both;
		}

		.orb {
			transform-origin: center;
			animation: pop 400ms cubic-bezier(0.16, 1, 0.3, 1) both;
		}

		.gems {
			animation: fade 400ms 760ms ease-out both;
		}

		.glint {
			animation: glint 900ms 1100ms cubic-bezier(0.65, 0, 0.35, 1) both;
		}
	}

	@keyframes band {
		from {
			transform: scaleX(0);
		}
	}

	@keyframes rise {
		from {
			transform: scaleY(0);
		}
	}

	@keyframes pop {
		from {
			opacity: 0;
			transform: scale(0);
		}
	}

	@keyframes fade {
		from {
			opacity: 0;
		}
	}

	@keyframes glint {
		0% {
			opacity: 0;
			transform: translateX(0);
		}
		30% {
			opacity: 0.55;
		}
		100% {
			opacity: 0;
			transform: translateX(190px);
		}
	}
</style>
