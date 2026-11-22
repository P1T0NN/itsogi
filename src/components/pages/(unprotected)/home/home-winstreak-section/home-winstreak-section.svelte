<script lang="ts">
	// LIBRARIES
	import { m } from '@/lib/paraglide/messages';

	// CONFIG
	import { WINSTREAK } from '@/features/winstreak/config';

	// COMPONENTS
	import Link from '@/components/ui/custom-components/link/link.svelte';
	import Winstreak from '@/features/winstreak/components/winstreak.svelte';
	import ChainLinkFence from '@/components/ui/custom-components/design-elements/chain-link-fence.svelte';
	import CountUp from '@/components/ui/custom-components/count-up/count-up.svelte';
	import RevealText from '@/components/ui/custom-components/reveal-text/reveal-text.svelte';

	// UTILS
	import { calculateWinstreakView } from '@/features/winstreak/utils/calculateWinstreakView';
	import { formatPrize } from '@/features/winstreak/utils/formatPrize';

	const { prize, winsToNextBump, nextPrize } = calculateWinstreakView(WINSTREAK);
	// Reused as the reveal offset of the second line.
	const potStart = m['HomePage.HomeWinstreakSection.potStart']();
</script>

<section
	id="streak"
	class="relative isolate scroll-mt-20 overflow-hidden bg-card text-card-foreground"
>
	<!-- Scene: a cage fence. -->
	<ChainLinkFence class="-top-16 -right-24 -z-10 h-120 w-120 lg:h-160 lg:w-200" />

	<div
		class="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:py-28"
	>
		<div>
			<p
				class="mb-4 font-heading text-3xl leading-none font-extrabold text-primary uppercase font-stretch-condensed"
			>
				{m['HomePage.HomeWinstreakSection.highestEver']()}
			</p>
			<h2 class="font-heading leading-none font-black font-stretch-extra-condensed">
				<span class="block text-9xl tracking-tight text-primary"><CountUp value={WINSTREAK} /></span
				>
				<RevealText
					text={m['HomePage.HomeWinstreakSection.winsInARow']()}
					class="mt-2 block text-4xl uppercase sm:text-5xl"
				/>
			</h2>

			<p class="mt-8 max-w-md text-lg leading-relaxed text-muted-foreground">
				{m['HomePage.HomeWinstreakSection.description']({ bump: formatPrize(5) })}
			</p>
		</div>

		<div class="flex min-w-0 flex-col justify-end gap-10">
			<Winstreak streak={WINSTREAK} />

			<div class="border-t border-border pt-8">
				{#if prize > 0}
					<p
						class="font-heading text-5xl leading-none font-black text-balance uppercase font-stretch-extra-condensed lg:text-8xl"
					>
						<RevealText text={formatPrize(prize)} class="text-accent" />
						<RevealText
							text={m['HomePage.HomeWinstreakSection.prizeToWinner']()}
							offset={formatPrize(prize).length}
						/>
					</p>
				{:else}
					<p
						class="font-heading text-5xl leading-none font-black text-balance uppercase font-stretch-extra-condensed lg:text-8xl"
					>
						<RevealText text={potStart} />
						<RevealText
							text={m['HomePage.HomeWinstreakSection.potStartsAt']()}
							offset={potStart.length}
							class="text-accent"
						/>
					</p>
				{/if}

				<p class="mt-4 text-muted-foreground">
					{m['HomePage.HomeWinstreakSection.nextBump']({
						count: winsToNextBump,
						prize: formatPrize(nextPrize)
					})}
				</p>

				<Link
					href="/#play"
					class="group mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-4 font-bold text-primary-foreground transition-colors hover:bg-foreground hover:text-background"
				>
					{m['HomePage.HomeWinstreakSection.howToPlay']()}

					<span class="icon-[lucide--arrow-down] size-4.5" aria-hidden="true"></span>
				</Link>
			</div>
		</div>
	</div>
</section>
