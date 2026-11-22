// SVELTEKIT IMPORTS
import { goto } from '$app/navigation';
import { resolve } from '$app/paths';

// LIBRARIES
import { localizeHref } from '@/lib/paraglide/runtime';

// TYPES
import type { Locale } from '@/lib/paraglide/runtime';
import type { GotoOptions } from '$app/navigation';

export function i18nGoto(href: string, options?: GotoOptions & { locale?: Locale }): Promise<void> {
	const { locale, ...gotoOptions } = options ?? {};

	const localized = localizeHref(href, { locale });

	// SAFETY: callers pass in-app hrefs and localizeHref only adds a locale prefix, so the
	// string is always a valid route that `resolve` accepts.
	return goto(resolve(...([localized] as Parameters<typeof resolve>)), gotoOptions);
}
