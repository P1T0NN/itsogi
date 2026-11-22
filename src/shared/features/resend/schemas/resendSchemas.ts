// LIBRARIES
import { z } from 'zod';

export const resendSubmissionSchema = z.object({ id: z.uuid() });

// Only recognized configuration codes may leave the provider transport as error metadata.
export const resendErrorSchema = z.object({
	name: z.enum([
		'validation_error',
		'restricted_api_key',
		'suspended_api_key',
		'invalid_permission'
	])
});
