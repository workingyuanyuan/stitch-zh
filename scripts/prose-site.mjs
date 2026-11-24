// Site settings for scripts/prose-review.mjs (the prose ledger).
//
// - derived: locales a script writes from another; this site has one language, so none.
// - skip(path, lang): text the page shows as its source gives it, which is not the site's prose.
//   This site shows none: the official docs carry no licence, so their sentences are not reused,
//   and prompt examples are the site's own, in code blocks, which are left out.

export default {
	derived: [],
	skip: () => [],
};
