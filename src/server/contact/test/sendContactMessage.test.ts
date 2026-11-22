import { expect, it, vi } from 'vitest';
import { sendContactMessage } from '../mutations/sendContactMessage';

// CONFIG
import { COMPANY_DATA } from '@/shared/config';

it('rejects an invalid message before sending anything', async () => {
	const send = vi.fn();
	await expect(
		sendContactMessage({ name: 'Marko', email: 'not-an-email', message: 'Want to play 1v1' }, send)
	).rejects.toThrow();
	expect(send).not.toHaveBeenCalled();
});

it('sends the trimmed message to the collab inbox', async () => {
	const send = vi.fn().mockResolvedValue({ id: 'email-id' });
	await sendContactMessage(
		{ name: ' Marko ', email: 'marko@example.com', message: ' Sponsored 1v1 next month? ' },
		send
	);
	expect(send).toHaveBeenCalledOnce();
	const { to, body } = send.mock.calls[0][0];
	expect(to).toBe(COMPANY_DATA.EMAIL);
	expect(body.subject).toBe('New message from Marko');
	expect(body.text).toContain('marko@example.com');
});

it('escapes visitor-written HTML in the email body', async () => {
	const send = vi.fn().mockResolvedValue({ id: 'email-id' });
	await sendContactMessage(
		{
			name: '<b>Marko</b>',
			email: 'marko@example.com',
			message: '<script>alert(1)</script> hello'
		},
		send
	);
	const { body } = send.mock.calls[0][0];
	expect(body.html).not.toContain('<script>');
	expect(body.html).toContain('&lt;script&gt;');
	expect(body.html).toContain('&lt;b&gt;Marko&lt;/b&gt;');
});
