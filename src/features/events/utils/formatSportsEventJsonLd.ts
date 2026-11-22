// CONFIG
import { EVENT_LENGTH_SECONDS } from '../config';

// UTILS
import { timestampSecondsToDate } from '@/shared/features/time/utils/timestampSecondsToDate';

// TYPES
import type { GameEvent } from '../types/eventsTypes';

/**
 * schema.org `SportsEvent` for one event, so Google and AI answers can show its date, place and
 * prize; pure. `name` and `description` come translated from the caller.
 */
export function formatSportsEventJsonLd({
	event,
	startsAtSeconds,
	origin,
	performerId,
	name,
	description
}: {
	event: GameEvent;
	startsAtSeconds: number;
	origin: string;
	performerId: string;
	name: string;
	description: string;
}) {
	const endDate = timestampSecondsToDate(startsAtSeconds + EVENT_LENGTH_SECONDS).toISOString();
	const image = event.poster ? [`${origin}/${event.poster}`] : undefined;
	const location = {
		'@type': 'Place',
		name: event.place,
		address: { '@type': 'PostalAddress', addressLocality: event.city, addressCountry: 'ES' },
		hasMap: event.mapsUrl
	};
	const offers = {
		'@type': 'Offer',
		price: 0,
		priceCurrency: 'EUR',
		availability: 'https://schema.org/InStock',
		url: `${origin}/#events`
	};
	const performer = { '@id': performerId };

	return {
		'@type': 'SportsEvent',
		name,
		description,
		sport: 'Football',
		startDate: event.startsAt,
		endDate,
		eventStatus: 'https://schema.org/EventScheduled',
		eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
		isAccessibleForFree: true,
		location,
		image,
		offers,
		performer,
		organizer: performer
	};
}
