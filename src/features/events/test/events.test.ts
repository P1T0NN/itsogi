import { expect, it } from 'vitest';
import { EVENT_LENGTH_SECONDS } from '../config';
import { calculateCountdown } from '../utils/calculateCountdown';
import { calculateRelativeDay } from '../utils/calculateRelativeDay';
import { formatSportsEventJsonLd } from '../utils/formatSportsEventJsonLd';
import { selectPreviousEvent } from '../utils/selectPreviousEvent';
import { selectUpcomingEvents } from '../utils/selectUpcomingEvents';

const base = { place: 'Court', city: 'Valencia', mapsUrl: 'https://maps.google.com' };
const kickOff = Date.parse('2026-11-28T21:00:00+01:00') / 1000;

it('keeps unfinished events, soonest first', () => {
	const events = [
		{ ...base, startsAt: '2026-12-05T20:30:00+01:00' },
		{ ...base, startsAt: '2026-11-28T21:00:00+01:00' },
		{ ...base, startsAt: '2026-11-01T21:00:00+01:00' }
	];

	const upcoming = selectUpcomingEvents(events, kickOff - 60);

	expect(upcoming.map((event) => event.startsAt)).toEqual([
		'2026-11-28T21:00:00+01:00',
		'2026-12-05T20:30:00+01:00'
	]);
	expect(upcoming[0].startsAtSeconds).toBe(kickOff);
});

it('keeps an event while it is live and drops it once it is over', () => {
	const events = [{ ...base, startsAt: '2026-11-28T21:00:00+01:00' }];

	expect(selectUpcomingEvents(events, kickOff + EVENT_LENGTH_SECONDS - 1)).toHaveLength(1);
	expect(selectUpcomingEvents(events, kickOff + EVENT_LENGTH_SECONDS)).toHaveLength(0);
});

it('picks the latest finished event as the previous one', () => {
	const events = [
		{ ...base, startsAt: '2026-11-01T21:00:00+01:00' },
		{ ...base, startsAt: '2026-11-28T21:00:00+01:00' },
		{ ...base, startsAt: '2026-11-14T21:00:00+01:00' }
	];

	expect(selectPreviousEvent(events, kickOff)?.startsAt).toBe('2026-11-14T21:00:00+01:00');
	expect(selectPreviousEvent(events, kickOff + EVENT_LENGTH_SECONDS)?.startsAt).toBe(
		'2026-11-28T21:00:00+01:00'
	);
	expect(selectPreviousEvent(events.slice(1, 2), kickOff)).toBeUndefined();
});

it('throws on an unparsable start so config typos are not silently hidden', () => {
	expect(() => selectUpcomingEvents([{ ...base, startsAt: '28/11 21h' }], 0)).toThrow();
});

it('splits the time left and rounds partial seconds up', () => {
	const left = 2 * 86_400 + 3 * 3_600 + 4 * 60 + 5;

	expect(calculateCountdown(kickOff, kickOff - left - 0.4)).toEqual({
		days: 2,
		hours: 3,
		minutes: 4,
		seconds: 6,
		started: false
	});
	expect(calculateCountdown(kickOff, kickOff - 0.2).started).toBe(false);
	expect(calculateCountdown(kickOff, kickOff + 10)).toEqual({
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
		started: true
	});
});

it('labels Today and Tomorrow by the calendar day in Spain, not UTC', () => {
	const seconds = (iso: string) => Date.parse(iso) / 1000;
	const event = seconds('2026-11-22T10:00:00+01:00');

	// 23:30 on the 21st in Spain: the game is tomorrow.
	expect(calculateRelativeDay(event, seconds('2026-11-21T23:30:00+01:00'))).toBe('tomorrow');
	// 23:30 UTC is already 00:30 on the 22nd in Spain: the game is today.
	expect(calculateRelativeDay(event, seconds('2026-11-21T23:30:00Z'))).toBe('today');
	// Two days out, or already past: no label.
	expect(calculateRelativeDay(event, seconds('2026-11-20T12:00:00+01:00'))).toBeUndefined();
	expect(calculateRelativeDay(event, seconds('2026-11-23T12:00:00+01:00'))).toBeUndefined();
});

it('describes an event as a free SportsEvent that ends EVENT_LENGTH_SECONDS after kick-off', () => {
	const event = {
		...base,
		startsAt: '2026-11-28T21:00:00+01:00',
		poster: 'home/opt/event-1-640w.webp' as const
	};

	const jsonLd = formatSportsEventJsonLd({
		event,
		startsAtSeconds: kickOff,
		origin: 'https://example.com',
		performerId: 'https://example.com/#person',
		name: 'Event',
		description: 'Free entry.'
	});

	expect(jsonLd.startDate).toBe('2026-11-28T21:00:00+01:00');
	expect(Date.parse(jsonLd.endDate) / 1000).toBe(kickOff + EVENT_LENGTH_SECONDS);
	expect(jsonLd.image).toEqual(['https://example.com/home/opt/event-1-640w.webp']);
	expect(jsonLd.isAccessibleForFree).toBe(true);
	expect(jsonLd.location.address.addressLocality).toBe('Valencia');
});
