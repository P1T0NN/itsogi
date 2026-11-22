// LIBRARIES
import { afterEach, expect, it } from 'vitest';

// CONFIG
import { TIME_CONFIG } from '../config';

// SCHEMAS
import { timeConfigSchema, timeLocaleSchema, timeZoneSchema } from '../schemas/timeSchemas';

// UTILS
import { formatDateTime } from '../utils/formatDateTime';
import { timestampSecondsToDate } from '../utils/timestampSecondsToDate';

const originalTimeZone = TIME_CONFIG.DEFAULT_TIME_ZONE;
const originalLocale = TIME_CONFIG.LOCALE;
afterEach(() => {
	TIME_CONFIG.DEFAULT_TIME_ZONE = originalTimeZone;
	TIME_CONFIG.LOCALE = originalLocale;
});

it.each(['UTC', 'Europe/Paris', 'America/New_York'])(
	'accepts a supported project timezone: %s',
	(timeZone) => {
		expect(timeConfigSchema.parse({ DEFAULT_TIME_ZONE: timeZone, LOCALE: 'en-GB' })).toEqual({
			DEFAULT_TIME_ZONE: timeZone,
			LOCALE: 'en-GB'
		});
	}
);

it.each(['', '   ', 'Mars/Olympus', 'Europe/Not_A_City'])(
	'rejects an invalid project timezone: %s',
	(timeZone) => {
		expect(timeZoneSchema.safeParse(timeZone).success).toBe(false);
	}
);

it('rejects missing or unknown configuration and trims a valid timezone', () => {
	expect(timeConfigSchema.safeParse({}).success).toBe(false);
	expect(timeConfigSchema.safeParse({ DEFAULT_TIME_ZONE: 'UTC' }).success).toBe(false);
	expect(
		timeConfigSchema.safeParse({ DEFAULT_TIME_ZONE: 'UTC', LOCALE: 'en-GB', offset: 1 }).success
	).toBe(false);
	expect(timeZoneSchema.parse(' UTC ')).toBe('UTC');
});

it.each(['en-GB', 'fr-FR', 'ar-EG', 'th-TH'])('accepts a supported time locale: %s', (locale) => {
	expect(timeConfigSchema.parse({ DEFAULT_TIME_ZONE: 'UTC', LOCALE: ` ${locale} ` }).LOCALE).toBe(
		locale
	);
});

it.each(['', '   ', 'en_GB', 'zz-ZZ'])('rejects an invalid or unsupported locale: %s', (locale) => {
	expect(timeLocaleSchema.safeParse(locale).success).toBe(false);
});

it('uses the configured locale for both the default timezone and explicit timezone overrides', () => {
	const date = new Date('2026-06-01T00:30:00.123Z');
	TIME_CONFIG.LOCALE = 'fr-FR';
	expect(formatDateTime(date)).toBe('2026-06-01 00:30:00.123 UTC');
	expect(formatDateTime(date, 'Europe/Paris')).toBe(
		'2026-06-01 02:30:00.123 Europe/Paris (UTC+02:00)'
	);
	TIME_CONFIG.DEFAULT_TIME_ZONE = 'Europe/Paris';
	expect(formatDateTime(date)).toBe('2026-06-01 02:30:00.123 Europe/Paris (UTC+02:00)');
	expect(date.toISOString()).toBe('2026-06-01T00:30:00.123Z');
});

it.each(['ar-EG', 'th-TH'])('preserves the fixed numeric date layout with locale %s', (locale) => {
	TIME_CONFIG.LOCALE = locale;
	expect(formatDateTime(new Date('2026-01-01T00:00:00.123Z'))).toBe('2026-01-01 00:00:00.123 UTC');
});

it('preserves fractional seconds and uses UTC by default', () => {
	const date = timestampSecondsToDate(100.125);
	expect(date.toISOString()).toBe('1970-01-01T00:01:40.125Z');
	expect(formatDateTime(date)).toBe('1970-01-01 00:01:40.125 UTC');
});

it('preserves instants before the Unix epoch', () => {
	expect(formatDateTime(timestampSecondsToDate(-0.25))).toBe('1969-12-31 23:59:59.750 UTC');
});

it('uses configured display time without changing the Date or its UTC transport value', () => {
	const date = new Date('2026-01-01T00:30:00.123Z');
	const originalInstant = date.getTime();
	TIME_CONFIG.DEFAULT_TIME_ZONE = 'America/New_York';
	expect(formatDateTime(date)).toBe('2025-12-31 19:30:00.123 America/New_York (GMT-05:00)');
	expect(date.getTime()).toBe(originalInstant);
	expect(date.toISOString()).toBe('2026-01-01T00:30:00.123Z');
	expect(formatDateTime(date, 'UTC')).toBe('2026-01-01 00:30:00.123 UTC');
});

it.each([
	['2026-03-29T00:30:00.000Z', '2026-03-29 01:30:00.000 Europe/Paris (GMT+01:00)'],
	['2026-03-29T01:30:00.000Z', '2026-03-29 03:30:00.000 Europe/Paris (GMT+02:00)'],
	['2026-10-25T00:30:00.000Z', '2026-10-25 02:30:00.000 Europe/Paris (GMT+02:00)'],
	['2026-10-25T01:30:00.000Z', '2026-10-25 02:30:00.000 Europe/Paris (GMT+01:00)']
])('applies daylight-saving rules to %s', (instant, expected) => {
	expect(formatDateTime(new Date(instant), 'Europe/Paris')).toBe(expected);
});

it('shows UTC midnight as 00:00 and rejects invalid dates/timezones', () => {
	expect(formatDateTime(new Date('2026-01-01T00:00:00.000Z'))).toBe('2026-01-01 00:00:00.000 UTC');
	expect(() => formatDateTime(new Date(Number.NaN))).toThrow(RangeError);
	expect(() => formatDateTime(new Date(0), 'Not/A_Zone')).toThrow(RangeError);
});
