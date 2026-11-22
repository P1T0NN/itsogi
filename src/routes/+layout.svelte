<script lang="ts">
	import './layout.css';
	import { asset } from '$app/paths';
	import { page } from '$app/state';
	import type { LayoutProps } from './$types';

	// LIBRARIES
	import { Toaster } from '@/components/ui/sonner';
	import Header from '@/components/ui/custom-components/header/header.svelte';
	import Footer from '@/components/ui/custom-components/footer/footer.svelte';

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={asset('logo/logo-transparent.ico')} />
</svelte:head>

<Toaster richColors />

<!-- The error page is a full-screen takeover, so it skips the site chrome. -->
{#if !page.error}
	<Header />
{/if}

{@render children()}

{#if !page.error}
	<Footer />
{/if}
