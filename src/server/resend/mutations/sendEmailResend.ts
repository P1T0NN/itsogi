// RESEND
import { resend } from '../index';

// CONFIG
import { COMPANY_DATA } from '@/shared/config';

// SCHEMAS
import { resendSubmissionSchema } from '@/shared/features/resend/schemas/resendSchemas';

// TYPES
import type { EmailBody } from '@/shared/features/emails/types/emailTypes';

export async function sendEmailResend({ to, body }: { to: string; body: EmailBody }) {
	const client = resend;
	const hasMissingConfiguration = !client || !COMPANY_DATA.RESEND_EMAIL;
	if (hasMissingConfiguration) {
		throw new Error('RESEND_API_KEY and COMPANY_DATA.RESEND_EMAIL must be set to send emails');
	}

	const response = await client.emails.send(
		{
			from: COMPANY_DATA.RESEND_EMAIL,
			to: [to],
			subject: body.subject,
			text: body.text,
			html: body.html
		},
		{ signal: AbortSignal.timeout(5000) }
	);
	const payload = resendSubmissionSchema.safeParse(response.data);
	// An accepted email with an unreadable ID must not be retried as a failed send.
	const id = payload.success ? payload.data.id : null;
	return { id };
}
