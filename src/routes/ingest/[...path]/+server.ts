// CONFIG
import { POSTHOG_CONFIG } from '@/features/analytics/config';

// TYPES
import type { RequestHandler } from './$types';

// PostHog posts to paths ending in `/` (`/e/`, `/flags/`); a trailing-slash redirect would drop them.
export const trailingSlash = 'ignore';

// Hop-by-hop or rewritten headers that must not be copied between the two connections.
const DROPPED_REQUEST_HEADERS = ['host', 'cookie', 'connection', 'content-length'];
const DROPPED_RESPONSE_HEADERS = [
	'content-encoding',
	'content-length',
	'transfer-encoding',
	'connection'
];

/**
 * Reverse proxy for PostHog under our own domain, so ad-blockers that block posthog.com don't
 * drop the analytics. `/ingest/static/*` serves PostHog's scripts, everything else is events.
 */
export const fallback: RequestHandler = async ({ request, params, url, getClientAddress }) => {
	const isAsset = params.path.startsWith('static/');
	const upstreamHost = isAsset ? POSTHOG_CONFIG.ASSETS_HOST : POSTHOG_CONFIG.API_HOST;
	const upstreamUrl = `${upstreamHost}/${params.path}${url.search}`;

	const headers = new Headers(request.headers);
	for (const name of DROPPED_REQUEST_HEADERS) headers.delete(name);
	// Lets PostHog estimate the visitor's country; it does not store the IP in cookieless mode.
	headers.set('x-forwarded-for', getClientAddress());

	const hasBody = !['GET', 'HEAD'].includes(request.method);
	const body = hasBody ? await request.arrayBuffer() : undefined;
	const upstream = await fetch(upstreamUrl, { method: request.method, headers, body });

	// fetch already decoded the body, so the upstream encoding and length no longer apply.
	const responseHeaders = new Headers(upstream.headers);
	for (const name of DROPPED_RESPONSE_HEADERS) responseHeaders.delete(name);

	return new Response(upstream.body, {
		status: upstream.status,
		statusText: upstream.statusText,
		headers: responseHeaders
	});
};
