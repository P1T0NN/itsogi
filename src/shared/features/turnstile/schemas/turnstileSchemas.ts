// LIBRARIES
import { z } from 'zod';

// Keep the sensitive transport field out of business schemas, including strict schemas.
export const turnstileSubmissionSchema = z
	.looseObject({ _turnstileToken: z.string().max(2048).catch('').optional() })
	.transform(({ _turnstileToken: token = '', ...input }) => ({ input, token }));

export type typesTurnstileSubmissionInput = z.input<typeof turnstileSubmissionSchema>;
export type typesTurnstileSubmissionOutput = z.output<typeof turnstileSubmissionSchema>;

export const turnstileActionSchema = z.string().regex(/^[a-zA-Z0-9_-]{1,32}$/);

export type typesTurnstileActionInput = z.input<typeof turnstileActionSchema>;
export type typesTurnstileActionOutput = z.output<typeof turnstileActionSchema>;

export const turnstileVerificationSchema = z.object({
	success: z.boolean(),
	action: z.string().optional(),
	hostname: z.string().optional()
});

export type typesTurnstileVerificationInput = z.input<typeof turnstileVerificationSchema>;
export type typesTurnstileVerificationOutput = z.output<typeof turnstileVerificationSchema>;
