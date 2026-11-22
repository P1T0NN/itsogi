export const COMPANY_DATA = {
	NAME: 'Ogi',
	NAME_KEY: 'ogi',
	/** Canonical site address for SEO links; `PUBLIC_ORIGIN` overrides it. */
	SITE_URL: 'https://itsogi.com',
	EMAIL: 'ogicollaborations@gmail.com',
	RESEND_EMAIL: 'no-reply@itsogi.com',
	LOGO: 'logo/opt/logo-transparent-primary-color-509w.webp' as const,
	/** Social share preview (WhatsApp, Instagram, X): 1200x630, made from the hero photo. */
	OG_IMAGE: '/og/og-image.jpg',
	OG_IMAGE_WIDTH: 1200,
	OG_IMAGE_HEIGHT: 630,

	INSTAGRAM_URL: 'https://www.instagram.com/tapuskoo/',
	TIKTOK_URL: 'https://www.tiktok.com/@tapuskoo',
	YOUTUBE_URL: 'https://www.youtube.com/@ogi1v1'
};

/**
 * Hero photo. `focus` is the CSS object-position that keeps you in frame when the photo is
 * cropped. Desktop pins the photo to the right 60% of the hero; bias low so the ball stays in.
 */
// shortcut: placeholder photo, replace with the night shoot.
export const HERO_PHOTO = {
	src: '/home/opt/home-2-1280w.webp',
	/** Optimized widths from `bun run optimize-images`; the browser picks the smallest that fits. */
	srcset:
		'/home/opt/home-2-640w.webp 640w, /home/opt/home-2-960w.webp 960w, /home/opt/home-2-1280w.webp 1280w, /home/opt/home-2-1536w.webp 1536w',
	/** Phones: full width. Desktop: the photo fills the right 60% of the hero. */
	sizes: '(min-width: 48rem) 60vw, 100vw',
	focus: '50% 85%'
};

// shortcut: video URLs are placeholders, replace with real ones.
export const FEATURED_VIDEOS = [
	{
		id: 'v1',
		millionViews: true,
		thumbnail: '/reel-thumbnails/opt/avi-thumbnail-580w.webp',
		tiktokUrl: 'https://www.tiktok.com/@tapuskoo',
		instagramUrl: 'https://www.instagram.com/tapuskoo/',
		youtubeUrl: 'https://www.youtube.com/@ogi1v1'
	},
	{
		id: 'v3',
		millionViews: false,
		thumbnail: '/reel-thumbnails/opt/jeancarlos-thumbnail-580w.webp',
		tiktokUrl: 'https://www.tiktok.com/@tapuskoo',
		instagramUrl: 'https://www.instagram.com/tapuskoo/',
		youtubeUrl: 'https://www.youtube.com/@ogi1v1'
	},
	{
		id: 'v4',
		millionViews: false,
		thumbnail: '/reel-thumbnails/opt/juju-thumbnail-580w.webp',
		tiktokUrl: 'https://www.tiktok.com/@tapuskoo',
		instagramUrl: 'https://www.instagram.com/tapuskoo/',
		youtubeUrl: 'https://www.youtube.com/@ogi1v1'
	},
	{
		id: 'v2',
		millionViews: false,
		thumbnail: '/reel-thumbnails/opt/fernando-thumbnail-580w.webp',
		tiktokUrl: 'https://www.tiktok.com/@tapuskoo',
		instagramUrl: 'https://www.instagram.com/tapuskoo/',
		youtubeUrl: 'https://www.youtube.com/@ogi1v1'
	},
	{
		id: 'v6',
		millionViews: false,
		thumbnail: '/reel-thumbnails/opt/labe1-thumbnail-578w.webp',
		tiktokUrl: 'https://www.tiktok.com/@tapuskoo',
		instagramUrl: 'https://www.instagram.com/tapuskoo/',
		youtubeUrl: 'https://www.youtube.com/@ogi1v1'
	},
	{
		id: 'v5',
		millionViews: false,
		thumbnail: '/reel-thumbnails/opt/kevin1-thumbnail-579w.webp',
		tiktokUrl: 'https://www.tiktok.com/@tapuskoo',
		instagramUrl: 'https://www.instagram.com/tapuskoo/',
		youtubeUrl: 'https://www.youtube.com/@ogi1v1'
	},
	{
		id: 'v7',
		millionViews: false,
		thumbnail: '/reel-thumbnails/opt/salim-thumbnail-580w.webp',
		tiktokUrl: 'https://www.tiktok.com/@tapuskoo',
		instagramUrl: 'https://www.instagram.com/tapuskoo/',
		youtubeUrl: 'https://www.youtube.com/@ogi1v1'
	},
	{
		id: 'v8',
		millionViews: true,
		thumbnail: '/reel-thumbnails/opt/luissanti-thumbnail-579w.webp',
		tiktokUrl: 'https://www.tiktok.com/@tapuskoo',
		instagramUrl: 'https://www.instagram.com/tapuskoo/',
		youtubeUrl: 'https://www.youtube.com/@ogi1v1'
	},
	{
		id: 'v9',
		millionViews: true,
		thumbnail: '/reel-thumbnails/opt/valentin-thumbnail-578w.webp',
		tiktokUrl: 'https://www.tiktok.com/@tapuskoo',
		instagramUrl: 'https://www.instagram.com/tapuskoo/',
		youtubeUrl: 'https://www.youtube.com/@ogi1v1'
	}
];

export type FeaturedVideo = (typeof FEATURED_VIDEOS)[number];

export const UNPROTECTED_PAGE_ENDPOINTS = {
	ROOT: '/'
};

/** Home page sections in the header and mobile menu. `label` is a message key, translated when rendered. */
export const HEADER_SECTIONS = [
	{ id: 'streak', label: 'Header.streak' },
	{ id: 'events', label: 'Header.events' },
	{ id: 'reel', label: 'Header.videos' },
	{ id: 'play', label: 'Header.play' },
	{ id: 'collabs', label: 'Header.collabs' }
] as const;
