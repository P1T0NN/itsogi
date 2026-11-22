// LIBRARIES
import posthog from 'posthog-js';

// TYPES
import type { AnalyticsEvents } from '../types/analyticsTypes';

/**
 * Send a named event to PostHog. Does nothing when analytics are off (no `PUBLIC_POSTHOG_KEY`)
 * or before PostHog has started, so callers never need to check.
 */
export function trackEvent<Name extends keyof AnalyticsEvents>(
	name: Name,
	properties: AnalyticsEvents[Name]
) {
	if (!posthog.__loaded) return;
	posthog.capture(name, properties);
}
