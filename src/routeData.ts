import { defineRouteMiddleware } from '@astrojs/starlight/route-data';
import { SITE, SECTIONS, sectionOf, pageId, localeOf, htmlPath, mdPath, isoDate } from './lib/site.mjs';

/**
 * Cuts the sidebar down to the current section, and adds the Markdown alternate link and
 * JSON-LD to every page's <head>.
 */
export const onRequest = defineRouteMiddleware((context) => {
	const route = context.locals.starlightRoute;
	const { data } = route.entry;
	const id = pageId(route.entry.id);

	// The configured sidebar has one group per group of every section, in the order of
	// SECTIONS. The home page and the 404 page show the first section.
	const section = sectionOf(id) ?? SECTIONS[0];
	const first = SECTIONS.slice(0, SECTIONS.indexOf(section)).reduce((n, s) => n + s.groups.length, 0);
	route.sidebar = route.sidebar.slice(first, first + section.groups.length);
	// Starlight's built-in 404 page has no contract fields and no Markdown twin.
	if (!data.lastVerified || !data.sources) return;

	route.head.push({
		tag: 'link',
		attrs: { rel: 'alternate', type: 'text/markdown', href: SITE + mdPath(id) },
		content: '',
	});

	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: data.title,
		description: data.description,
		inLanguage: localeOf(id).lang,
		url: SITE + htmlPath(id),
		dateModified: isoDate(data.lastVerified),
		citation: data.sources.map((s: { url: string }) => s.url),
		encoding: { '@type': 'MediaObject', encodingFormat: 'text/markdown', contentUrl: SITE + mdPath(id) },
	};
	route.head.push({
		tag: 'script',
		attrs: { type: 'application/ld+json' },
		content: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
	});
});
