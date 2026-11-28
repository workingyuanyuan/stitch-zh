# Sources of this site

What the official docs and the published packages allow, how they are read, and where they differ. `AGENTS.md` holds the rules; `upstream/README.md` says how the sources are followed.

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

## The official look, as measured

- Look: after the official docs, by the owner's decision on 2026-11-20. Near-black `#161618` or white ground, nav `#121214` (the sidebar too on a phone), pink accent (`#ffd0ee` dark, `#c4277d` and `#fce4f0` light), title at 4.5rem in weight 500 with a small capital section label above it, a grey subtitle and a hairline before the body, section headings at 1.5rem and 1.25rem. The values were read from the official pages' computed styles; keep them in step when the official look changes.

- Motion (2026-11-25; the root rules give every site motion), taken from the official sites as measured that day: the docs have no motion that keeps going and answer the pointer in 0.15 s on `cubic-bezier(0.4, 0, 0.2, 1)`; the home page's prompt box wears a 1px ring of a conic gradient (`#9154e7`, `#6056f0`, `#40d9c6`, `#4285f4`) that turns in 12 s and breathes over 3 s, and its suggestion chips rise 8px with a fade over 0.4 s ease-out. Here: the first prompt box of a page wears that ring (no glow behind the prompt's words; stronger than the official 0.5, which has a glow to help it), the section label, title and answer rise in once, and links answer the pointer in 0.15 s. Not taken: the home page's large blurred aurora and its dot grid. Code: the last block of `src/styles/site.css`.
