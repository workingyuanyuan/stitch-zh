// Compares the official Stitch docs with the snapshot this site was written from.
//
//   pnpm upstream            report pages that were added, removed or changed
//   pnpm upstream --write    also save the Markdown in cache/upstream/ and update the manifest
//
// The official docs carry no version number, so upstream/manifest.json records two SHA-256
// fingerprints from the day the docs were read:
//
//   pages      the Markdown twin of every page in the official llms.txt. This finds pages
//              that were added or removed, and pages that this site has no page for.
//   rendered   the article text of the rendered page, for every page this site has
//              (SECTIONS in src/lib/site.mjs). The pages here were written from the rendered
//              text, because the twins lack import lines, some code blocks and placeholders;
//              a change in those parts shows only in this fingerprint.
//
// The text itself goes to cache/, which is not committed: it is Google's text and has no
// licence for redistribution. `pnpm upstream:html` saves the rendered text for reading.

import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SECTIONS, sectionPages } from '../src/lib/site.mjs';
import { ORIGIN, articleText, fetchText, renderedArticle } from './upstream-lib.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const MANIFEST = join(ROOT, 'upstream/manifest.json');
const CACHE = join(ROOT, 'cache/upstream');
const write = process.argv.includes('--write');

const fingerprint = (text) => ({ sha256: createHash('sha256').update(text).digest('hex'), characters: text.length });

const index = await fetchText('/docs/llms.txt');
if (index === null) throw new Error('/docs/llms.txt: HTTP 404');
const paths = [...new Set([...index.matchAll(/\/docs\/[a-z0-9/-]+\.md/g)].map((m) => m[0]))].sort();
if (paths.length === 0) throw new Error('no pages listed in /docs/llms.txt');

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
const rendered = {};
const gone = [];
for (const id of ids) {
	const article = await renderedArticle(id);
	if (article === null) gone.push(id);
	else rendered[id] = fingerprint(articleText(article));
}

const old = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf8')) : {};
const oldPages = old.pages ?? {};
const oldRendered = old.rendered ?? {};
const report = [
	['added', paths.filter((p) => !oldPages[p])],
	['removed', Object.keys(oldPages).filter((p) => !pages[p])],
	['changed (Markdown)', paths.filter((p) => oldPages[p] && oldPages[p].sha256 !== pages[p].sha256)],
	['changed (rendered)', ids.filter((id) => rendered[id] && oldRendered[id] && oldRendered[id].sha256 !== rendered[id].sha256)],
	['gone (rendered)', gone],
	['not in the manifest (rendered)', ids.filter((id) => rendered[id] && !oldRendered[id])],
];
let differences = 0;
for (const [label, list] of report) {
	for (const item of list) console.log(`${label}: ${item}`);
	differences += list.length;
}
console.log(`${paths.length} pages in the official llms.txt, ${ids.length} rendered pages read; ${differences} differences.`);

if (write) {
	const manifest = { origin: ORIGIN, index: '/docs/llms.txt', read: new Date().toISOString().slice(0, 10), pages, rendered };
	mkdirSync(dirname(MANIFEST), { recursive: true });
	writeFileSync(MANIFEST, JSON.stringify(manifest, null, '\t') + '\n');
	console.log('manifest and cache updated.');
} else if (differences) {
	process.exitCode = 1;
}
