// CONFIG
import { EVENT_LENGTH_SECONDS } from '../config';

// TYPES
import type { GameEvent } from '../types/eventsTypes';

/** The most recently finished event at `nowSeconds`, with kick-off in Unix seconds, or undefined. */
export function selectPreviousEvent(events: GameEvent[], nowSeconds: number) {
	return events
		.map((event) => ({ ...event, startsAtSeconds: Date.parse(event.startsAt) / 1000 }))
		.filter((event) => event.startsAtSeconds + EVENT_LENGTH_SECONDS <= nowSeconds)
		.sort((a, b) => b.startsAtSeconds - a.startsAtSeconds)[0];
}
