<script lang="ts">
	// LIBRARIES
	import { m } from '@/lib/paraglide/messages';

	// HELPERS
	import { trackEvent } from '@/features/analytics/helpers/trackEvent';

	// CONFIG
	import { COMPANY_DATA, HEADER_SECTIONS } from '@/shared/config';

	// COMPONENTS
	import Link from '@/components/ui/custom-components/link/link.svelte';
	import Logo from '@/components/ui/custom-components/logo/logo.svelte';
	import LanguageSwitcher from '@/components/ui/custom-components/language-switcher/language-switcher.svelte';
	import NativeDrawer from '@/components/ui/native-components/native-drawer/native-drawer.svelte';

	let { activeId }: { activeId: string | null } = $props();

	const socials = [
		{ name: 'TikTok', url: COMPANY_DATA.TIKTOK_URL, icon: 'icon-[simple-icons--tiktok]' },
		{ name: 'Instagram', url: COMPANY_DATA.INSTAGRAM_URL, icon: 'icon-[simple-icons--instagram]' },
		{ name: 'YouTube', url: COMPANY_DATA.YOUTUBE_URL, icon: 'icon-[simple-icons--youtube]' }
	];

	// "01", "02"...: a quiet index next to each big section name.
	function formatIndex(index: number) {
		return String(index + 1).padStart(2, '0');
	}
</script>

<NativeDrawer
	label={m['Header.menu']()}
	triggerLabel={m['Header.openMenu']()}
	triggerIcon="icon-[lucide--menu]"
	triggerClass="flex size-11 items-center justify-center rounded-full ring-1 ring-foreground/15 transition-colors hover:bg-foreground/10 hover:text-primary"
	class="border-l border-border"
>
	{#snippet children({ close, closeNow })}
		<div class="flex min-h-full flex-col px-6 pt-4 pb-8">
			<div class="flex min-h-16 items-center justify-between">
				<Logo showText={false} imageClass="size-10" />
				<!-- svelte-ignore a11y_autofocus: the dialog moves focus here on open, as a modal should. -->
				<button
					type="button"
					autofocus
					onclick={close}
					aria-label={m['Header.closeMenu']()}
					class="flex size-11 items-center justify-center rounded-full ring-1 ring-foreground/15 transition-colors hover:bg-foreground/10 hover:text-primary"
				>
					<span class="icon-[lucide--x] size-5" aria-hidden="true"></span>
				</button>
			</div>

			<nav aria-label={m['Header.mainNavigation']()} class="mt-8">
				<ul class="divide-y divide-border border-y border-border">
					{#each HEADER_SECTIONS as section, index (section.id)}
						<li>
							<!-- Close instantly so the page can scroll to the section. -->
							<Link
								href="/#{section.id}"
								onclick={closeNow}
								aria-current={activeId === section.id ? 'location' : undefined}
								class="group flex items-baseline gap-4 py-4 font-heading text-5xl leading-none font-black uppercase font-stretch-extra-condensed transition-colors hover:text-primary aria-[current=location]:text-primary"
							>
								<span
									class="w-6 font-sans text-xs font-bold text-muted-foreground tabular-nums transition-colors group-hover:text-primary group-aria-[current=location]:text-primary"
									aria-hidden="true"
								>
									{formatIndex(index)}
								</span>
								{m[section.label]()}
							</Link>
						</li>
					{/each}
				</ul>
			</nav>

			<div class="mt-auto flex flex-col gap-8 pt-10">
				<div>
					<p class="text-xs font-bold tracking-widest text-muted-foreground uppercase">
						{m['Header.follow']()}
					</p>
					<ul class="mt-3 flex gap-3">
						{#each socials as social (social.name)}
							<li>
								<a
									href={social.url}
									onclick={() =>
										trackEvent('social_follow_clicked', {
											platform: social.name,
											location: 'menu'
										})}
									target="_blank"
									rel="external noopener noreferrer"
									class="flex size-12 items-center justify-center rounded-full ring-1 ring-foreground/15 transition-colors hover:bg-primary hover:text-primary-foreground hover:ring-primary"
								>
									<span class="{social.icon} size-5" aria-hidden="true"></span>
									<span class="sr-only">{social.name}</span>
								</a>
							</li>
						{/each}
					</ul>
				</div>

				<LanguageSwitcher variant="list" />
			</div>
		</div>
	{/snippet}
</NativeDrawer>
