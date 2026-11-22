// SVELTEKIT IMPORTS
import { PUBLIC_ORIGIN } from '$app/env/public';

// LIBRARIES
import { baseLocale, locales, localizeUrl } from '@/lib/paraglide/runtime';

// UTILS
import { formatSiteOrigin } from '@/shared/features/seo/utils/formatSiteOrigin';

// TYPES
import type { RequestHandler } from './$types';

/** Indexable pages. Section anchors (#events, #reel) are part of `/`, not separate pages. */
const PAGES = ['/'];

export const GET: RequestHandler = () => {
	const origin = formatSiteOrigin(PUBLIC_ORIGIN);

	// One <url> per page and language, each listing every language version (hreflang).
	const entries = PAGES.flatMap((path) => {
		const alternates = locales
			.map((locale) => {
				const href = localizeUrl(`${origin}${path}`, { locale }).href;
				return `\t\t<xhtml:link rel="alternate" hreflang="${locale}" href="${href}"/>`;
			})
			.join('\n');
		const defaultHref = localizeUrl(`${origin}${path}`, { locale: baseLocale }).href;
		const defaultAlternate = `\t\t<xhtml:link rel="alternate" hreflang="x-default" href="${defaultHref}"/>`;

		return locales.map((locale) => {
			const loc = localizeUrl(`${origin}${path}`, { locale }).href;
			return `\t<url>\n\t\t<loc>${loc}</loc>\n${alternates}\n${defaultAlternate}\n\t</url>`;
		});
	});

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>
`;

	return new Response(body, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
