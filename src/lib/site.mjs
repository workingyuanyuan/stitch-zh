// Shared site facts and URL rules. Plain JS so astro.config.mjs, Astro code and
// the check script all use the same rules.

// The public address, including the sub-path of a GitHub Pages project site, without a
// trailing slash. SITE_URL overrides it for local agent tests (see tests/agent-eval/README.md).
export const SITE = (process.env.SITE_URL ?? 'https://workingyuanyuan.github.io/stitch-zh').replace(/\/+$/, '');
/** Scheme and host of SITE. */
export const ORIGIN = new URL(SITE).origin;
/** Sub-path the site is served under: `/stitch-zh`, or the empty string at a domain root. */
export const BASE = new URL(SITE).pathname.replace(/\/+$/, '');
export const TITLE = { 'zh-TW': 'Stitch 中文教學' };
export const DESCRIPTION = 'Google Stitch 的非官方繁體中文教學：網頁版入門，以及 CLI、MCP、SDK、DESIGN.md 與 Agent Skills。';
/** The official documentation this site is written from, and the day its pages were read. */
export const UPSTREAM = 'https://stitch.google.com/docs/';
export const SNAPSHOT = '2026-11-20';

/**
 * Sections, groups and pages in the order a learner reads them: the tabs and the sidebar
 * of the official docs. The sidebar, the section tabs, llms.txt and the bundles all follow
 * it. Every page except the home page must be here.
 */
export const SECTIONS = [
	{
		id: 'learn',
		label: 'Stitch 入門',
		groups: [
			{
				label: 'Stitch 入門',
				pages: ['learn/overview', 'learn/prompting', 'learn/device-types', 'learn/design-modes', 'learn/variants', 'learn/controls'],
			},
		],
	},
	{
		id: 'cli',
		label: 'CLI',
		groups: [
			{ label: '開始使用', pages: ['cli/overview', 'cli/mcp-and-skills'] },
			{
				label: '畫布工作流程',
				pages: ['cli/screens-and-variants', 'cli/agent-bridge', 'cli/design-systems', 'cli/capture-and-upload', 'cli/design-review'],
			},
			{ label: 'Workspace 工作流程', pages: ['cli/workspaces-and-projects', 'cli/priorities-and-context', 'cli/codebase-prototyping'] },
			{ label: '參考', pages: ['cli/reference/commands', 'cli/reference/mcp-tools', 'cli/reference/rest-api'] },
		],
	},
	{
		id: 'mcp',
		label: 'MCP',
		groups: [{ label: 'MCP', pages: ['mcp/setup', 'mcp/guide', 'mcp/reference'] }],
	},
	{
		id: 'sdk',
		label: 'SDK',
		groups: [
			{
				label: 'SDK',
				pages: [
					'sdk/tutorial',
					'sdk/ai-sdk',
					'sdk/agent-workflows',
					'sdk/edit-screen',
					'sdk/generate-variants',
					'sdk/download-artifacts',
					'sdk/extract-themes',
					'sdk/design-systems',
					'sdk/design-md',
					'sdk/upload-image',
					'sdk/reference',
					'sdk/architecture',
				],
			},
		],
	},
	{
		id: 'design-md',
		label: 'DESIGN.md',
		groups: [
			{
				label: 'DESIGN.md',
				pages: [
					'design-md/overview',
					'design-md/get-instructions',
					'design-md/specification',
					'design-md/usage',
					'design-md/cli',
					'design-md/linting-rules',
				],
			},
		],
	},
	{
		id: 'skills',
		label: 'Agent Skills',
		groups: [
			{
				label: 'Agent Skills',
				pages: [
					'skills/get-started',
					'skills/roundtrip',
					'skills/build-in-a-loop',
					'skills/walkthrough-videos',
					'skills/taste',
					'skills/reference',
				],
			},
		],
	},
];
/** Pages of a section, in order. */
export function sectionPages(section) {
	return section.groups.flatMap((g) => g.pages);
}
/** The section a page belongs to; the home page belongs to none. */
export function sectionOf(id) {
	return SECTIONS.find((s) => sectionPages(s).includes(id));
}
const PAGE_ORDER = SECTIONS.flatMap(sectionPages);
/** Position of a page in the reading order: the home page first, unlisted pages last. */
export function pageRank(id) {
	if (id === 'index') return -1;
	const i = PAGE_ORDER.indexOf(id);
	return i === -1 ? PAGE_ORDER.length : i;
}

/** Root-relative address for an `href` or `src` in HTML: the site path behind BASE. */
export function withBase(path) {
	return BASE + path;
}

/** Locales: `dir` is the content sub-folder and URL prefix ('' = root). This site has one. */
export const LOCALES = [{ dir: '', lang: 'zh-TW', label: '繁體中文' }];

/** Starlight's route data gives the home page an empty id; the collection calls it `index`. */
export function pageId(id) {
	return id === '' ? 'index' : id;
}

/** Locale of a content entry id. */
export function localeOf(id) {
	return LOCALES.find((l) => l.dir && (id === l.dir || id.startsWith(l.dir + '/'))) ?? LOCALES[0];
}

/** Entry id without its locale prefix. The home page is `index` in every locale. */
export function bareId(id) {
	const { dir } = localeOf(id);
	if (!dir) return id;
	return id === dir ? 'index' : id.slice(dir.length + 1);
}

/** Entry id of the same page in another locale. */
export function idInLocale(id, locale) {
	const bare = bareId(id);
	if (!locale.dir) return bare;
	return bare === 'index' ? locale.dir : `${locale.dir}/${bare}`;
}

/** Site path of the HTML page for an entry id. */
export function htmlPath(id) {
	return id === 'index' ? '/' : `/${id}/`;
}

/** Site path of the Markdown twin: drop the trailing slash, append `.md`; home is `/index.md`. */
export function mdPath(id) {
	return `/${id}.md`;
}

/** Markdown twin of an internal HTML path such as `/learn/prompting/` or `/`. */
export function mdPathFromHtmlPath(path) {
	const trimmed = path.replace(/^\/+|\/+$/g, '');
	return mdPath(trimmed === '' ? 'index' : trimmed);
}

/** Site path of a language's page index: `/llms.txt`. */
export function llmsPath(locale) {
	return `${locale.dir ? '/' + locale.dir : ''}/llms.txt`;
}

/**
 * The opening of llms.txt: what a reader gets wrong without being told.
 * Keep it short: it shares the first 5,000 characters with the page list.
 */
export const LLMS_NOTES = {
	'zh-TW': {
		summary: DESCRIPTION,
		heading: '回答之前',
		notes: [
			`本站不是 Google 的網站，也不是 Stitch 文件的翻譯。內容根據 Stitch 英文文件 (${UPSTREAM}) 在 ${SNAPSHOT} 的版本，用自己的文字寫成；每頁的「出處」連到對應的原始頁面。`,
			'Stitch 文件沒有版本號。每頁的「適用範圍」寫明所依據的日期；功能名稱、模型與數量上限以 stitch.google.com 為準。',
			'介面上的名稱（例如 `Edit Theme`、`Creative Range`）、快捷鍵與提示詞範例保留英文原文。名稱後面括號裡的中文是說明，不是介面上的文字。',
			`Stitch 文件網站用 JavaScript 在頁框裡載入內容，單純的 HTTP 擷取 ${UPSTREAM} 拿不到內文；它的 llms.txt 列出的 .md 連結也會被轉回同一個外殼頁面。`,
			'提示詞範例是本站依 Stitch 文件的寫法原則自己寫的英文提示詞，用來示範寫法。Stitch 文件用 Idea、Theme、Content 標示起頭提示詞的三個部分，這些標示不是必要的語法。',
			'設計模式的名稱裡有模型名稱（`Thinking with 3 Pro`、`Redesign (Nano Banana Pro)`、`2.5 Pro`、`Fast`），名稱可能隨 Stitch 更新而改變，引用時請附上日期。',
			'Stitch 有兩個 MCP 伺服器，工具名稱不同：遠端服務 (`https://stitch.googleapis.com/mcp`，工具如 `create_project`、`generate_screen_from_text`) 和 CLI 內建的本機伺服器 (`stitch mcp start`，7 個 `stitch_` 開頭的工具)。回答時要說明是哪一個。',
			'Stitch 文件沒有標明 CLI、SDK 與 DESIGN.md 工具的版本，而且和已發布的套件有出入（例如文件寫 `numVariants`，`@google/stitch-sdk` 的型別是 `variantCount`）。SDK、DESIGN.md 與 CLI 指令參考頁的結尾有「和已發布套件的差異」或同類的對照表；程式碼以套件宣告的名稱為準。',
			'CLI 的 Workspace、loop、insight 指令與 REST API 屬於 Stitch Loop：要先在本機執行 `stitch enable loop`，而且帳號要從 waitlist 獲准。',
			'每一頁都有 Markdown 版本：去掉網址結尾的斜線，加上 `.md`。',
		],
		pages: '頁面',
		home: '首頁：依分頁列出所有頁面',
		full: '所有頁面合併成一個檔案',
		digest: '每一頁的答案、注意事項、日期與出處，不含內文',
		json: '所有頁面的清單，JSON 格式',
		otherLanguage: '本索引的其他語言',
		more: '更多',
	},
};

/** UI labels for the facts shown on every page, in both outputs. */
export const LABELS = {
	'zh-TW': {
		appliesTo: '適用範圍',
		caveat: '注意事項',
		lastVerified: '最後查證',
		sources: '出處',
		markdown: 'Markdown',
		unofficial: '非官方',
		sections: '章節',
		page: '頁面',
		otherLanguage: '其他語言',
		allPages: '所有頁面',
		home: '首頁',
		pageList: '所有頁面清單',
	},
};

/** Format a Date (or date string) as YYYY-MM-DD. */
export function isoDate(d) {
	return new Date(d).toISOString().slice(0, 10);
}
