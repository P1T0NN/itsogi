// TYPES
import type { asset } from '$app/paths';
import type { m } from '@/lib/paraglide/messages';

export interface GameEvent {
	/** Kick-off as ISO date-time with the Spain offset, e.g. `2026-11-28T21:00:00+01:00`. Also the event's key. */
	startsAt: string;
	/** Court or park name, e.g. `The cage`. */
	place: string;
	/** City, shown next to the place, e.g. `Valencia`. */
	city: string;
	/** Event poster under `static/`, e.g. `home/opt/event-1-640w.webp` (run `bun run optimize-images` first). Shown uncropped above the countdown, at its own shape. */
	poster?: Parameters<typeof asset>[0];
	/** Google Maps link for the Directions button. */
	mapsUrl: string;
	/** Extra cash on the line at this event, in euros. Leave out when there is none. */
	prize?: number;
	/** Message naming who has to be beaten for the prize. Defaults to Ogi. */
	beatKey?: Extract<keyof typeof m, `Events.${string}`>;
}

/** An upcoming event with its display labels worked out, ready to render. */
export interface UpcomingGameEvent extends GameEvent {
	startsAtSeconds: number;
	/** Translated "Today", "Tomorrow" or the calendar day: the big line. */
	day: string;
	/** e.g. `21 November`. */
	calendarDay: string;
	relativeDay?: 'today' | 'tomorrow';
	/** e.g. `17:00h`. */
	time: string;
	isoStart: string;
}
