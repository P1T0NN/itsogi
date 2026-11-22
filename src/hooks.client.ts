import '@/shared/features/errors/config';

// SVELTEKIT IMPORTS
import { PUBLIC_POSTHOG_KEY } from '$app/env/public';

// LIBRARIES
import posthog from 'posthog-js';
import { m } from '@/lib/paraglide/messages';
import { getLocale } from '@/lib/paraglide/runtime';

// CONFIG
import { POSTHOG_CONFIG } from '@/features/analytics/config';

// UTILS
import { formatFrameworkError } from '@/shared/features/errors/utils/formatFrameworkError';

// TYPES
import type { ClientInit, HandleClientError } from '@sveltejs/kit/hooks';

export const init: ClientInit = () => {
	if (!PUBLIC_POSTHOG_KEY) return;

	// Cookieless: nothing is stored in cookies or local/session storage, so no cookie banner is
	// needed. PostHog counts unique visitors with a daily-rotating server-side hash instead.
	// Requires "Cookieless server hash mode" to be enabled in the PostHog project settings.
	posthog.init(PUBLIC_POSTHOG_KEY, {
		api_host: POSTHOG_CONFIG.PROXY_PATH,
		ui_host: POSTHOG_CONFIG.UI_HOST,
		cookieless_mode: 'always',
		person_profiles: 'never',
		// SvelteKit navigates without full reloads, so count page views on route changes too.
		capture_pageview: 'history_change',
		// Keep interaction analytics limited to named events, with separate exception capture.
		autocapture: false,
		capture_pageleave: false,
		capture_dead_clicks: false,
		capture_heatmaps: false,
		capture_performance: false,
		capture_exceptions: {
			capture_unhandled_errors: true,
			capture_unhandled_rejections: true,
			capture_console_errors: false
		},
		rageclick: false,
		disable_surveys: true,
		disable_session_recording: true
	});
};

export const handleError: HandleClientError = ({ kind, error }) => {
	if (kind === 'unknown') {
		console.error(error);
		if (posthog.__loaded) posthog.captureException(error);
		return { message: m['Errors.unexpected']() };
	}

	if (kind === 'framework')
		return { message: formatFrameworkError(error.status, error.message, getLocale()) };

	return error;
};
