<script lang="ts">
	// LIBRARIES
	import { m } from '@/lib/paraglide/messages';

	// HELPERS
	import { trackEvent } from '@/features/analytics/helpers/trackEvent';

	// COMPONENTS
	import * as Carousel from '@/components/ui/carousel';

	// TYPES
	import type { FeaturedVideo } from '@/shared/config';

	let {
		video,
		selected,
		onfocusslide
	}: { video: FeaturedVideo; selected: boolean; onfocusslide: () => void } = $props();

	const platforms = $derived([
		{ name: 'TikTok', url: video.tiktokUrl, icon: 'icon-[simple-icons--tiktok]' },
		{ name: 'Instagram', url: video.instagramUrl, icon: 'icon-[simple-icons--instagram]' },
		{ name: 'YouTube', url: video.youtubeUrl, icon: 'icon-[simple-icons--youtube]' }
	]);
</script>

<Carousel.Item
	class="flex basis-34 justify-center ps-0 sm:basis-40 lg:basis-46"
	aria-label={m['HomePage.HomeReelSectionItem.label']()}
>
	<div
		data-fan-card
		class="group relative aspect-9/16 w-52 shrink-0 overflow-hidden rounded-2xl bg-secondary shadow-2xl ring-1 shadow-black/60 ring-foreground/10 will-change-transform sm:w-60 lg:w-68"
	>
		<img
			src={video.thumbnail}
			alt=""
			loading="lazy"
			class="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
		/>
		<span
			class="absolute inset-0 bg-linear-to-t from-background/90 via-background/10 to-transparent"
		></span>

		{#if video.millionViews}
			<span
				class="absolute top-3 left-3 rounded-md bg-accent px-2 py-1 font-heading text-sm font-black text-accent-foreground uppercase font-stretch-condensed"
			>
				{m['Ui.millionViews']()}
			</span>
		{/if}

		{#if selected}
			<!-- One tap straight to the video on the platform the visitor picks, so the view counts there. -->
			<ul class="absolute inset-x-0 bottom-4 flex justify-center gap-3">
				{#each platforms as platform (platform.name)}
					<li>
						<a
							href={platform.url}
							onclick={() =>
								trackEvent('video_platform_clicked', {
									video_id: video.id,
									platform: platform.name
								})}
							target="_blank"
							rel="external noopener noreferrer"
							aria-label={m['HomePage.HomeReelSectionItem.watchOn']({ platform: platform.name })}
							class="flex size-12 items-center justify-center rounded-full bg-background/90 text-foreground shadow-lg transition-colors outline-none hover:bg-primary hover:text-primary-foreground focus-visible:ring-4 focus-visible:ring-ring"
						>
							<span class="{platform.icon} size-5" aria-hidden="true"></span>
						</a>
					</li>
				{/each}
			</ul>
		{:else}
			<!-- A side card is brought to the front first. -->
			<button
				type="button"
				onclick={onfocusslide}
				class="absolute inset-0 outline-none focus-visible:ring-4 focus-visible:ring-ring"
			>
				<span class="sr-only">{m['HomePage.HomeReelSectionItem.showVideo']()}</span>
			</button>
		{/if}
	</div>
</Carousel.Item>
