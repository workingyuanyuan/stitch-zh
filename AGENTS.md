# Rules for agents maintaining this site

This site is an unofficial Traditional Chinese tutorial for Google Stitch, the AI interface design tool at `stitch.google.com`. It is written from the official English documentation at `https://stitch.google.com/docs/`. The rules in `../AGENTS.md` apply; this file holds what is specific to this site.

## Decisions by the owner (2026-11-20)

- Original tutorial, not a translation. The official docs and the Stitch terms carry no licence statement, so pages are written in our own words from the facts in the official pages. Do not translate official sentences, do not reuse official prompt examples (write new ones), and do not copy the official screenshots. Short functional strings (interface names, keys, commands, flags, identifiers) are kept as they are.
- Traditional Chinese only, at the root. There is no English version: English readers have the official site.
- Scope: the home page and 46 pages, one for every official page with content: Stitch (`learn/`, 6), CLI (13), MCP (3), SDK (12), DESIGN.md (6), Agent Skills (6). `sdk/design-md` is an official page that the official sidebar does not list; it has a page here.
- The four large official reference pages (`cli/reference/commands`, `cli/reference/rest-api`, `cli/reference/mcp-tools`, `mcp/reference`) become Chinese lookup tables that link to the official page for the full fields. Keep the tools of the CLI's built-in MCP server apart from the tools of the remote MCP service: the two lists differ.
- Name and address: `stitch-zh`, `https://yuanaruru.com/stitch-zh/`. Published on 2026-11-20 after the owner confirmed. The 非官方 pill in the header stays (owner, 2026-11-20).

## Choices under "Decide per site" in `../AGENTS.md`

- Languages: one, so there is no translation step and no parity check.
- Sources: the official docs, and the published packages where a page's subject ships as one. The docs have no licence, so their text is not reused (first decision above) and copies of it are not committed.
- Pages are hand-written Markdown. The home page links every page.
- Look: the look of the official docs (see Skin rules).
- The owner confirms before a change goes live.
- The official docs have no version number and no fixed-version URL. `appliesTo` names the date the official page was read ("Stitch 網頁版（2026-11-20）") and, where a page was checked against a package, the package versions ("Stitch SDK（@google/stitch-sdk 0.3.5 與 0.4.0，2026-11-20）"). `sources` links the live official page, and `upstream/manifest.json` records fingerprints of the official pages from that date.
- How the site follows its sources (2026-11-22, as for `github-repositories`): a weekly scheduled check that keeps one issue. See "When the official docs change".

## Commands

```
pnpm verify              # build, then run the acceptance checks. Run this before you call a change done.
pnpm upstream            # compare the official docs with what the pages were written from (upstream/README.md)
pnpm upstream:html       # save the text of the official rendered pages in cache/upstream-html/, for reading
pnpm lint [dir ...]      # check content pages without building (frontmatter, links, fences, wording)
pnpm preview             # serve dist/ at http://127.0.0.1:4401/stitch-zh/ with GitHub Pages style headers
```

## The official docs as a source

- `https://stitch.google.com/docs/` is a shell that loads the docs in a frame from `https://app-companion-430619.appspot.com/docs/`. A plain HTTP fetch of `stitch.google.com` returns no content. The frame origin serves a Markdown twin of every page (`/docs/<path>.md`) and the list at `/docs/llms.txt`; `scripts/upstream.mjs` reads them.
- The `.md` links in the official `llms.txt` point at `stitch.withgoogle.com`, which redirects to the shell at `stitch.google.com`.
- On 2026-11-20 the list had 55 pages. Seven hold only "Coming soon" (`build/code`, `build/backend`, `build/deploy`, `blueprints/dashboards`, `blueprints/github-landing`, `learn/edit-theme`, `learn/prototypes`) and `design-md/format` is a redirect to `design-md/specification`. None of the eight gets a page here, nor does the official landing page `/docs/index.md`.
- The official Markdown twins are lossy. Missing from them on 2026-11-20: the import lines of code samples, some code blocks inside tabs (three in `cli/capture-and-upload`, two in `sdk/agent-workflows`), and every `<placeholder>` or generic type written outside a code fence (`Bearer <YOUR_ACCESS_TOKEN>`, `Promise<Project>`, `--id <id>`). The rendered page has them. Write a page from `cache/upstream-html/<path>.md` (`pnpm upstream:html`).
- The docs name no version of the CLI, the SDK or the DESIGN.md tools, and they differ from the published packages. Found on 2026-11-20:
  - SDK: the docs write `numVariants`, the package types declare `variantCount`; the docs say `upload()` returns a result object and never throws, both package versions declare `Promise<Screen[]>`; `uploadDesignMd` and `createDesignSystemFromDesignMd` exist in 0.4.0 (npm `next`) and not in 0.3.5 (npm `latest`); the docs import `toolDefinitions` from a subpath no version exports; the docs ask for Node.js 20, `package.json` says `>=18`.
  - DESIGN.md: the docs list 8 lint rules and 8 sections, the repository README at commit `db977b3` lists 11 rules and 10 sections, more export formats and the `designmd` alias for Windows.
  - CLI: the README of `@google/stitch` 0.13.0 has `stitch dismiss`, `--concurrency`, `--priority`, the `stitch-mcp` executable and a `--json [payload]` form that the docs lack.
- A page whose subject ships as a package is checked against the package at a fixed version (type declarations, README), and says where the docs differ, in a closing section 「和已發布套件的差異」 with the package file in `sources` (fixed-version `unpkg.com` URL, or a GitHub URL with the commit). Code samples use the names the package declares. `cache/packages/` holds the files read.
- `cache/upstream/`, `cache/upstream-html/` and `cache/packages/` hold source text for reading. They are not committed.
- The official CLI, SDK and DESIGN.md repositories (`google-labs-code/stitch-sdk`, `stitch-skills`, `design.md`) are Apache-2.0. That licence covers those repositories, not the docs site.

## When the official docs change

Run `pnpm upstream`. What it watches, what each line of its report means and how to update a page are in `upstream/README.md`; read it when an update is due.

## Content rules

- Pages live in `src/content/docs/`, at the same path as the official page (`learn/prompting` for `/docs/learn/prompting/`).
- A new page is added to `SECTIONS` in `src/lib/site.mjs` (section, group, page). The section tabs, the sidebar, `llms.txt` and the bundles follow that order, which is the order of the official tabs and sidebar. The check script fails for a page that is not listed and for a listed page that does not exist. The home page links every page; its lists are written by hand.
- `sources` links the official page the facts come from, with the title "Stitch Docs：<official page title>".
- Do not keep saying 官方 (owner, 2026-11-20: "寫法不必一直強調官方"). State the fact plainly: "一次可產生一到五個選項", not "官方文件寫的上限是…". The page notes already name the source. Where the source must be named in a sentence, write "Stitch 文件". The word 非官方 appears in the header pill, the site description (meta and `llms.txt`) and the `llms.txt` notes, never in page text, the home page caveat included.
- Names from the Stitch interface, keys and commands are written in English as inline code (`Edit Theme`). A Chinese gloss may follow in full-width parentheses on first mention. Do not invent a Chinese name for an interface label.
- Prompt examples are English prompts written for this site, in a `text` code block, followed by a Chinese sentence that says what the prompt asks for. Use Taiwan settings (a tea shop, a hiking club, a night market). Do not put bracketed labels such as `[Idea]` in a prompt: the official pages show them as labels on parts of a prompt, and prompts work without them. Explain the parts in a table of fragment and role instead.
- Frontmatter values are plain text: no backticks, because the page notes print them as written.
- Terms: design system 設計系統, variations 變化版本, prototype 原型, canvas 畫布, screen 畫面, theme 主題, prompt 提示詞, hero section 主視覺區塊, landing page 到達頁. Vibe Design stays in English with one sentence of explanation.
- A fact that the official docs mark as likely to change (model names in the design modes, the number of variations) is written with its date in the caveat or the sentence.

## Skin rules

- Look: after the official docs, by the owner's decision on 2026-11-20 ("外觀直接沿用原網頁風格設計"). Near-black `#161618` or white ground, nav and sidebar `#121214`, pink accent (`#ffd0ee` dark, `#c4277d` and `#fce4f0` light), title at 4.5rem in weight 500 with a small capital section label above it, a grey subtitle and a hairline before the body, section headings at 1.5rem and 1.25rem. The values were read from the official pages' computed styles; keep them in step when the official look changes.
- Fonts: Google Sans, Google Sans Code and Noto Sans TC from Google Fonts, all under the SIL Open Font License. Google Sans Text, Display and Mono, which the official site uses, are not openly licensed and are not loaded.
- Borrowed: layout, colours and type. Not borrowed: the Stitch wordmark, the official screenshots and illustrations. The site title is text, followed by a 非官方 pill where the official header has its "BETA" pill.
- Five Starlight components are overridden: `MarkdownContent` (hidden note, the answer as the subtitle, page notes), `SiteTitle` (name, 非官方 pill, and the header links `[M] Markdown`, `[L] llms.txt`, `[J] index.json`; the hints are CSS and the keys are shortcuts), `PageTitle` (section label and title), `Sidebar` (section tabs) and `ThemeSelect` (three buttons; the official site has a drop-down, the root rules ask for buttons).
- A `text` code block is a prompt and is drawn like the official prompt box: rounded panel, text font, and a "PROMPT" label drawn with CSS `content` (check 5 in `scripts/check-dist.mjs` has a pattern for it). Other code blocks keep the monospace font. Code blocks wrap.
- The sidebar opens with a box of section tabs and lists only the current section's pages, as the official one does: `src/routeData.ts` cuts the sidebar to the current section and the `Sidebar` override draws the tabs. The home page shows the first section.
- No motion.
- Table headings do not wrap, and on a phone the first column keeps a minimum width; without these a narrow column becomes one character wide.
- Screenshots go in `../preview/stitch-zh/`. Headless Chromium has no Chinese font here: point `FONTCONFIG_FILE` at a config that adds `/mnt/c/Windows/Fonts`. The `playwright` MCP browser cannot take that setting and shows Chinese as boxes.

## Where things are

| Path | Role |
| --- | --- |
| `src/content/docs/` | The pages |
| `src/lib/site.mjs` | Site URL and sub-path, reading order (`SECTIONS`), `llms.txt` notes, labels |
| `src/lib/page-md.mjs`, `src/lib/llms.mjs`, `src/pages/` | Markdown twins, `llms.txt`, bundles, `index.json`, `robots.txt` |
| `src/components/`, `src/styles/site.css` | The five overrides and the skin |
| `scripts/upstream.mjs`, `upstream/`, `.github/workflows/upstream.yml` | Check against the official docs and its weekly run (`upstream/README.md`) |
| `scripts/upstream-html.mjs` | Full text of the official rendered pages, for writing |
| `scripts/upstream-lib.mjs` | The docs origin and the reading of a rendered article, shared by the two scripts |
| `scripts/lint-content.mjs` | Content checks that need no build |
| `scripts/check-dist.mjs`, `scripts/preview.mjs` | Acceptance checks, local preview |
| `src/lib/sitemap.mjs` | Sitemap options: `lastmod` of each page from `lastVerified` |
| `scripts/check-found.mjs` | Checks called by `check-dist.mjs`: a title and description of its own for every page, canonical, `hreflang`, sitemap |
| `tests/agent-eval/questions.json` | The site's question list: what readers ask, each with the expected answer and qualifier. The agent test and the search test draw from it |
| `tests/agent-eval/` | Fetch tool, questions and method for the agent test |
