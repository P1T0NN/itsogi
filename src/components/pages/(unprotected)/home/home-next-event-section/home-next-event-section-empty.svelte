<script lang="ts">
	// LIBRARIES
	import { m } from '@/lib/paraglide/messages';

	// HELPERS
	import { trackEvent } from '@/features/analytics/helpers/trackEvent';

	// CONFIG
	import { COMPANY_DATA } from '@/shared/config';

	// COMPONENTS
	import RevealText from '@/components/ui/custom-components/reveal-text/reveal-text.svelte';

	const socials = [
		{ name: 'TikTok', url: COMPANY_DATA.TIKTOK_URL, icon: 'icon-[simple-icons--tiktok]' },
		{ name: 'Instagram', url: COMPANY_DATA.INSTAGRAM_URL, icon: 'icon-[simple-icons--instagram]' }
	];
</script>

<h2
	class="max-w-3xl font-heading text-7xl leading-none font-black uppercase font-stretch-extra-condensed lg:text-9xl"
>
	<RevealText text={m['HomePage.HomeNextEventSectionEmpty.title']()} />
</h2>
<p class="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
	{m['HomePage.HomeNextEventSectionEmpty.description']()}
</p>

<ul class="mt-10 flex flex-wrap gap-3">
	{#each socials as social (social.name)}
		<li>
			<a
				href={social.url}
				onclick={() =>
					trackEvent('social_follow_clicked', { platform: social.name, location: 'events_empty' })}
				target="_blank"
				rel="external noopener noreferrer"
				class="flex items-center gap-3 rounded-full bg-primary px-6 py-4 font-bold text-primary-foreground transition-colors hover:bg-foreground hover:text-background"
			>
				<span class="{social.icon} size-5" aria-hidden="true"></span>
				{m['HomePage.HomeNextEventSectionEmpty.followOn']({ platform: social.name })}
			</a>
		</li>
	{/each}
</ul>
