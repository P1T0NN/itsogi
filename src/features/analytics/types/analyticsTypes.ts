/** Where a social link was clicked, to compare which placements bring followers. */
export type SocialLocation = 'header' | 'menu' | 'play' | 'events_empty' | 'collabs';

/**
 * Every named analytics event and its properties. Adding an event here is the only way to send
 * it, so a typo can't create a stray event in PostHog.
 */
export interface AnalyticsEvents {
	hero_cta_clicked: { cta: 'next_event' | 'see_streak' };
	event_directions_clicked: { place: string; event_date: string };
	video_platform_clicked: { video_id: string; platform: string };
	social_follow_clicked: { platform: string; location: SocialLocation };
	contact_email_clicked: Record<string, never>;
	contact_form_sent: Record<string, never>;
	contact_form_failed: { reason: 'validation' | 'captcha' | 'server' };
}
