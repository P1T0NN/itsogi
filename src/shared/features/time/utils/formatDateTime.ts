// CONFIG
import { TIME_CONFIG } from '../config';

const defaultTimeZone = TIME_CONFIG.DEFAULT_TIME_ZONE;
const defaultLocale = TIME_CONFIG.LOCALE;

const options: Intl.DateTimeFormatOptions = {
	// Keep the fixed numeric layout used by timestamp table cells across locales.
	calendar: 'gregory',
	numberingSystem: 'latn',
	year: 'numeric',
	month: '2-digit',
	day: '2-digit',
	hour: '2-digit',
	minute: '2-digit',
	second: '2-digit',
	fractionalSecondDigits: 3,
	hourCycle: 'h23',
	timeZoneName: 'longOffset'
};

const defaultFormatter = new Intl.DateTimeFormat(defaultLocale, {
	...options,
	timeZone: defaultTimeZone
});

/**
 * Format a Date as YYYY-MM-DD HH:mm:ss.SSS <timezone> (offset); pure, no clock read.
 * Use for human-readable timestamps with TIME_CONFIG.LOCALE and DEFAULT_TIME_ZONE (UTC).
 * Date.toISOString() remains the UTC format for machine transport and <time datetime>.
 * Invalid dates/timezones throw RangeError. Formatting never changes the supplied instant.
 */
export function formatDateTime(date: Date, timeZone = TIME_CONFIG.DEFAULT_TIME_ZONE) {
	const locale = TIME_CONFIG.LOCALE;
	const canReuseDefaultFormatter = timeZone === defaultTimeZone && locale === defaultLocale;
	const formatter = canReuseDefaultFormatter
		? defaultFormatter
		: new Intl.DateTimeFormat(locale, { ...options, timeZone });

	const parts = Object.fromEntries(
		formatter.formatToParts(date).map(({ type, value }) => [type, value])
	);

	const calendarDate = `${parts.year}-${parts.month}-${parts.day}`;
	const clockTime = `${parts.hour}:${parts.minute}:${parts.second}.${parts.fractionalSecond}`;
	const zoneLabel = timeZone === 'UTC' ? timeZone : `${timeZone} (${parts.timeZoneName})`;

	return `${calendarDate} ${clockTime} ${zoneLabel}`;
}
