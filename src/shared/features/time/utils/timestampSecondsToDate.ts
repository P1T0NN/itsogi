/**
 * Convert a timestamp in seconds since 1970-01-01 UTC into a Date; pure, no I/O.
 * Use when formatting or passing a seconds-based timestamp to an API that expects Date.
 * The instant is timezone-independent; apply the display timezone only when formatting.
 */
export function timestampSecondsToDate(timestampSeconds: number) {
	return new Date(timestampSeconds * 1000);
}
