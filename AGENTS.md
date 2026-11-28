# Rules for agents maintaining this site

This site is an unofficial Traditional Chinese tutorial for Google Stitch, the AI interface design tool at `stitch.google.com`. It is written from the official English documentation at `https://stitch.google.com/docs/`. The rules in `../AGENTS.md` apply; this file holds what is specific to this site.

Read before the work: `SOURCES.md` before reading the official docs or writing from them (how they are served and read, what their Markdown twins lack, where they differ from the published packages); `upstream/README.md` when `pnpm upstream` reports a difference. The question list and test results are in `tests/agent-eval/`.

## Decisions by the owner (2026-11-20)

- Original tutorial, not a translation. The official docs and the Stitch terms carry no licence statement, so pages are written in our own words from the facts in the official pages. Do not translate official sentences, do not reuse official prompt examples (write new ones), and do not copy the official screenshots. Short functional strings (interface names, keys, commands, flags, identifiers) are kept as they are.
- Traditional Chinese only, at the root. There is no English version: English readers have the official site.
- Scope: the home page and 46 pages, one for every official page with content: Stitch (`learn/`, 6), CLI (13), MCP (3), SDK (12), DESIGN.md (6), Agent Skills (6). `sdk/design-md` is an official page that the official sidebar does not list; it has a page here.
- The four large official reference pages (`cli/reference/commands`, `cli/reference/rest-api`, `cli/reference/mcp-tools`, `mcp/reference`) become Chinese lookup tables that link to the official page for the full fields. Keep the tools of the CLI's built-in MCP server apart from the tools of the remote MCP service: the two lists differ.
- Name and address: `stitch-zh`, `https://yuanaruru.com/stitch-zh/`.

## Choices under "Decide per site" in `../START.md`

- Languages: one, so there is no translation step and no parity check.
- Sources: the official docs, and the published packages where a page's subject ships as one. The docs have no licence, so their text is not reused (first decision above) and copies of it are not committed.
- Pages are hand-written Markdown. The home page links every page.
- Look: the look of the official docs (see Skin rules).
- The owner confirms before a change goes live.
- The official docs have no version number and no fixed-version URL. `appliesTo` names the date the official page was read ("Stitch 網頁版（2026-11-20）") and, where a page was checked against a package, the package versions ("Stitch SDK（@google/stitch-sdk 0.3.5 與 0.4.0，2026-11-20）"). `sources` links the live official page, and `upstream/manifest.json` records fingerprints of the official pages from that date.
- How the site follows its sources (2026-11-22): `pnpm upstream`, also run weekly in a workflow that keeps one issue.

## Commands

```
pnpm verify              # build, then run the acceptance checks. Run this before you call a change done.
pnpm upstream            # compare the official docs with what the pages were written from (upstream/README.md)
pnpm upstream:html       # save the text of the official rendered pages in cache/upstream-html/, for reading
pnpm lint [dir ...]      # check content pages without building (frontmatter, links, fences, wording)
node scripts/prose-review.mjs run      # after a build: a reader of another model reads the prose units not yet in the ledger
node scripts/prose-review.mjs status   # after a build: count the prose units the ledger lacks (pnpm verify fails on any)
pnpm preview             # serve dist/ at http://127.0.0.1:4401/stitch-zh/ with GitHub Pages style headers
```

## Reading the sources

- A plain HTTP fetch of `stitch.google.com/docs/` returns no content. Write a page from the rendered text in `cache/upstream-html/<path>.md` (`pnpm upstream:html`), not from the official Markdown twins, which lose import lines, code blocks inside tabs and `<placeholder>` text.
- A page whose subject ships as a package is checked against the package at a fixed version (type declarations, README), and says where the docs differ in a closing section 「和已發布套件的差異」, with the package file in `sources` (a fixed-version `unpkg.com` URL, or a GitHub URL with the commit). Code samples use the names the package declares.
- Official pages that hold only "Coming soon", redirects and the landing page get no page here.
- `cache/` holds source text for reading and is not committed.

## Content rules

- Pages live in `src/content/docs/`, at the same path as the official page (`learn/prompting` for `/docs/learn/prompting/`).
- A new page is added to `SECTIONS` in `src/lib/site.mjs` (section, group, page). The section tabs, the sidebar, `llms.txt` and the bundles follow that order, which is the order of the official tabs and sidebar. The check script fails for a page that is not listed and for a listed page that does not exist. The home page links every page; its lists are written by hand.
- `sources` links the official page the facts come from, with the title "Stitch Docs：<official page title>".
- Do not keep saying 官方 (owner decision, 2026-11-20). State the fact plainly: "一次可產生一到五個選項", not "官方文件寫的上限是…". The page notes already name the source. Where the source must be named in a sentence, write "Stitch 文件". The word 非官方 appears in the header pill, the site description (meta and `llms.txt`) and the `llms.txt` notes, never in page text, the home page caveat included.
- Names from the Stitch interface, keys and commands are written in English as inline code (`Edit Theme`). A Chinese gloss may follow in full-width parentheses on first mention. Do not invent a Chinese name for an interface label.
- Prompt examples are English prompts written for this site, in a `text` code block, followed by a Chinese sentence that says what the prompt asks for. Use Taiwan settings (a tea shop, a hiking club, a night market). Do not put bracketed labels such as `[Idea]` in a prompt: the official pages show them as labels on parts of a prompt, and prompts work without them. Explain the parts in a table of fragment and role instead.
- Terms: design system 設計系統, variations 變化版本, prototype 原型, canvas 畫布, screen 畫面, theme 主題, prompt 提示詞, hero section 主視覺區塊, landing page 到達頁. Vibe Design stays in English with one sentence of explanation.
- A fact that the official docs mark as likely to change (model names in the design modes, the number of variations) is written with its date in the caveat or the sentence.

## Skin rules

- Look: after the official docs (owner, 2026-11-20): near-black or white ground, pink accent, a large title with a small capital section label above it, a grey subtitle and a hairline before the body. The values in `src/styles/site.css` were read from the official pages' computed styles (`SOURCES.md`); keep them in step when the official look changes.
- Fonts: Google Sans, Google Sans Code and Noto Sans TC from Google Fonts, all under the SIL Open Font License. Google Sans Text, Display and Mono, which the official site uses, are not openly licensed and are not loaded.
- Borrowed: layout, colours and type. Not borrowed: the Stitch wordmark, the official screenshots and illustrations. The site title is a disc in the aurora colours of the official home page's prompt ring, then text, followed by a 非官方 pill where the official header has its "BETA" pill.
- The frame the root rules set for every site wins over the official layout where they differ (2026-11-25): a text column of 50rem (60rem from 110rem) and Starlight's sidebar width in place of the official 45rem and 15.625rem, no line beside the sidebar, the sidebar on the page's ground from 50rem, and search at the top of the sidebar.
- Five Starlight components are overridden: `MarkdownContent` (hidden note, the answer as the subtitle, page notes), `SiteTitle` (name, the 非官方 pill, which stays (owner, 2026-11-20), and a link to the first page of each section in the order and with the labels of the section tabs (owner, 2026-11-22)), `PageTitle` (section label and title), `Sidebar` (section tabs) and `ThemeSelect`.
- A `text` code block is a prompt and is drawn like the official prompt box: rounded panel, text font, and a "PROMPT" label drawn with CSS `content` (check 5 in `scripts/check-dist.mjs` has a pattern for it). Other code blocks keep the monospace font. Code blocks wrap.
- The sidebar opens with a box of section tabs and lists only the current section's pages, as the official one does: `src/routeData.ts` cuts the sidebar to the current section and the `Sidebar` override draws the tabs. The home page shows the first section.
- Motion (2026-11-25), taken from the official sites: the first prompt box of a page wears the turning ring of the official home page's prompt box, with no glow behind the prompt's words; the section label, title and answer rise in once; links answer the pointer in 0.15 s. Not taken: the home page's large blurred aurora and its dot grid. Code and measured values: the last block of `src/styles/site.css`.
- Table headings do not wrap, and on a phone the first column keeps a minimum width; without these a narrow column becomes one character wide.
- Screenshots go in `../preview/stitch-zh/`.

## Where things are

| Path | Role |
| --- | --- |
| `src/lib/site.mjs` | Site URL and sub-path, reading order (`SECTIONS`), `llms.txt` notes, labels |
| `src/routeData.ts`, `src/components/Sidebar.astro` | The sidebar cut to the current section, and its section tabs |
| `scripts/upstream.mjs`, `scripts/upstream-html.mjs`, `scripts/upstream-lib.mjs` | The check against the official docs; the full text of the rendered pages, for writing; what the two share |
| `scripts/lint-content.mjs` | Content checks that need no build (`pnpm lint`) |
| `upstream/sources.json` | Official pages without a page here (`noPage`), kept by hand |
