// CONFIG
import { TIME_CONFIG } from '../config';

/**
 * Format a Date for readable prose, e.g. "Sat 28 Nov" or "21:00"; pure.
 * Pass the Intl parts you want. Unlike formatDateTime this is not a fixed timestamp layout.
 * Defaults to the configured time zone and locale; pass a zone to show a venue's local time.
 */
export function formatDateLabel(
	date: Date,
	options: Intl.DateTimeFormatOptions,
	timeZone = TIME_CONFIG.DEFAULT_TIME_ZONE,
	locale = TIME_CONFIG.LOCALE
) {
	return new Intl.DateTimeFormat(locale, { ...options, timeZone }).format(date);
}
