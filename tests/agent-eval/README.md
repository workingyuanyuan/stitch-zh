# Agent test

Checks whether an agent with only a fetch tool answers questions about Stitch better from this site than from the official documentation.

## Files

| File | Role |
| --- | --- |
| `questions.json` | Ten pilot questions with the expected answer, the qualifier that is easy to miss, and the page that holds them. Written from the official pages as read on 2026-11-20 |
| `fetch.mjs` | The fetch tool given to the agent. Modelled on the MCP reference Fetch server: main-article extraction, Markdown output, 5,000 characters per call, `start_index` to continue. Every call is logged to `runs/<run>.log` |
| `results/<date>/` | Answers and fetch logs of each recorded run |

## How to run

1. Build the site with a local address and serve it:

```
SITE_URL=http://127.0.0.1:4401/stitch-zh pnpm build
pnpm preview
```

2. Give a fresh agent the questions (without the expected answers), the fetch command below as its only source, a start URL, and a budget of 3 fetches per question.

```
node tests/agent-eval/fetch.mjs --run <run-name> --q <question-id> <url> [start_index]
```

Start URL for this site: `http://127.0.0.1:4401/stitch-zh/`. Start URL for the baseline: `https://stitch.google.com/docs/`.

3. Score each answer against `questions.json`: pass needs the answer and the qualifier; partial is one of the two or an unverified inference; fail is a wrong or missing answer.

4. Run `pnpm verify` afterwards so that `dist/` carries the public address again.

## Results

### 2026-11-20

Twenty questions: q01 to q10 on the "Stitch" tab, q11 to q20 on the CLI, MCP, SDK, DESIGN.md and Agent Skills tabs.

| Run | Questions | Pass | Partial | Fail | Fetches (from the log) |
| --- | --- | --- | --- | --- | --- |
| This site, start URL `http://127.0.0.1:4401/stitch-zh/` | q01 to q20 | 19 | 1 (q20) | 0 | 18 |
| Official sources, start URL `https://stitch.google.com/docs/` | q01 to q10 | 1 (q08) | 1 (q07) | 8 | 10 |
| Official sources, same start URL, public repositories and npm pages allowed | q11 to q20 | 4 (q15, q17, q18, q19) | 2 (q11, q20) | 4 (q12, q13, q14, q16) | 19 |

What the readers of the official sources ran into: `https://stitch.google.com/docs/` returned status 200 with no text, and so did every docs path, because the docs load in a frame with JavaScript. `https://stitch.google.com/llms.txt` is a product overview without interface details, and the sitemap lists four pages. For q01 to q10 the two answers came from the Stitch Prompt Guide on `discuss.ai.google.dev`, which that `llms.txt` links. For q11 to q20 the answers came from the READMEs of `google-labs-code/stitch-sdk`, `google-labs-code/design.md`, `google-labs-code/stitch-skills` and of the npm package `@google/stitch`; nothing on OAuth token lifetime, on retrying a generation or on `upload()` was found there.

What the test changed on the site:

- The reader of the official sources answered q15 with `variantCount` from the SDK README, where the docs page (and at that time this site) said `numVariants`. Checking the package files showed the docs differ from the published packages in many places; the SDK, DESIGN.md and CLI command pages now carry those differences, and q15 and q16 were rewritten to the facts in the package files.
- In an earlier run of the site side, the answer to q14 lacked the reason not to retry (a retry may create a duplicate screen): the sentence sat far down the page. It is now in the page's caveat and in the tool's section.
- q20 is a partial in the recorded run: the answer names the command and the seven tools and says the server is local, but does not say that the remote Stitch MCP service is a different server with a different tool list. The page states it in its caveat.

Limits of this result:

- One reader model (Claude Sonnet, as a subagent) and one recorded run per side. The site side was run three times while the pages were being corrected (10 of 10 on the first ten questions twice; then 20 questions: 18 pass and 2 partial, then the recorded run after the fixes above).
- The questions and the expected answers were written by the author of the site: q01 to q14 and q17 to q20 from the official pages, q15 and q16 from the package files after the first 20-question run. The reader of the official sources answered the earlier wording of q15 and q16, which named `numVariants` and asked whether `upload()` throws.
- The site was served locally, built with `SITE_URL=http://127.0.0.1:4401/stitch-zh`.
- The readers could not be limited to the fetch tool by the harness; they were told to use nothing else, and the fetch logs match the answers they gave.
- The readers of the official sources did not keep exactly to 3 fetches per question (one question took 4), and charged exploratory fetches to other questions.
