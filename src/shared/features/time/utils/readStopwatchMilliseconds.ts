/**
 * Read a stopwatch value in milliseconds; synchronous, no I/O.
 * Use differences between readings to measure elapsed time, regardless of wall-clock changes.
 * Values are process/page-local: never store them as dates or transfer them between runtimes.
 */
export function readStopwatchMilliseconds() {
	return performance.now();
}
