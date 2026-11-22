/**
 * PostHog region: `eu` or `us`, whichever you picked when creating the PostHog account
 * (your dashboard URL is eu.posthog.com or us.posthog.com).
 */
const POSTHOG_REGION = 'eu';

/** Analytics go through our own domain (`/ingest`), so ad-blockers don't drop them. */
export const POSTHOG_CONFIG = {
	PROXY_PATH: '/ingest',
	/** Where events are forwarded to. */
	API_HOST: `https://${POSTHOG_REGION}.i.posthog.com`,
	/** Where PostHog's own lazily loaded scripts live. */
	ASSETS_HOST: `https://${POSTHOG_REGION}-assets.i.posthog.com`,
	/** The PostHog app, for links back from the toolbar. */
	UI_HOST: `https://${POSTHOG_REGION}.posthog.com`
};
