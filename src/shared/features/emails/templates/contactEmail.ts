// EMAIL TEMPLATES
import { header } from './generic/header';
import { footer } from './generic/footer';

// TYPES
import type { EmailBody } from '../types/emailTypes';
import type { typesContactOutput } from '@/shared/features/contact/schemas/contactSchemas';

// Visitors write these fields, so they must never be interpreted as HTML.
function _escapeHtml(value: string): string {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#39;');
}

export function contactEmail({ name, email, message }: typesContactOutput): EmailBody {
	const safeName = _escapeHtml(name);
	const safeEmail = _escapeHtml(email);
	const safeMessage = _escapeHtml(message).replaceAll('\n', '<br />');

	const subject = `New message from ${name}`;
	const text = `From: ${name} <${email}>\n\n${message}`;
	const html = `
		${header()}
			<h1 style="margin: 0 0 16px; font-size: 20px">New message from the website</h1>
			<p style="margin: 0 0 4px"><strong>${safeName}</strong></p>
			<p style="margin: 0 0 16px"><a href="mailto:${safeEmail}">${safeEmail}</a></p>
			<p style="margin: 0">${safeMessage}</p>
		${footer()}
	`;

	return {
		subject,
		text,
		html
	};
}
