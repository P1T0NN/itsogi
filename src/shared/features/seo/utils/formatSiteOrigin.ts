// CONFIG
import { COMPANY_DATA } from '@/shared/config';

/**
 * The site's canonical origin without a trailing slash, e.g. `https://itsogi.com`; pure.
 * `PUBLIC_ORIGIN` overrides `COMPANY_DATA.SITE_URL`. Preview deployments still point search
 * engines at the real site.
 */
export function formatSiteOrigin(publicOrigin: string | undefined) {
	const origin = publicOrigin || COMPANY_DATA.SITE_URL;
	return origin.replace(/\/+$/, '');
}
