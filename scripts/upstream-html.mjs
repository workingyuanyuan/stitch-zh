// Saves the text of the official rendered pages in cache/upstream-html/<path>.md.
//
//   node scripts/upstream-html.mjs
//
// The official Markdown twins (cache/upstream/, written by scripts/upstream.mjs) are lossy:
// import lines, some code blocks inside tabs and every `<placeholder>` outside a code
// fence are missing from them. The rendered page has them. Read both when writing a page;
// where they differ, the rendered page is right.
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';
import TurndownService from 'turndown';
import { SECTIONS, sectionPages } from '../src/lib/site.mjs';

const ORIGIN = 'https://app-companion-430619.appspot.com';
const OUT = fileURLToPath(new URL('../cache/upstream-html/', import.meta.url));
const turndown = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' });
turndown.addRule('code-block', {
	filter: (node) => node.nodeName === 'PRE',
	replacement: (_content, node) => {
		const lines = [...node.querySelectorAll('.ec-line')];
		const text = lines.length ? lines.map((l) => l.textContent).join('\n') : node.textContent;
		return `\n\n\`\`\`${node.getAttribute('data-language') ?? ''}\n${text.replace(/\n+$/, '')}\n\`\`\`\n\n`;
	},
});
turndown.addRule('table-cell', {
	filter: ['th', 'td'],
	replacement: (content) => ` ${content.replace(/\s*\n\s*/g, ' ').replace(/\|/g, '\\|').trim()} |`,
});
turndown.addRule('table-row', {
	filter: 'tr',
	replacement: (content, node) => {
		const head = node.parentNode.nodeName === 'THEAD' ? `\n|${' --- |'.repeat(node.children.length)}` : '';
		return `\n|${content}${head}`;
	},
});
turndown.remove(['script', 'style', 'svg', 'button']);

for (const id of SECTIONS.flatMap(sectionPages)) {
	const res = await fetch(`${ORIGIN}/docs/${id}/index.html`);
	if (!res.ok) throw new Error(`${id}: HTTP ${res.status}`);
	const doc = new JSDOM(await res.text()).window.document;
	const title = doc.querySelector('h1')?.textContent.trim() ?? '';
	const main = doc.querySelector('main .sl-markdown-content');
	for (const el of main.querySelectorAll('.sr-only, .sl-anchor-link, .copy')) el.remove();
	const file = join(OUT, id + '.md');
	mkdirSync(dirname(file), { recursive: true });
	writeFileSync(file, `# ${title}\n\n${turndown.turndown(main.innerHTML)}\n`);
}
console.log('saved to cache/upstream-html/');
