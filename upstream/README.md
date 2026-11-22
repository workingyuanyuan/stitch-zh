# Following the sources of this site

The pages are written from the official Stitch docs at `https://stitch.google.com/docs/`, which are served from `https://app-companion-430619.appspot.com/docs/` (see `scripts/upstream-lib.mjs`). The docs have no version number and no fixed-version URL, and they change. `pnpm upstream` compares them with what the pages were written from.

```
pnpm upstream            # report. Exit 0: no difference. 1: differences. 2: the check could not be made
pnpm upstream --write    # also save the official Markdown in cache/upstream/ and record the present state in upstream/manifest.json
pnpm upstream:html       # save the text of the official rendered pages in cache/upstream-html/, for reading
```

It needs no token and changes no page. `cache/` holds Google's text for reading and is not committed.

## What is watched, and where the record is

| Watched | Compared with | Kept in |
| --- | --- | --- |
| The article text of the rendered official page, whitespace folded, and the targets of its links, for every page this site has (`SECTIONS` in `src/lib/site.mjs`) | A SHA-256 from the day the page was read | `manifest.json` (`rendered`), written by the script |
| The Markdown twin of every page in the official `llms.txt` | A SHA-256 from the same day | `manifest.json` (`pages`), written by the script |
| The list of pages in the official `llms.txt` | The pages this site has and `noPage` | `SECTIONS` and `sources.json` |

The pages were written from the rendered text because the twins lack import lines, some code blocks inside tabs and every `<placeholder>` outside a code fence. A change in those parts shows only in the rendered fingerprint, so that one decides whether a page of this site is out of date; the twins find official pages that were added, removed or filled in.

The date a page was read is in its `appliesTo` and `lastVerified`. Package versions in `appliesTo` (`@google/stitch-sdk 0.3.5 與 0.4.0`) are not watched by this command.

`sources.json` is the only file kept by hand: `noPage` lists the official pages that have no page here on purpose, each with the reason.

## The report

One line for each difference, then the notes, then a count. A line reads `kind: page`, with the page id of this site (`learn/prompting`) or the official twin path (`/docs/build/code.md`).

| Line | Meaning | What to do |
| --- | --- | --- |
| `rendered page changed` | The article text of the official page differs from the day the page was read | Update the page (below) |
| `rendered page gone` | The official page of a page here answers 404 | Find where it went (`llms.txt`, the official sidebar). Ask the owner whether to move or remove the page; a removed page also leaves `SECTIONS` and the home page |
| `removed from the official list` | A page here has no twin in the official `llms.txt`, though its rendered page may still answer | Read the official sidebar: the page may be moved or on its way out. Same as above |
| `official page without a page here` | The official `llms.txt` lists a page that has neither a page here nor a `noPage` entry | The owner decides: write the page (scope in `AGENTS.md`: one for every official page with content) and add it to `SECTIONS` and the home page, or add it to `noPage` with the reason |
| `page without a page here changed` | The twin of a `noPage` page changed: a "Coming soon" page may have content now | Read it. With content: as the line above, and remove its `noPage` entry. Without: `--write` |
| `not in the manifest` | A page here, or a `noPage` page, has no fingerprint yet | Check that the page agrees with the official page, then `--write` |
| `note: Markdown twin changed` | The twin of a page here changed and its rendered text and link targets did not | Nothing is due: the change is in markup the rendered page does not show (an image, a class, a heading anchor). `--write` when you next update the pages |
| `note: gone from the official list` | A `noPage` entry, or a page in the manifest that has no page here, is no longer listed | Remove the `noPage` entry, then `--write` |
| `note: noPage entry has a page here` | A page here was written for an official page that `noPage` still lists | Remove the `noPage` entry |

`check not made` with exit 2 is not a report: fix the cause it names and run again. A missing `manifest.json` is one: only `--write` starts a new one. A changed frame origin shows as 404s or "no article in the rendered page"; read the new origin from the `src` of the iframe on `https://stitch.google.com/docs/` and set `ORIGIN` in `scripts/upstream-lib.mjs`.

## Updating a page

1. `pnpm upstream:html`, then read the new text in `cache/upstream-html/<id>.md`. The previous text is not kept (`cache/` is not committed): compare with the Chinese page itself.
2. Check every fact on the page against it, under the rules in `AGENTS.md` (own words, no official sentences or prompt examples, the 「和已發布套件的差異」 section for a page whose subject ships as a package).
3. Set the date in `appliesTo` and `lastVerified` to today, also when no fact changed.
4. `pnpm upstream --write`, then `pnpm upstream` until no line is left (`--write` itself leaves with 0 whatever it reports), then `pnpm verify`.
5. The owner confirms the content before the push.

`--write` records the docs as they are now, for every page at once. Run it after every page in the report agrees with the official page, not before: a page that was not updated loses its line.

`lastVerified` moves only for a page that was read against its source again. A run without a difference moves nothing.

## Schedule

`.github/workflows/upstream.yml` runs the command once a week and by hand (`gh workflow run upstream.yml`). A difference on the default branch opens one issue with the label `upstream`, assigned to the owner; later runs replace its text, comment when a line other than a note is added or removed, and close it when there is no difference. A run that could not make the check fails the workflow and leaves the issue as it is.

GitHub stops scheduled workflows in a public repository after 60 days without activity in it; `gh workflow enable upstream.yml` starts them again.
