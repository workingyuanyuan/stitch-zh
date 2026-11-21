// Shared by scripts/upstream.mjs and scripts/upstream-html.mjs: where the official docs
// are served from, and how the article of a rendered page is read.
//
// https://stitch.google.com/docs/ is a shell that loads the docs in a frame from the origin
// below; a plain HTTP fetch of stitch.google.com returns no content. If the frame's origin
// changes, read it from the `src` of the iframe on that page.
import { JSDOM } from 'jsdom';

export const ORIGIN = 'https://app-companion-430619.appspot.com';

/** Fetches a path on the docs origin. Returns null for a 404, throws for any other failure. */
export async function fetchText(path) {
	const res = await fetch(ORIGIN + path);
	if (res.status === 404) return null;
	if (!res.ok) throw new Error(`${path}: HTTP ${res.status}`);
	return res.text();
}

/**
 * Reads the rendered page of a docs page id (`learn/overview`). Returns its title and the
 * article element without the parts that are not content, or null when the page is gone.
 */
export async function renderedArticle(id) {
	const html = await fetchText(`/docs/${id}/index.html`);
	if (html === null) return null;
	const doc = new JSDOM(html).window.document;
	const main = doc.querySelector('main .sl-markdown-content');
	if (!main) throw new Error(`${id}: no article in the rendered page`);
	for (const el of main.querySelectorAll('.sr-only, .sl-anchor-link, .copy, script, style, svg, button')) el.remove();
	return { title: doc.querySelector('h1')?.textContent.trim() ?? '', main };
}

/**
 * The text of a rendered article with every run of whitespace as one space. This is what the
 * drift check fingerprints: it holds the import lines, the code inside tabs and the
 * `<placeholder>` text that the official Markdown twins lack, and it does not change when
 * only the markup or a class name does.
 */
export function articleText({ title, main }) {
	return `${title}\n${main.textContent.replace(/\s+/g, ' ').trim()}`;
}
