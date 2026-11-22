// TYPES
import type { RequestEvent } from '@sveltejs/kit';

export function clientMetadata(event: RequestEvent) {
	const headers = event.request.headers;

	return {
		ip: event.getClientAddress(),
		userAgent: headers.get('user-agent'),
		language: headers.get('accept-language'),
		referrer: headers.get('referer'),
		platform: headers.get('sec-ch-ua-platform'),
		platformVersion: headers.get('sec-ch-ua-platform-version'),
		mobile: headers.get('sec-ch-ua-mobile'),
		brands: headers.get('sec-ch-ua'),
		model: headers.get('sec-ch-ua-model'),
		bitness: headers.get('sec-ch-ua-bitness')
	};
}
