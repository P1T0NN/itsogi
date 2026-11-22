// LIBRARIES
import { m } from '@/lib/paraglide/messages';

// TYPES
import type { Locale } from '@/lib/paraglide/runtime';

export function formatFrameworkError(status: number, fallback: string, locale: Locale) {
	const options = { locale };
	switch (status) {
		case 404:
			return m['Errors.notFound']({}, options);
		case 405:
			return m['Errors.methodNotAllowed']({}, options);
		case 413:
			return m['Errors.requestTooLarge']({}, options);
		default:
			return fallback;
	}
}
