// SVELTEKIT IMPORTS
import { building } from '$app/env';
import { defineEnvVars } from '@sveltejs/kit/env';

function _requireAtRuntime(value: string | undefined) {
	const isMissingAtRuntime = !building && !value;
	if (isMissingAtRuntime) throw new Error('Value is required at runtime');
	return value;
}

export const variables = defineEnvVars({
	RESEND_API_KEY: { schema: _requireAtRuntime },
	TURNSTILE_SECRET_KEY: { schema: _requireAtRuntime },
	PUBLIC_TURNSTILE_KEY: { public: true, schema: _requireAtRuntime },
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
