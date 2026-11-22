// WRAPPERS
import { safeForm } from '@/wrappers/safeForm';

// MUTATIONS
import { sendContactMessage } from '@/server/contact/mutations/sendContactMessage';

// SCHEMAS
import { contactSchema } from '@/shared/features/contact/schemas/contactSchemas';

export const sendContact = safeForm(
	{ turnstile: { action: 'sendContact' } },
	contactSchema,
	(input) => sendContactMessage(input)
);
