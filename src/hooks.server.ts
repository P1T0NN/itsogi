import '@/shared/features/errors/config';

// SVELTEKIT IMPORTS
import { dev } from '$app/env';
import { sequence } from '@sveltejs/kit/hooks';

// LIBRARIES
import { m } from '@/lib/paraglide/messages';
import { paraglideMiddleware } from '@/lib/paraglide/server';
import { baseLocale, getLocale, getTextDirection } from '@/lib/paraglide/runtime';

// UTILS
import { formatFrameworkError } from '@/shared/features/errors/utils/formatFrameworkError';

// TYPES
import type { Handle, HandleServerError } from '@sveltejs/kit/hooks';

const securityHandle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);

	// Redirects and third-party handlers can return immutable response headers.
	const headers = new Headers(response.headers);

	headers.set('X-Content-Type-Options', 'nosniff');
	headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	headers.set('X-Frame-Options', 'DENY');
	headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

	const isProductionHttps = !dev && event.url.protocol === 'https:';
	if (isProductionHttps) headers.set('Strict-Transport-Security', 'max-age=31536000');

	const hasPrivateResponse =
		event.isRemoteRequest ||
		event.request.headers.has('authorization') ||
		headers.has('set-cookie');

	if (hasPrivateResponse) headers.set('Cache-Control', 'private, no-store');

	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers
	});
};

/**
 * English lives at `/`, so `/en` and `/en/...` would be duplicate copies of it. Send them
 * permanently to the unprefixed URL so search engines keep a single English version.
 */
const baseLocalePrefixHandle: Handle = ({ event, resolve }) => {
	const prefix = `/${baseLocale}`;
	const { pathname, search } = event.url;
	const hasBaseLocalePrefix = pathname === prefix || pathname.startsWith(`${prefix}/`);
	if (!hasBaseLocalePrefix) return resolve(event);

	const target = `${pathname.slice(prefix.length) || '/'}${search}`;
	return new Response(null, { status: 308, headers: { location: target } });
};

// creating a handle to use the paraglide middleware
const paraglideHandle: Handle = ({ event, resolve }) =>
	paraglideMiddleware(
		event.request,
		({ request: localizedRequest, locale }) => {
			// Keep the original remote endpoint URL and query parameters for SvelteKit dispatch.
			if (!event.isRemoteRequest) {
				// SAFETY: SvelteKit exposes `request` as read-only, but it is writable at runtime.
				(event as { request: Request }).request = localizedRequest;
			}

			return resolve(event, {
				transformPageChunk: ({ html }) => {
					return html.replace('%lang%', locale).replace('%dir%', getTextDirection(locale));
				}
			});
		},
		{ effectiveRequestUrl: event.isRemoteRequest ? event.url : undefined }
	);

export const handleError: HandleServerError = (input) => {
	const { kind, error, issues } = input;

	if (kind === 'validation') {
		console.error(issues);
		return error;
	}

	if (kind === 'unknown') {
		console.error(error);
		return { message: m['Errors.unexpected']() };
	}

	if (kind === 'framework')
		return { message: formatFrameworkError(error.status, error.message, getLocale()) };

	return error;
};

export const handle: Handle = sequence(securityHandle, baseLocalePrefixHandle, paraglideHandle);
