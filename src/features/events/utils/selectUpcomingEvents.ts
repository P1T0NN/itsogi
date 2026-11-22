// CONFIG
import { EVENT_LENGTH_SECONDS } from '../config';

// TYPES
import type { GameEvent } from '../types/eventsTypes';

/**
 * Events that have not finished yet at `nowSeconds`, soonest first, with kick-off in Unix seconds.
 * Throws on an unparsable `startsAt` so a typo in the config fails loudly instead of hiding the event.
 */
export function selectUpcomingEvents(events: GameEvent[], nowSeconds: number) {
	const timed = events.map((event) => {
		const startsAtSeconds = Date.parse(event.startsAt) / 1000;
		if (Number.isNaN(startsAtSeconds)) throw new Error(`Invalid event startsAt: ${event.startsAt}`);
		return { ...event, startsAtSeconds };
	});

	return timed
		.filter((event) => event.startsAtSeconds + EVENT_LENGTH_SECONDS > nowSeconds)
		.sort((a, b) => a.startsAtSeconds - b.startsAtSeconds);
}
