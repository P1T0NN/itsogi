import { paraglideVitePlugin } from '@inlang/paraglide-js';
import { enhancedImages } from '@sveltejs/enhanced-img';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitest/config';
import nodeAdapter from '@sveltejs/adapter-node';
import vercelAdapter from '@sveltejs/adapter-vercel';
import { sveltekit } from '@sveltejs/kit/vite';
import { fileURLToPath } from 'node:url';

// Vercel sets this during its build; local/VPS builds keep the standalone Node server.
const isVercel = process.env.VERCEL === '1';

export default defineConfig({
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url))
		}
	},
	plugins: [
		paraglideVitePlugin({
			project: './project.inlang',
			outdir: './src/lib/paraglide',
			emitTsDeclarations: true,
			// SEO: the URL alone decides the language. `/` is English, `/es` Spanish. No cookie and no
			// browser-language redirect, so crawlers see every version at its own stable URL.
			strategy: ['url', 'baseLocale'],
			// `/es`, never `/es/`: hreflang and canonical links must point at the final URL, not a redirect.
			trailingSlash: 'never'
		}),
		enhancedImages(),
		tailwindcss(),
		sveltekit({
			csp: {
				mode: 'auto',
				directives: {
					'default-src': ['self'],
					'script-src': ['self', 'https://challenges.cloudflare.com'],
					'script-src-attr': ['none'],
					// shortcut: UI libraries inject inline CSS; tighten when they support nonces.
					'style-src': ['self', 'unsafe-inline'],
					'img-src': ['self', 'data:'],
					'font-src': ['self'],
					'connect-src': ['self'],
					'frame-src': ['https://challenges.cloudflare.com'],
					'object-src': ['none'],
					'base-uri': ['none'],
					'form-action': ['self'],
					'frame-ancestors': ['none']
				}
			},
			// Keep test environment modules separate from the running dev server.
			outDir: process.env.VITEST === 'true' ? '.svelte-kit/test' : '.svelte-kit',
			experimental: {
				remoteFunctions: true
			},
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true,
				experimental: {
					async: true
				}
			},

			adapter: isVercel ? vercelAdapter({ runtime: 'nodejs24.x', maxDuration: 60 }) : nodeAdapter()
		})
	],
	test: {
		expect: { requireAssertions: true },
		projects: [
			{
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			}
		]
	}
});
