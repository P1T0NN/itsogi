<script lang="ts">
	// SVELTEKIT
	import { page } from '$app/state';

	// LIBRARIES
	import { m } from '@/lib/paraglide/messages';

	// COMPONENTS
	import Link from '@/components/ui/custom-components/link/link.svelte';
	import Logo from '@/components/ui/custom-components/logo/logo.svelte';
	import BallOutline from '@/components/ui/custom-components/design-elements/ball-outline.svelte';

	const notFound = $derived(page.status === 404);
	const title = $derived(notFound ? m['ErrorPage.notFoundTitle']() : m['ErrorPage.errorTitle']());
</script>

<svelte:head>
	<title>{page.status} · {title}</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main
	class="relative isolate flex min-h-dvh flex-col overflow-hidden bg-background px-4 py-8 sm:px-6 lg:px-10"
>
	<!-- Scene: an oversized ball drifting off the corner. -->
	<BallOutline class="-right-40 -bottom-40 -z-10 size-136 lg:size-200" />

	<Link href="/" class="w-fit">
		<Logo showText={false} imageClass="size-10" />
	</Link>

	<div class="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center py-16">
		<p
			class="font-heading text-9xl leading-none font-black tracking-tight text-primary font-stretch-extra-condensed"
			aria-hidden="true"
		>
			{page.status}
		</p>
		<h1
			class="mt-4 font-heading text-6xl leading-none font-black uppercase font-stretch-extra-condensed sm:text-8xl"
		>
			{title}
		</h1>
		<p class="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
			{notFound ? m['ErrorPage.notFoundDescription']() : m['ErrorPage.errorDescription']()}
		</p>

		<div class="mt-10 flex flex-wrap gap-3">
			<Link
				href="/"
				class="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-4 font-bold text-primary-foreground transition-colors hover:bg-foreground hover:text-background"
			>
				<span class="icon-[lucide--arrow-left] size-4.5" aria-hidden="true"></span>
				{m['ErrorPage.backHome']()}
			</Link>
			{#if !notFound}
				<button
					type="button"
					onclick={() => location.reload()}
					class="inline-flex items-center gap-2 rounded-full border-2 border-foreground/15 px-6 py-4 font-bold transition-colors hover:border-primary hover:text-primary"
				>
					<span class="icon-[lucide--rotate-cw] size-4.5" aria-hidden="true"></span>
					{m['Ui.tryAgain']()}
				</button>
			{/if}
		</div>
	</div>
</main>
