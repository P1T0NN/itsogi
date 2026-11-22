// LIBRARIES
import { deLocalizeUrl } from '@/lib/paraglide/runtime';

// CONFIG
import { NON_LOCALIZED_PATHS } from '@/shared/features/seo/config';

// TYPES
import type { Reroute } from '@sveltejs/kit/hooks';

export const reroute: Reroute = (request) => {
	const pathname = deLocalizeUrl(request.url).pathname;

	// robots.txt, the sitemap, llms.txt and the analytics proxy exist once, at the root. Without
	// this, `/es/robots.txt` would serve a duplicate copy instead of a 404.
	const isLocalizedCopy =
		pathname !== request.url.pathname &&
		NON_LOCALIZED_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
	if (isLocalizedCopy) return request.url.pathname;

	return pathname;
};
