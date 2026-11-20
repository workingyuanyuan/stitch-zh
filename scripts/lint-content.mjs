// Checks content pages without building the site. Usage: node scripts/lint-content.mjs [dir ...]
// (directories under src/content/docs/, default: all). Exit 1 when a page breaks a rule.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';
import { SECTIONS, sectionPages } from '../src/lib/site.mjs';

const ROOT = fileURLToPath(new URL('../src/content/docs/', import.meta.url));
const planned = new Set(SECTIONS.flatMap(sectionPages));
const dirs = process.argv.slice(2);
const files = (dir) =>
	readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
		e.isDirectory() ? files(join(dir, e.name)) : e.name.endsWith('.md') ? [join(dir, e.name)] : []
	);
let problems = 0;
const say = (id, message) => {
	problems++;
	console.log(`${id}: ${message}`);
};

for (const dir of dirs.length ? dirs : ['.']) {
	const full = join(ROOT, dir);
	if (!existsSync(full)) {
		say(dir, 'directory not found');
		continue;
	}
	for (const file of files(full)) {
		const id = relative(ROOT, file).replace(/\\/g, '/').replace(/\.md$/, '');
		const text = readFileSync(file, 'utf8');
		const m = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
		if (!m) {
			say(id, 'no frontmatter');
			continue;
		}
		let data;
		try {
			data = parse(m[1]);
		} catch (e) {
			say(id, `frontmatter is not valid YAML: ${e.message.split('\n')[0]}`);
			continue;
		}
		const body = m[2];
		if (id !== 'index' && !planned.has(id)) say(id, 'path is not in SECTIONS (src/lib/site.mjs)');
		for (const key of ['title', 'description', 'appliesTo', 'caveat', 'lastVerified', 'sources']) {
			if (data?.[key] === undefined || data[key] === '') say(id, `missing frontmatter field ${key}`);
		}
		for (const key of ['title', 'description', 'appliesTo', 'caveat']) {
			if (typeof data?.[key] === 'string' && data[key].includes('`')) say(id, `backtick in frontmatter field ${key}`);
		}
		if (typeof data?.description === 'string' && data.description.length > 70) say(id, `description is ${data.description.length} characters; the limit is 70`);
		if (typeof data?.caveat === 'string' && data.caveat.length > 110) say(id, `caveat is ${data.caveat.length} characters; keep it to one qualifier (110 at most)`);
		for (const s of Array.isArray(data?.sources) ? data.sources : []) {
			if (!s?.title || !/^https:\/\//.test(s?.url ?? '')) say(id, 'a source needs a title and an https url');
		}
		const fences = body.match(/^```/gm) ?? [];
		if (fences.length % 2) say(id, 'unbalanced code fences');
		if (/^```diff\b/m.test(body)) say(id, 'use a `patch` fence, not `diff`');
		const code = [...body.matchAll(/^```[^\n]*\n([\s\S]*?)^```/gm)].map((x) => x[1]);
		if (code.some((c) => /^\$ /m.test(c))) say(id, 'a command carries a `$` prompt');
		const prose = body.replace(/^```[^\n]*\n[\s\S]*?^```/gm, '').replace(/`[^`\n]*`/g, '');
		if (/^# /m.test(prose)) say(id, 'level-1 heading in the body; the title comes from the frontmatter');
		const tag = prose.match(/<\/?[A-Za-z][^>\n]*>/);
		if (tag && !/^<https?:/.test(tag[0])) say(id, `HTML or placeholder outside code: ${tag[0]}`);
		if (/!\[[^\]]*\]\(/.test(prose)) say(id, 'image in the body; pages carry no official screenshots');
		if (/^:::/m.test(prose)) say(id, '`:::` directive');
		const official = (prose.match(/官方/g) ?? []).length;
		if (official > 1) say(id, `the word 官方 appears ${official} times; state facts plainly`);
		for (const [, target] of prose.matchAll(/\]\(([^)\s]+)\)/g)) {
			if (/^https?:\/\//.test(target) || target.startsWith('#')) continue;
			const path = target.split('#')[0];
			if (!path.startsWith('/') || !path.endsWith('/')) {
				say(id, `internal link must be root-relative with a trailing slash: ${target}`);
				continue;
			}
			const page = path.replace(/^\/|\/$/g, '');
			if (page !== '' && !planned.has(page)) say(id, `link to a page that is not planned: ${target}`);
		}
		if (/信息|默認|屏幕|視頻|軟件|用戶(?!端)|文檔|調用|接口|服務器|代碼|數據庫|鏈接|設置|支持/.test(prose)) {
			say(id, `mainland wording: ${prose.match(/信息|默認|屏幕|視頻|軟件|用戶(?!端)|文檔|調用|接口|服務器|代碼|數據庫|鏈接|設置|支持/)[0]}`);
		}
	}
}
console.log(problems ? `${problems} problem(s)` : 'ok');
process.exit(problems ? 1 : 0);
