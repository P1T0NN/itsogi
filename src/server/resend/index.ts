// SVELTEKIT IMPORTS
import { RESEND_API_KEY } from '$app/env/private';

// LIBRARIES
import { Resend } from 'resend';

// SCHEMAS
import { resendErrorSchema } from '@/shared/features/resend/schemas/resendSchemas';

// TYPES
import type { Response as ResendResponse } from 'resend';

export class ResendRequestError extends Error {
	constructor(
		public readonly status: number,
		public readonly errorName: string | null
	) {
		super(`Resend email request failed (${status})`);
	}
}

class ResendClient extends Resend {
	// The SDK default logs raw provider errors and loses HTTP acceptance on malformed JSON.
	override async fetchRequest<Result>(
		path: string,
		options: RequestInit = {}
	): Promise<ResendResponse<Result>> {
		const response = await fetch(`${this.baseUrl}${path}`, options);

		if (!response.ok) {
			let errorName: string | null = null;
			try {
				const parsed = resendErrorSchema.safeParse(await response.json());
				errorName = parsed.success ? parsed.data.name : null;
			} catch {
				// HTTP status remains authoritative when a provider error body cannot be read.
			}
			throw new ResendRequestError(response.status, errorName);
		}

		// Callers validate successful payloads; unreadable accepted responses must not resend mail.
		const data = await response.json().catch(() => null);

		const headers = Object.fromEntries(response.headers.entries());

		return { data, error: null, headers };
	}
}

export const resend = RESEND_API_KEY ? new ResendClient(RESEND_API_KEY) : null;
