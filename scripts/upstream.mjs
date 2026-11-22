// Compares the official Stitch docs with what the pages of this site were written from.
// upstream/README.md says what is watched, what each line of the report means and how to
// update a page.
//
//   pnpm upstream            report. Exit 0: no difference. 1: differences. 2: the check could not be made
//   pnpm upstream --write    also save the Markdown in cache/upstream/ and record the present state
//                            in upstream/manifest.json (exit 0 whatever it reports)
//
// The official docs carry no version number, so upstream/manifest.json records two SHA-256
// fingerprints from the day the docs were read:
//
//   pages      the Markdown twin of every page in the official llms.txt.
//   rendered   the article text of the rendered page, for every page this site has
//              (SECTIONS in src/lib/site.mjs). The pages here were written from the rendered
//              text, because the twins lack import lines, some code blocks and placeholders;
//              a change in those parts shows only in this fingerprint.
//
// upstream/sources.json, kept by hand, lists the official pages that have no page here.
//
// The text itself goes to cache/, which is not committed: it is Google's text and has no
// licence for redistribution. `pnpm upstream:html` saves the rendered text for reading.

import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const MANIFEST = join(ROOT, 'upstream/manifest.json');
const SOURCES = join(ROOT, 'upstream/sources.json');
const CACHE = join(ROOT, 'cache/upstream');
const write = process.argv.includes('--write');

const fingerprint = (text) => ({ sha256: createHash('sha256').update(text).digest('hex'), characters: text.length });
const twinOf = (id) => `/docs/${id}.md`;

async function main() {
	// Imported here, so that a failure to load them is "check not made" (exit 2), not exit 1.
	const { SECTIONS, sectionPages } = await import('../src/lib/site.mjs');
	const { ORIGIN, articleText, fetchText, renderedArticle } = await import('./upstream-lib.mjs');
	const { noPage = {} } = JSON.parse(readFileSync(SOURCES, 'utf8'));
	// Without a manifest there is nothing to compare with: only --write may start one.
	if (!write && !existsSync(MANIFEST)) throw new Error('upstream/manifest.json is missing; run --write once the pages agree with the docs');
	const old = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf8')) : {};
	const oldPages = old.pages ?? {};
	const oldRendered = old.rendered ?? {};

	const index = await fetchText('/docs/llms.txt');
	if (index === null) throw new Error('/docs/llms.txt: HTTP 404');
	const paths = [...new Set([...index.matchAll(/\/docs\/[A-Za-z0-9/._-]+\.md/g)].map((m) => m[0]))].sort();
	if (paths.length === 0) throw new Error('no pages listed in /docs/llms.txt');
	const listed = new Set(paths);

	const pages = {};
	for (const path of paths) {
		const body = await fetchText(path);
		if (body === null) throw new Error(`${path}: listed in llms.txt, HTTP 404`);
		pages[path] = fingerprint(body);
		if (write) {
			const file = join(CACHE, path);
			mkdirSync(dirname(file), { recursive: true });
			writeFileSync(file, body);
		}
	}

	const ids = SECTIONS.flatMap(sectionPages).sort();
	const covered = new Set(ids.map(twinOf));
	const rendered = {};
	const gone = [];
	for (const id of ids) {
		const article = await renderedArticle(id);
		if (article === null) gone.push(id);
		else rendered[id] = fingerprint(articleText(article));
	}

	const twinChanged = (path) => oldPages[path] && pages[path] && oldPages[path].sha256 !== pages[path].sha256;
	// A page here wins over a noPage entry left behind when the page was written.
	const uncovered = (p) => p in noPage && !covered.has(p);
	const differences = [
		['rendered page changed', ids.filter((id) => rendered[id] && oldRendered[id] && oldRendered[id].sha256 !== rendered[id].sha256)],
		['rendered page gone', gone],
		['removed from the official list', ids.filter((id) => !listed.has(twinOf(id)))],
		['official page without a page here', paths.filter((p) => !covered.has(p) && !(p in noPage))],
		['page without a page here changed', paths.filter((p) => uncovered(p) && twinChanged(p))],
		['not in the manifest', [
			...ids.filter((id) => rendered[id] && !oldRendered[id]),
			...paths.filter((p) => uncovered(p) && !oldPages[p]),
		]],
	];
	const renderedSame = (id) => rendered[id] && oldRendered[id] && oldRendered[id].sha256 === rendered[id].sha256;
	const notes = [
		['note: Markdown twin changed', ids.filter((id) => twinChanged(twinOf(id)) && renderedSame(id))],
		['note: gone from the official list', [...new Set([...Object.keys(noPage), ...Object.keys(oldPages)])]
			.filter((p) => !listed.has(p) && !covered.has(p)).sort()],
		['note: noPage entry has a page here', Object.keys(noPage).filter((p) => covered.has(p)).sort()],
	];

	let count = 0;
	let noteCount = 0;
	for (const [label, list] of differences) for (const item of list) { console.log(`${label}: ${item}`); count++; }
	for (const [label, list] of notes) for (const item of list) { console.log(`${label}: ${item}`); noteCount++; }
	console.log(`${paths.length} pages in the official llms.txt, ${Object.keys(rendered).length} of ${ids.length} rendered pages read; ${count} differences, ${noteCount} notes.`);

	if (write) {
		const manifest = { origin: ORIGIN, index: '/docs/llms.txt', read: new Date().toISOString().slice(0, 10), pages, rendered };
		mkdirSync(dirname(MANIFEST), { recursive: true });
		writeFileSync(MANIFEST, JSON.stringify(manifest, null, '\t') + '\n');
		console.log('manifest and cache updated.');
		return 0;
	}
	return count ? 1 : 0;
}

try {
	process.exitCode = await main();
} catch (error) {
	console.error(`check not made: ${error.message}`);
	process.exitCode = 2;
}
