// EMAIL TEMPLATES
import { header } from './generic/header';
import { footer } from './generic/footer';

// TYPES
import type { EmailBody } from '../types/emailTypes';

export function magicLinkEmail(url: string): EmailBody {
	return {
		subject: 'Your sign-in link',
		text: `Use this link to sign in:\n\n${url}\n\nThis link expires in five minutes.`,
		html: `
		${header()}
			<h1 style="margin: 0 0 16px; font-size: 20px">Sign in</h1>
			<p style="margin: 0 0 16px">
				Click the link below to sign in. This link expires in five minutes.
			</p>
			<p style="margin: 0 0 16px">
				<a href="${url}" style="display: inline-block; padding: 10px 16px; background-color: #111; color: #ffffff; border-radius: 6px; text-decoration: none">Sign in</a>
			</p>
			<p style="margin: 0">If you didn't request this email, you can safely ignore it.</p>
		${footer()}
	`
	};
}
