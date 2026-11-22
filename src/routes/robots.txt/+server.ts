// SVELTEKIT IMPORTS
import { PUBLIC_ORIGIN } from '$app/env/public';

// UTILS
import { formatSiteOrigin } from '@/shared/features/seo/utils/formatSiteOrigin';

// TYPES
import type { RequestHandler } from './$types';

/**
 * AI crawlers are named explicitly so it is clear they are welcome: search bots (cited in ChatGPT,
 * Claude and Perplexity answers), user-triggered fetchers, and training bots. Remove a name here
 * to opt that bot out.
 */
const AI_CRAWLERS = [
	'OAI-SearchBot',
	'ChatGPT-User',
	'GPTBot',
	'Claude-SearchBot',
	'Claude-User',
	'ClaudeBot',
	'PerplexityBot',
	'Perplexity-User',
	'Google-Extended',
	'Applebot-Extended'
];

export const GET: RequestHandler = () => {
	const origin = formatSiteOrigin(PUBLIC_ORIGIN);
	const aiAgents = AI_CRAWLERS.map((agent) => `User-agent: ${agent}`).join('\n');
	// `/ingest` is the analytics proxy, not content. Every language version (`/`, `/es`) stays crawlable.
	const rules = 'Allow: /\nDisallow: /ingest/';
	const body = `User-agent: *\n${rules}\n\n${aiAgents}\n${rules}\n\nSitemap: ${origin}/sitemap.xml\n`;

	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
