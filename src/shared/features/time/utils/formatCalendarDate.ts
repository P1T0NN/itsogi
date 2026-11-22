// CONFIG
import { TIME_CONFIG } from '../config';

/**
 * The calendar day a Date falls on in a timezone, as `YYYY-MM-DD`; pure.
 * Use to compare days ("is it today there?"), not for display. Defaults to DEFAULT_TIME_ZONE.
 */
export function formatCalendarDate(date: Date, timeZone = TIME_CONFIG.DEFAULT_TIME_ZONE) {
	const formatter = new Intl.DateTimeFormat('en-GB', {
		calendar: 'gregory',
		numberingSystem: 'latn',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		timeZone
	});
	const parts = Object.fromEntries(
		formatter.formatToParts(date).map(({ type, value }) => [type, value])
	);

	return `${parts.year}-${parts.month}-${parts.day}`;
}
