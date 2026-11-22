// SVELTEKIT IMPORTS
import { building } from '$app/env';
import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	RESEND_API_KEY: {
		schema: (value) => {
			if (!value && !building) throw new Error('RESEND_API_KEY is not set');
			return value;
		}
	},
	TURNSTILE_SECRET_KEY: {},
	PUBLIC_TURNSTILE_KEY: { public: true },
	PUBLIC_POSTHOG_KEY: {
		public: true,
		description:
			'PostHog project API key (starts with phc_), from PostHog > Settings > Project. Optional: analytics stay off when unset.',
		schema: (value) => value
	},
	PUBLIC_ORIGIN: {
		public: true,
		description:
			'Public site origin for canonical, sitemap and Open Graph URLs. Optional: falls back to COMPANY_DATA.SITE_URL.',
		schema: (value) => value
	}
});
