// SVELTEKIT IMPORTS
import { resolve } from '$app/paths';

// LIBRARIES
import { localizeHref, type Locale } from '@/lib/paraglide/runtime';

export function i18nHref(href: string, options?: { locale?: Locale }): string {
	const localized = localizeHref(href, options);
	// SAFETY: callers pass in-app hrefs and localizeHref only adds a locale prefix, so the
	// string is always a valid route that `resolve` accepts.
	return resolve(...([localized] as Parameters<typeof resolve>));
}
