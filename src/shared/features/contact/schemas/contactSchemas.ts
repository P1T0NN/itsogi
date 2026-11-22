// LIBRARIES
import { z } from 'zod';

export const contactSchema = z.object({
	name: z.string().trim().min(2).max(100),
	email: z.email().max(254),
	message: z.string().trim().min(10).max(2000)
});

export type typesContactInput = z.input<typeof contactSchema>;
export type typesContactOutput = z.output<typeof contactSchema>;
