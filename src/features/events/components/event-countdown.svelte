<script lang="ts">
	// LIBRARIES
	import { m } from '@/lib/paraglide/messages';

	// COMPONENTS
	import FlipDigit from './flip-digit.svelte';

	// UTILS
	import { calculateCountdown } from '../utils/calculateCountdown';
	import { readCurrentTimestampSeconds } from '@/shared/features/time/utils/readCurrentTimestampSeconds';

	let { startsAtSeconds }: { startsAtSeconds: number } = $props();

	// Unset on the server, so the HTML shows dashes and the browser fills in the live time.
	let nowSeconds = $state<number>();

	$effect(() => {
		nowSeconds = readCurrentTimestampSeconds();
		const timer = setInterval(() => (nowSeconds = readCurrentTimestampSeconds()), 1000);
		return () => clearInterval(timer);
	});

	const countdown = $derived(
		nowSeconds === undefined ? undefined : calculateCountdown(startsAtSeconds, nowSeconds)
	);
	const isLastDay = $derived(countdown?.days === 0);

	const units = $derived(
		[
			{ label: m['EventCountdown.days'](), value: countdown?.days },
			{ label: m['EventCountdown.hours'](), value: countdown?.hours },
			{ label: m['EventCountdown.minutes'](), value: countdown?.minutes },
			{ label: m['EventCountdown.seconds'](), value: countdown?.seconds }
		].map((unit) => ({
			label: unit.label,
			digits: unit.value === undefined ? ['-', '-'] : [...String(unit.value).padStart(2, '0')]
		}))
	);
</script>

{#if countdown?.started}
	<p
		class="font-heading text-7xl leading-none font-black whitespace-pre-line text-primary uppercase font-stretch-extra-condensed sm:text-8xl"
	>
		{m['EventCountdown.liveNow']()}
	</p>
{:else}
	<div role="timer" aria-label={m['EventCountdown.timerLabel']()}>
		<p class="mb-4 text-lg text-muted-foreground">{m['EventCountdown.nextEventIn']()}</p>
		<!-- Under a day to go, the digits turn lime. -->
		<div class="flex gap-2 sm:gap-4 lg:gap-3" class:text-primary={isLastDay}>
			{#each units as unit (unit.label)}
				<div class="flex flex-col items-center gap-2">
					<div class="flex gap-1">
						{#each unit.digits as digit, index (index)}
							<FlipDigit value={digit} />
						{/each}
					</div>
					<span class="text-sm text-muted-foreground">{unit.label}</span>
				</div>
			{/each}
		</div>
	</div>
{/if}
