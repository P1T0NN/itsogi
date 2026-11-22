// LIBRARIES
import { z } from 'zod';

/** Validate a timezone supported by Intl, such as UTC or Europe/Paris. */
export const timeZoneSchema = z
	.string()
	.trim()
	.min(1)
	.refine((timeZone) => {
		try {
			new Intl.DateTimeFormat(undefined, { timeZone });
			return true;
		} catch {
			return false;
		}
	}, 'Invalid time zone');

/** Reject malformed or unsupported locales instead of silently using the runtime default. */
export const timeLocaleSchema = z
	.string()
	.trim()
	.min(1)
	.refine((locale) => {
		try {
			return Intl.DateTimeFormat.supportedLocalesOf(locale).length > 0;
		} catch {
			return false;
		}
	}, 'Invalid or unsupported time locale');

export const timeConfigSchema = z.strictObject({
	DEFAULT_TIME_ZONE: timeZoneSchema,
	LOCALE: timeLocaleSchema
});

export type typesTimeConfigOutput = z.output<typeof timeConfigSchema>;
