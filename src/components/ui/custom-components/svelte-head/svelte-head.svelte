<script lang="ts">
	// SVELTEKIT
	import { page } from '$app/state';
	import { PUBLIC_ORIGIN } from '$app/env/public';

	// LIBRARIES
	import { m } from '@/lib/paraglide/messages';
	import {
		baseLocale,
		deLocalizeHref,
		getLocale,
		locales,
		localizeUrl
	} from '@/lib/paraglide/runtime';

	// CONFIG
	import { COMPANY_DATA } from '@/shared/config';

	// UTILS
	import { formatSiteOrigin } from '@/shared/features/seo/utils/formatSiteOrigin';

	type JsonLdValue =
		string | number | boolean | null | undefined | JsonLdValue[] | { [key: string]: JsonLdValue };
	type JsonLdObject = { [key: string]: JsonLdValue };

	let {
		title,
		description,
		canonicalPath,
		image,
		ogType = 'website',
		noindex = false,
		suffixSiteName = true,
		jsonLd
	}: {
		title?: string;
		description?: string;
		/** Site-relative canonical path, including pagination parameters when needed. */
		canonicalPath?: string;
		/** Site-relative or absolute social-share image. Defaults to {@link COMPANY_DATA.OG_IMAGE}. */
		image?: string;
		ogType?: 'website' | 'article';
		/** When true, private/account/checkout routes should not be indexed. */
		noindex?: boolean;
		/** Append ` | {site name}` to the document title. Disable for the home page. */
		suffixSiteName?: boolean;
		/**
		 * Extra structured data for this page, such as events, as schema.org nodes. They join the
		 * site's Person and WebSite nodes in one `@graph`, serialized and escaped here.
		 */
		jsonLd?: JsonLdObject[];
	} = $props();

	// Stable configured origin for canonical/OG URLs; falls back to the request origin.
	const origin = $derived(formatSiteOrigin(PUBLIC_ORIGIN));
	const locale = getLocale();

	const pathname = $derived(page.url.pathname);
	const canonical = $derived(`${origin}${canonicalPath ?? pathname}`);

	// Every language version of this page, so search engines show visitors their own one.
	const basePath = $derived(deLocalizeHref(pathname));
	const alternates = $derived(
		locales.map((alternateLocale) => ({
			locale: alternateLocale,
			href: localizeUrl(`${origin}${basePath}`, { locale: alternateLocale }).href
		}))
	);
	const defaultAlternate = $derived(
		localizeUrl(`${origin}${basePath}`, { locale: baseLocale }).href
	);

	const titleFromPath = $derived.by(() => {
		const segments = pathname.split('/').filter(Boolean);
		if (segments.length === 0) return COMPANY_DATA.NAME;
		return segments[segments.length - 1]
			.replace(/[-_]+/g, ' ')
			.replace(/\b\w/g, (c) => c.toUpperCase());
	});

	const resolvedTitle = $derived(title ?? titleFromPath);
	const fullTitle = $derived(
		suffixSiteName ? `${resolvedTitle} | ${COMPANY_DATA.NAME}` : resolvedTitle
	);
	const resolvedDescription = $derived(description ?? m['HomePage.SEO.description']());

	const isCustomImage = $derived(image !== undefined && image !== COMPANY_DATA.OG_IMAGE);
	const imagePath = $derived(image ?? COMPANY_DATA.OG_IMAGE);
	const imageUrl = $derived(/^https?:\/\//.test(imagePath) ? imagePath : `${origin}${imagePath}`);

	// Open Graph wants a region, e.g. `en_US`; Intl fills in the likely one for a bare language.
	function formatOgLocale(tag: string) {
		const { language, region } = new Intl.Locale(tag).maximize();
		return `${language}_${region}`;
	}
	const ogLocaleTag = formatOgLocale(locale);
	const ogAlternateLocales = locales.filter((other) => other !== locale).map(formatOgLocale);

	/**
	 * Who the site is about. One Person node with all social profiles lets Google's knowledge panel
	 * and AI answers connect the TikTok, Instagram and YouTube accounts to this site.
	 */
	const personId = $derived(`${origin}/#person`);
	const websiteId = $derived(`${origin}/#website`);
	const personLd = $derived({
		'@type': 'Person',
		'@id': personId,
		name: COMPANY_DATA.NAME,
		alternateName: m['Company.nickname'](),
		jobTitle: m['Company.role'](),
		description: resolvedDescription,
		knowsAbout: [m['Company.football'](), m['Company.oneOnOneFootball']()],
		url: origin,
		image: `${origin}${COMPANY_DATA.OG_IMAGE}`,
		email: COMPANY_DATA.EMAIL,
		sameAs: [COMPANY_DATA.TIKTOK_URL, COMPANY_DATA.INSTAGRAM_URL, COMPANY_DATA.YOUTUBE_URL]
	});
	const websiteLd = $derived({
		'@type': 'WebSite',
		'@id': websiteId,
		url: origin,
		name: COMPANY_DATA.NAME,
		inLanguage: locale,
		publisher: { '@id': personId }
	});

	const graph = $derived({
		'@context': 'https://schema.org',
		'@graph': [personLd, websiteLd, ...(jsonLd ?? [])]
	});

	// `<` is escaped so a string containing a closing script tag can't break out of it. `TAG` is
	// interpolated rather than written literally for the same reason: a spelled-out closing script
	// tag anywhere in this block would end the block.
	const TAG = 'script';
	const ldTag = (data: JsonLdValue) =>
		`<${TAG} type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</${TAG}>`;

	const graphTag = $derived(ldTag(graph));
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={resolvedDescription} />
	<link rel="canonical" href={canonical} />
	{#each alternates as alternate (alternate.locale)}
		<link rel="alternate" hreflang={alternate.locale} href={alternate.href} />
	{/each}
	<link rel="alternate" hreflang="x-default" href={defaultAlternate} />

	{#if noindex}
		<meta name="robots" content="noindex, nofollow" />
	{:else}
		<!-- Allow large previews and full snippets in Google, Discover and AI answers. -->
		<meta
			name="robots"
			content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
		/>
	{/if}

	<!-- Open Graph -->
	<meta property="og:type" content={ogType} />
	<meta property="og:site_name" content={COMPANY_DATA.NAME} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={resolvedDescription} />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content={imageUrl} />
	<meta property="og:image:alt" content={fullTitle} />
	{#if !isCustomImage}
		<meta property="og:image:width" content={String(COMPANY_DATA.OG_IMAGE_WIDTH)} />
		<meta property="og:image:height" content={String(COMPANY_DATA.OG_IMAGE_HEIGHT)} />
	{/if}
	<meta property="og:locale" content={ogLocaleTag} />
	{#each ogAlternateLocales as alternateLocale (alternateLocale)}
		<meta property="og:locale:alternate" content={alternateLocale} />
	{/each}

	<!-- Twitter / X -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={resolvedDescription} />
	<meta name="twitter:image" content={imageUrl} />
	<meta name="twitter:image:alt" content={fullTitle} />

	<!-- Serialized static config and page data with `<` escaped: the one safe use of @html. -->
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html graphTag}
</svelte:head>
