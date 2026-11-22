// CONFIG
import { COMPANY_DATA } from '@/shared/config';

// MUTATIONS
import { sendEmailResend } from '@/server/resend/mutations/sendEmailResend';

// EMAIL TEMPLATES
import { contactEmail } from '@/shared/features/emails/templates/contactEmail';

// SCHEMAS
import { contactSchema } from '@/shared/features/contact/schemas/contactSchemas';

// TYPES
import type { typesContactInput } from '@/shared/features/contact/schemas/contactSchemas';

export async function sendContactMessage(input: typesContactInput, send = sendEmailResend) {
	const message = contactSchema.parse(input);
	const body = contactEmail(message);

	await send({ to: COMPANY_DATA.EMAIL, body });
}
