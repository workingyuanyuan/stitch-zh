// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import sitemap from '@astrojs/sitemap';
import starlightLinksValidator from 'starlight-links-validator';
import { sitemapOptions } from './src/lib/sitemap.mjs';
import { ORIGIN, BASE, TITLE, DESCRIPTION, SECTIONS } from './src/lib/site.mjs';
import { satteri } from '@astrojs/markdown-satteri';
import { hastBase, hastFootnotes } from './src/lib/hast-base.mjs';

export default defineConfig({
	site: ORIGIN,
	base: BASE || undefined,
	trailingSlash: 'always',
	// Content links are written without the sub-path; this adds it in the HTML.
	// No typographic substitution: names such as `Do's and Don'ts` and flags written in
	// prose must reach the page as typed.
	markdown: { smartypants: false, processor: satteri({ hastPlugins: [hastBase, hastFootnotes] }) },
	integrations: [
		// Added here so that it takes options; Starlight then leaves its own copy out.
		sitemap(sitemapOptions()),
		starlight({
			title: TITLE['zh-TW'],
			description: DESCRIPTION,
			defaultLocale: 'root',
			locales: { root: { label: '繁體中文', lang: 'zh-TW' } },
			// The reading order lives in SECTIONS (src/lib/site.mjs).
			// One sidebar group per group of a section. The route middleware keeps only the
			// groups of the current page's section, and the Sidebar override adds the section tabs.
			sidebar: SECTIONS.flatMap((s) => s.groups.map((g) => ({ label: g.label, items: g.pages.map((slug) => ({ slug })) }))),
			customCss: ['./src/styles/site.css'],
			// Google Sans, Google Sans Code and Noto Sans TC are all under the SIL Open Font License.
			head: [
				{ tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.googleapis.com' } },
				{ tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true } },
				{
					tag: 'link',
					attrs: {
						rel: 'stylesheet',
						href: 'https://fonts.googleapis.com/css2?family=Google+Sans:opsz,wght@17..18,400..700&family=Google+Sans+Code:wght@400..600&family=Noto+Sans+TC:wght@400..700&display=swap',
					},
				},
			],
			components: {
				// Five overrides. MarkdownContent: the subtitle above the body, the page notes
				// after it. SiteTitle and PageTitle: the title area of the official docs.
				// Sidebar: the section tabs above the page list.
				// ThemeSelect: one-click theme buttons.
				MarkdownContent: './src/components/MarkdownContent.astro',
				SiteTitle: './src/components/SiteTitle.astro',
				Sidebar: './src/components/Sidebar.astro',
				PageTitle: './src/components/PageTitle.astro',
				ThemeSelect: './src/components/ThemeSelect.astro',
			},
			routeMiddleware: './src/routeData.ts',
			credits: false,
			plugins: [
				starlightLinksValidator({
					exclude: ['/**/*.md', '/*.md', '/llms.txt', '/**/llms.txt', '/index.json'],
				}),
			],
		}),
	],
});
