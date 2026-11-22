import { afterEach, expect, it, vi } from 'vitest';
import { COMPANY_DATA } from '@/shared/config';
import { resend } from '../index';
import { sendEmailResend } from '../mutations/sendEmailResend';

const id = '56761188-7520-42d8-8898-ff6fc54ce618';
const input = {
	to: 'recipient@example.test',
	body: { subject: 'Subject', text: 'Message', html: '<p>Message</p>' }
};
const originalSender = COMPANY_DATA.RESEND_EMAIL;

afterEach(() => {
	COMPANY_DATA.RESEND_EMAIL = originalSender;
	vi.restoreAllMocks();
});

it('rejects missing sender configuration before contacting the provider', async () => {
	COMPANY_DATA.RESEND_EMAIL = '';
	const request = vi.spyOn(globalThis, 'fetch');
	await expect(sendEmailResend(input)).rejects.toThrow(
		'RESEND_API_KEY and COMPANY_DATA.RESEND_EMAIL'
	);
	expect(request).not.toHaveBeenCalled();
});

it.skipIf(!resend)('sends the email with a deadline and returns the provider ID', async () => {
	const request = vi.spyOn(globalThis, 'fetch').mockResolvedValue(Response.json({ id }));
	expect(await sendEmailResend(input)).toEqual({ id });
	const [, options] = request.mock.calls[0];
	expect(options?.signal).toBeInstanceOf(AbortSignal);
	expect(JSON.parse(String(options?.body))).toMatchObject({
		from: COMPANY_DATA.RESEND_EMAIL,
		to: [input.to],
		...input.body
	});
});

it.skipIf(!resend)(
	'preserves provider failures without logging private provider payloads',
	async () => {
		vi.spyOn(globalThis, 'fetch').mockResolvedValue(
			Response.json({ message: 'private' }, { status: 503 })
		);
		const log = vi.spyOn(console, 'error');
		await expect(sendEmailResend(input)).rejects.toThrow('Resend email request failed (503)');
		expect(log).not.toHaveBeenCalled();
	}
);

it.skipIf(!resend)('propagates network failures', async () => {
	const cause = new Error('Network unavailable');
	vi.spyOn(globalThis, 'fetch').mockRejectedValue(cause);
	await expect(sendEmailResend(input)).rejects.toBe(cause);
});

it.skipIf(!resend).each([Response.json({ accepted: true }), new Response('invalid json')])(
	'preserves email acceptance when the provider ID is unavailable: %j',
	async (response) => {
		vi.spyOn(globalThis, 'fetch').mockResolvedValue(response);
		expect(await sendEmailResend(input)).toEqual({ id: null });
	}
);
