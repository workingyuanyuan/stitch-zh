// Compares the official Stitch docs with the snapshot this site was written from.
//
//   pnpm upstream            report pages that were added, removed or changed
//   pnpm upstream --write    also save the new text in cache/upstream/ and update the manifest
//
// The official docs carry no version number, so upstream/manifest.json records the SHA-256
// of each page's Markdown on the day it was read. The text itself goes to cache/upstream/,
// which is not committed: it is Google's text and has no licence for redistribution.
//
// https://stitch.google.com/docs/ is a shell that loads the docs in a frame from the origin
// below; a plain HTTP fetch of stitch.google.com returns no content. If the frame's origin
// changes, read it from the `src` of the iframe on that page.

import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ORIGIN = 'https://app-companion-430619.appspot.com';
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const MANIFEST = join(ROOT, 'upstream/manifest.json');
const CACHE = join(ROOT, 'cache/upstream');
const write = process.argv.includes('--write');

async function text(path) {
	const res = await fetch(ORIGIN + path);
	if (!res.ok) throw new Error(`${path}: HTTP ${res.status}`);
	return res.text();
}

const index = await text('/docs/llms.txt');
const paths = [...new Set([...index.matchAll(/\/docs\/[a-z0-9/-]+\.md/g)].map((m) => m[0]))].sort();
if (paths.length === 0) throw new Error('no pages listed in /docs/llms.txt');

const pages = {};
for (const path of paths) {
	const body = await text(path);
	pages[path] = { sha256: createHash('sha256').update(body).digest('hex'), characters: body.length };
	if (write) {
		const file = join(CACHE, path);
		mkdirSync(dirname(file), { recursive: true });
		writeFileSync(file, body);
	}
}

const old = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf8')).pages : {};
const added = paths.filter((p) => !old[p]);
const removed = Object.keys(old).filter((p) => !pages[p]);
const changed = paths.filter((p) => old[p] && old[p].sha256 !== pages[p].sha256);
for (const [label, list] of [['added', added], ['removed', removed], ['changed', changed]]) {
	for (const p of list) console.log(`${label}: ${p}`);
}
console.log(`${paths.length} pages upstream; ${added.length} added, ${removed.length} removed, ${changed.length} changed.`);

if (write) {
	const manifest = { origin: ORIGIN, index: '/docs/llms.txt', read: new Date().toISOString().slice(0, 10), pages };
	mkdirSync(dirname(MANIFEST), { recursive: true });
	writeFileSync(MANIFEST, JSON.stringify(manifest, null, '\t') + '\n');
	console.log('manifest and cache updated.');
} else if (added.length + removed.length + changed.length) {
	process.exitCode = 1;
}
