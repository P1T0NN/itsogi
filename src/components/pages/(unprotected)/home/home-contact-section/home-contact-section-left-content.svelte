<script lang="ts">
	// LIBRARIES
	import { m } from '@/lib/paraglide/messages';

	// HELPERS
	import { trackEvent } from '@/features/analytics/helpers/trackEvent';

	// CONFIG
	import { COMPANY_DATA } from '@/shared/config';

	const socials = [
		{
			name: 'TikTok',
			handle: '@tapuskoo',
			url: COMPANY_DATA.TIKTOK_URL,
			icon: 'icon-[simple-icons--tiktok]'
		},
		{
			name: 'Instagram',
			handle: '@tapuskoo',
			url: COMPANY_DATA.INSTAGRAM_URL,
			icon: 'icon-[simple-icons--instagram]'
		},
		{
			name: 'YouTube',
			handle: '@ogi1v1',
			url: COMPANY_DATA.YOUTUBE_URL,
			icon: 'icon-[simple-icons--youtube]'
		}
	];
</script>

<div class="min-w-0">
	<h2
		class="font-heading text-7xl leading-none font-black uppercase font-stretch-extra-condensed lg:text-8xl"
	>
		{m['HomePage.HomeContactSectionLeftContent.title']()}
	</h2>
	<p class="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
		{m['HomePage.HomeContactSectionLeftContent.description']()}
	</p>

	<a
		href="mailto:{COMPANY_DATA.EMAIL}"
		onclick={() => trackEvent('contact_email_clicked', {})}
		class="mt-10 block font-heading text-3xl leading-none font-black break-all font-stretch-extra-condensed underline decoration-primary decoration-4 underline-offset-8 transition-colors hover:text-primary sm:text-4xl sm:break-normal xl:text-5xl"
	>
		{COMPANY_DATA.EMAIL}
	</a>

	<ul class="mt-10 flex flex-wrap gap-3">
		{#each socials as social (social.name)}
			<li>
				<a
					href={social.url}
					onclick={() =>
						trackEvent('social_follow_clicked', { platform: social.name, location: 'collabs' })}
					target="_blank"
					rel="external noopener noreferrer"
					class="flex items-center gap-3 rounded-full bg-background py-3 pr-5 pl-4 ring-2 ring-foreground/20 transition-colors hover:bg-primary hover:text-primary-foreground hover:ring-primary"
				>
					<span class="{social.icon} size-5" aria-hidden="true"></span>
					<span class="font-bold">{social.name}</span>
					<span class="text-sm opacity-75">{social.handle}</span>
				</a>
			</li>
		{/each}
	</ul>
</div>
