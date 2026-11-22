const DAY = 86_400;
const HOUR = 3_600;
const MINUTE = 60;

/** Whole days, hours, minutes and seconds left until `targetSeconds`, rounded up; zeros once started. */
export function calculateCountdown(targetSeconds: number, nowSeconds: number) {
	const remaining = Math.max(0, Math.ceil(targetSeconds - nowSeconds));
	const started = remaining === 0;
	const days = Math.floor(remaining / DAY);
	const hours = Math.floor((remaining % DAY) / HOUR);
	const minutes = Math.floor((remaining % HOUR) / MINUTE);
	const seconds = remaining % MINUTE;

	return {
		days,
		hours,
		minutes,
		seconds,
		started
	};
}
