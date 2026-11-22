// CONFIG
import { EVENT_TIME_ZONE } from '../config';

// UTILS
import { formatCalendarDate } from '@/shared/features/time/utils/formatCalendarDate';
import { timestampSecondsToDate } from '@/shared/features/time/utils/timestampSecondsToDate';

const DAY_MS = 86_400_000;

/** `today` or `tomorrow` when the event falls on that calendar day in Spain, otherwise undefined. */
export function calculateRelativeDay(startsAtSeconds: number, nowSeconds: number) {
	const eventDay = formatCalendarDate(timestampSecondsToDate(startsAtSeconds), EVENT_TIME_ZONE);
	const today = formatCalendarDate(timestampSecondsToDate(nowSeconds), EVENT_TIME_ZONE);
	// Both are date-only ISO strings, so they parse as UTC midnights and differ by whole days.
	const daysAway = (Date.parse(eventDay) - Date.parse(today)) / DAY_MS;

	if (daysAway === 0) return 'today';
	if (daysAway === 1) return 'tomorrow';
	return undefined;
}
