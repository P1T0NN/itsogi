<script lang="ts">
	// LIBRARIES
	import { m } from '@/lib/paraglide/messages';

	// HELPERS
	import { trackEvent } from '@/features/analytics/helpers/trackEvent';

	// CONFIG
	import { COMPANY_DATA } from '@/shared/config';

	// COMPONENTS
	import AngledEdge from '@/components/ui/custom-components/design-elements/angled-edge.svelte';
	import TacticsPlay from '@/components/ui/custom-components/design-elements/tactics-play.svelte';

	const socials = [
		{ name: 'TikTok', url: COMPANY_DATA.TIKTOK_URL, icon: 'icon-[simple-icons--tiktok]' },
		{ name: 'Instagram', url: COMPANY_DATA.INSTAGRAM_URL, icon: 'icon-[simple-icons--instagram]' },
		{
			name: 'YouTube',
			url: COMPANY_DATA.YOUTUBE_URL,
			icon: 'icon-[simple-icons--youtube]',
			isNew: true
		}
	];
</script>

<section
	id="play"
	class="relative isolate scroll-mt-20 overflow-hidden bg-secondary text-secondary-foreground"
>
	<AngledEdge dip="left" class="text-card" />
	<!-- Scene: a chalk tactics board. -->
	<TacticsPlay
		class="-right-20 bottom-6 -z-10 w-80 sm:w-110 lg:top-4 lg:right-6 lg:bottom-auto lg:w-100"
	/>

	<div class="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
		<h2
			class="max-w-3xl font-heading text-6xl leading-none font-black text-foreground uppercase font-stretch-extra-condensed lg:text-8xl"
		>
			{m['HomePage.HomeClosingSection.title']()}
		</h2>
		<p class="mt-6 max-w-lg text-lg leading-relaxed text-secondary-foreground/75">
			{m['HomePage.HomeClosingSection.description']()}
		</p>

		<p
			class="mt-10 max-w-2xl border-t-2 border-border pt-6 font-heading text-4xl leading-none font-extrabold uppercase font-stretch-condensed sm:text-5xl"
		>
			{m['HomePage.HomeClosingSection.ruleStart']()}
			<span class="text-primary">{m['HomePage.HomeClosingSection.ruleHighlight']()}</span>
			{m['HomePage.HomeClosingSection.ruleEnd']()}
		</p>

		<ul class="mt-10 flex flex-wrap gap-3">
			{#each socials as social (social.name)}
				<li>
					<a
						href={social.url}
						onclick={() =>
							trackEvent('social_follow_clicked', { platform: social.name, location: 'play' })}
						target="_blank"
						rel="external noopener noreferrer"
						class="flex items-center gap-3 rounded-full bg-primary px-6 py-4 font-bold text-primary-foreground transition-colors hover:bg-foreground hover:text-background"
					>
						<span class="{social.icon} size-5" aria-hidden="true"></span>
						{m['HomePage.HomeClosingSection.followOn']({ platform: social.name })}
						{#if social.isNew}
							<span
								class="rounded-full bg-primary-foreground px-2 py-0.5 text-xs font-black text-primary uppercase"
							>
								{m['HomePage.HomeClosingSection.new']()}
							</span>
						{/if}
					</a>
				</li>
			{/each}
		</ul>
	</div>
</section>
