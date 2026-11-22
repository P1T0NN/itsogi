// SVELTEKIT IMPORTS
import { TURNSTILE_SECRET_KEY } from '$app/env/private';
import { error } from '@sveltejs/kit';

// LIBRARIES
import { m } from '@/lib/paraglide/messages';

// SCHEMAS
import { turnstileVerificationSchema } from '@/shared/features/turnstile/schemas/turnstileSchemas';

type VerificationDependencies = {
	secret: string | undefined;
	fetch: typeof globalThis.fetch;
};

export async function verifyTurnstile(
	token: string,
	action: string,
	hostname: string,
	dependencies: VerificationDependencies = { secret: TURNSTILE_SECRET_KEY, fetch: globalThis.fetch }
) {
	if (!dependencies.secret) error(503, m['Turnstile.temporarilyUnavailable']());

	const hasInvalidToken = !token || token.length > 2048;
	if (hasInvalidToken) return false;

	const body = new URLSearchParams({ secret: dependencies.secret, response: token });

	try {
		const response = await dependencies.fetch(
			'https://challenges.cloudflare.com/turnstile/v0/siteverify',
			{
				method: 'POST',
				body,
				signal: AbortSignal.timeout(10_000)
			}
		);

		if (!response.ok) error(503, m['Turnstile.temporarilyUnavailable']());

		const result = turnstileVerificationSchema.safeParse(await response.json());

		if (!result.success) error(503, m['Turnstile.temporarilyUnavailable']());

		// Cloudflare's public passing test key returns placeholder action/hostname metadata.
		const isTestSecret = dependencies.secret === '1x0000000000000000000000000000000AA';
		const matchesContext = result.data.action === action && result.data.hostname === hostname;

		return result.data.success && (isTestSecret || matchesContext);
	} catch {
		error(503, m['Turnstile.temporarilyUnavailable']());
	}
}
