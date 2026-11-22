// SVELTEKIT IMPORTS
import { isHttpError } from '@sveltejs/kit';

// LIBRARIES
import { toast } from 'svelte-sonner';
import { z } from 'zod';
import { m } from '@/lib/paraglide/messages';

// TYPES
import type { ErrorNotifier } from '../types/errorTypes';

const defaultNotifier: ErrorNotifier = (message) => toast.error(message);

const errorBody = z.object({ retryAfter: z.number().positive() });

// Client-side handling only; false means the caller must propagate the error.
export function handleRemoteFunctionsError(
	cause: unknown,
	notify: ErrorNotifier = defaultNotifier
): boolean {
	if (!isHttpError(cause)) return false;

	const isServerError = cause.status >= 500 && cause.status <= 599;
	if (isServerError) {
		notify(m['Errors.unexpectedWithRetry']());
		return true;
	}

	if (cause.status !== 429) return false;

	const body = errorBody.safeParse(cause.body);

	if (!body.success) {
		notify(m['Errors.rateLimit']());
		return true;
	}

	const seconds = Math.ceil(body.data.retryAfter);
	notify(m['Errors.retryIn']({ seconds }));

	return true;
}
