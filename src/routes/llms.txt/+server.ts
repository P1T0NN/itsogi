// SVELTEKIT IMPORTS
import { PUBLIC_ORIGIN } from '$app/env/public';

// LIBRARIES
import { m } from '@/lib/paraglide/messages';

// CONFIG
import { COMPANY_DATA } from '@/shared/config';
import { EVENTS, EVENT_TIME_ZONE } from '@/features/events/config';
import { WINSTREAK } from '@/features/winstreak/config';

// UTILS
import { selectUpcomingEvents } from '@/features/events/utils/selectUpcomingEvents';
import { calculateWinstreakView } from '@/features/winstreak/utils/calculateWinstreakView';
import { formatSiteOrigin } from '@/shared/features/seo/utils/formatSiteOrigin';
import { formatDateLabel } from '@/shared/features/time/utils/formatDateLabel';
import { readCurrentTimestampSeconds } from '@/shared/features/time/utils/readCurrentTimestampSeconds';

// TYPES
import type { RequestHandler } from './$types';

/**
 * Plain-text summary for AI tools and agents (llmstxt.org), built from the live config so the
 * streak and next event are always current. English only: it is read by machines, not shown.
 */
export const GET: RequestHandler = () => {
	const origin = formatSiteOrigin(PUBLIC_ORIGIN);
	const { prize, nextPrize, winsToNextBump } = calculateWinstreakView(WINSTREAK);

	const events = selectUpcomingEvents(EVENTS, readCurrentTimestampSeconds()).map((event) => {
		const when = formatDateLabel(
			new Date(event.startsAt),
			{ dateStyle: 'full', timeStyle: 'short' },
			EVENT_TIME_ZONE
		);
		const rivals = event.beatKey ? m[event.beatKey]({}, { locale: 'en' }) : COMPANY_DATA.NAME;
		const prizeLine = event.prize ? `, ${event.prize} EUR if you beat ${rivals}` : '';
		return `- ${when} (Spain time) at ${event.place}, ${event.city}. Free entry${prizeLine}. Directions: ${event.mapsUrl}`;
	});
	const eventLines =
		events.length > 0
			? events.join('\n')
			: '- No events scheduled right now. Follow the socials below to see where the next 1v1s happen.';

	const body = `# ${COMPANY_DATA.NAME}

> ${COMPANY_DATA.NAME}, known as the ${m['Company.nickname']({}, { locale: 'en' })}, is a ${m['Company.role']({}, { locale: 'en' })}. ${COMPANY_DATA.NAME} plays 1v1s anywhere, anytime and against everyone: on the street, on artificial grass and on natural grass. Every match is first to 3 goals, and a public winstreak carries a cash prize for whoever breaks it.

## How to play ${COMPANY_DATA.NAME}

- Follow ${COMPANY_DATA.NAME} on TikTok, Instagram and YouTube. When ${COMPANY_DATA.NAME} is playing, the Stories show when and where, so you can come and play a 1v1.
- Or join an event: the next one is always listed at ${origin}/#events.
- Anyone can play. Entry to events is free.

## Upcoming events

${eventLines}

## Winstreak

- Current streak: ${WINSTREAK} wins in a row, the highest ever.
- Prize for breaking it: ${prize} EUR. Every 5 wins in a row add 5 EUR.
- ${winsToNextBump} more wins raise it to ${nextPrize} EUR.

## Links

- [Website](${origin}/): next event, winstreak, videos and contact form
- [Website in Spanish](${origin}/es): the same page in Spanish
- [TikTok](${COMPANY_DATA.TIKTOK_URL})
- [Instagram](${COMPANY_DATA.INSTAGRAM_URL})
- [YouTube](${COMPANY_DATA.YOUTUBE_URL})

## Collaborations

Brand deals, sponsored 1v1s and appearances: ${COMPANY_DATA.EMAIL}
`;

	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
