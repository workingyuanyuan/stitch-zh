// Shared by scripts/upstream.mjs and scripts/upstream-html.mjs: where the official docs
// are served from, and how the article of a rendered page is read.
//
// https://stitch.google.com/docs/ is a shell that loads the docs in a frame from the origin
// below; a plain HTTP fetch of stitch.google.com returns no content. If the frame's origin
// changes, read it from the `src` of the iframe on that page.
import { JSDOM } from 'jsdom';

export const ORIGIN = 'https://app-companion-430619.appspot.com';

/**
 * Fetches a path on the docs origin. Returns null for a 404, throws for any other failure.
 * A network error, a timeout or a 5xx is tried once more after a pause.
 */
export async function fetchText(path, tries = 2) {
	let res;
	let body;
	try {
		res = await fetch(ORIGIN + path, { signal: AbortSignal.timeout(30_000) });
		if (res.ok) body = await res.text();
	} catch (error) {
		if (tries > 1) return retry(path, tries);
		throw new Error(`${path}: ${error.cause?.code ?? error.name}`);
	}
	if (res.status === 404) return null;
	if (res.status >= 500 && tries > 1) return retry(path, tries);
	if (!res.ok) throw new Error(`${path}: HTTP ${res.status}`);
	return body;
}

async function retry(path, tries) {
	await new Promise((resolve) => setTimeout(resolve, 5_000));
	return fetchText(path, tries - 1);
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
 * only the markup or a class name does. The link targets follow the text (not links within
 * the page), because a page here may give a URL that the official page shows only as the
 * target of a link.
 */
export function articleText({ title, main }) {
	const links = [...main.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')).filter((href) => !href.startsWith('#'));
	return `${title}\n${main.textContent.replace(/\s+/g, ' ').trim()}\n${links.join('\n')}`;
}
