/**
 * Read the current timestamp: seconds since 1970-01-01 UTC, including fractions; no I/O.
 * Use for tokens, webhook receipt checks and countdowns. Machine clocks may differ.
 * Timezone configuration does not change this instant.
 */
export function readCurrentTimestampSeconds() {
	return Date.now() / 1000;
}
