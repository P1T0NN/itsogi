// TYPES
import type { GameEvent } from './types/eventsTypes';

/** The courts are in Valencia, so event dates show in Spain time whatever the visitor's zone. */
export const EVENT_TIME_ZONE = 'Europe/Madrid';

/** How long after kick-off an event still shows as live before it drops off the site. */
export const EVENT_LENGTH_SECONDS = 3 * 60 * 60;

/**
 * Upcoming games, in any order. The soonest one is the big "Next event"; the rest are listed under
 * it. Once none are left, the latest past game shows as "Previous event"; an empty list shows "No events scheduled".
 * Write `startsAt` with the Spain offset: +01:00 in winter, +02:00 in summer. Entry is always free.
 */
// shortcut: placeholder poster and Maps link; replace with the real ones.
export const EVENTS: GameEvent[] = [
	{
		startsAt: '2026-11-21T17:00:00+01:00',
		place: 'Vicent Zaragoza',
		poster: 'home/opt/event-1-640w.webp',
		city: 'Valencia',
		mapsUrl: 'https://maps.app.goo.gl/Grx9ejrJYajjeAQe8',
		prize: 100,
		beatKey: 'Events.ogiAndKevin'
	}
];
