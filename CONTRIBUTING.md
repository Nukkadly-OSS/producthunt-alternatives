# Contributing

The live list is `data/platforms.json`. GitHub Issues are enough if you do not want to touch JSON. Pull requests are better when you already have the exact edit.

## Pick a path

**Add a listing.** Open a Submit a platform issue from `.github/ISSUE_TEMPLATE/submit-a-platform.yml`, or add one object in `data/platforms.json` and open a pull request.

**Fix a listing.** Wrong URL, access, follow type, or DR. Use the Update a listing issue template, or patch the same JSON object in a pull request.

**Remove an inactive directory.** Parked domain, long-running 404, login wall with no public listing page, or a site that no longer lists products. Use the Report inactive issue template. A pull request that deletes that object is also fine. Include the date you checked and what you saw.

Do not invent domain rating. Leave `domainRating` as `null` when you do not have a number. `linkType` is `Dofollow`, `Nofollow`, or `Unknown`.

## What belongs here

A listing must:

- Be live on HTTPS.
- Help people launch, promote, or discover software products.
- Have a public page that explains how listing works.
- Avoid fake traffic, forced downloads, and link schemes.
- Fit one existing category. Propose a new category only when several listings need it.

You may submit a site you own. Say so in the issue or pull request. One listing per product. Paid plans are fine when `access` is honest (`Free`, `Free option`, `Paid`, or `n/a`).

A listing is not an endorsement. Maintainers can rewrite the one-line description, reject spam, or drop a row that no longer meets the rules.

## Pull request steps

1. Fork the repo and branch from `main`.
2. Edit only the objects that need to change. Keep the rest of the file intact.
3. Run `npm run check`. It needs Node. It does not need `npm install`.
4. Open a pull request with a short why. Link the issue if there is one.

```json
{
  "name": "Example",
  "url": "https://example.com",
  "description": "One factual sentence explaining what the platform does.",
  "category": "Launch platforms",
  "bestFor": "Short audience label",
  "pricing": "Free option",
  "cadence": "Weekly",
  "evergreen": true,
  "communityVoting": true,
  "maintainerProject": false,
  "tags": ["search phrase", "audience"],
  "linkType": "Unknown",
  "dofollow": false,
  "domainRating": null,
  "access": "Free option"
}
```

Set `maintainerProject` to `true` only for this repo's own product. For everything else it stays `false`. Set `dofollow` to `true` only when `linkType` is `Dofollow`.

## Local preview

```bash
npm install
npm run dev
```

The Contribute page is `contribute.html`. The list reads `data/platforms.json`.

## Conduct

Be specific. No harassment. No issue spam for the same URL. See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
