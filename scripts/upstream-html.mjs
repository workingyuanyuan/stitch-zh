// Saves the text of the official rendered pages in cache/upstream-html/<path>.md.
//
//   node scripts/upstream-html.mjs
//
// The official Markdown twins (cache/upstream/, written by scripts/upstream.mjs) are lossy:
// import lines, some code blocks inside tabs and every `<placeholder>` outside a code
// fence are missing from them. The rendered page has them. Write a page from this text.
// scripts/upstream.mjs fingerprints the same rendered articles for the drift check.
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import TurndownService from 'turndown';
import { SECTIONS, sectionPages } from '../src/lib/site.mjs';
import { renderedArticle } from './upstream-lib.mjs';

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
	const article = await renderedArticle(id);
	if (article === null) throw new Error(`${id}: HTTP 404`);
	const file = join(OUT, id + '.md');
	mkdirSync(dirname(file), { recursive: true });
	writeFileSync(file, `# ${article.title}\n\n${turndown.turndown(article.main.innerHTML)}\n`);
}
console.log('saved to cache/upstream-html/');
