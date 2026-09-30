# Product Hunt Alternatives Directory

An open, searchable directory of 560 places to launch, list, and promote a software product. It brings together Product Hunt alternatives, startup directories, founder communities, developer launch platforms, review sites, regional platforms, and AI tool directories in one filterable list.

Use the directory to compare where a product can be submitted, whether a free option is available, what kind of outbound link a listing may receive, and the reported domain rating when that data is known.

The canonical dataset is [`data/platforms.json`](data/platforms.json). Corrections and additions are welcome.

## Add your product

You do not need to install the project or edit code.

1. [Open the GitHub issue forms](../../issues/new/choose).
2. Choose **Submit a platform**.
3. Add the product name, website, short description, category, and access details.
4. Disclose whether you own or work on the submitted product.

Use the same issue page to choose **Update a listing** when information is wrong, or **Report inactive** when a listed website has closed.

If you are comfortable editing JSON, you can add the entry directly to [`data/platforms.json`](data/platforms.json) and open a pull request. GitHub calls this a pull request. Some other platforms call it a merge request.

Before opening a pull request, run:

```bash
npm run check
```

The validator checks the file shape, categories, URLs, duplicate entries, and allowed values. Read the [contribution guide](CONTRIBUTING.md) for the required fields and review rules.

## What is in the directory

The current dataset contains 560 entries across seven practical categories:

- Launch platforms for scheduled or ranked product launches
- Founder communities where makers can share work and collect feedback
- Evergreen startup and software directories
- Developer launch sites, registries, and marketplaces
- Regional startup platforms
- Software review sites
- AI tool directories

Each entry can include a name, destination URL, short description, category, access model, link type, and domain rating. Missing or uncertain values are shown honestly instead of being guessed.

This is a research index, not a paid ranking. A listing does not imply endorsement.

## Why this project exists

Product launches rarely fit one website. A developer tool may belong on a technical launch board, an extension marketplace, and an evergreen software directory. An AI product may need a different mix. This project keeps those options in one dataset that people can search and maintain without depending on a closed service.

The website supports:

- Full-text search across names and descriptions
- Category, access, link type, and domain rating filters
- Sorting by name or domain rating
- Direct links to each platform
- Favicons loaded from each platform's own origin with text fallbacks
- Light and dark themes
- A JSON dataset that can be reused or audited

## Search and crawler support

The site is built as static HTML so the complete directory remains readable when JavaScript is unavailable. The production build includes:

- Pre-rendered directory rows
- One descriptive page title and one matching `h1`
- A concise meta description and Open Graph metadata
- `CollectionPage` and `ItemList` structured data that matches the visible directory
- An optional canonical URL and Open Graph URL
- A generated sitemap when the production origin is configured
- A robots file, web app manifest, security headers, and cache rules

The project does not use a meta keywords tag or hidden keyword blocks. It does not create thin pages for small query variations. Search visibility should come from useful data, accurate descriptions, crawlable links, and regular maintenance.

## Project structure

```text
index.html                 Directory page and search metadata
contribute.html            Contribution instructions
app.js                     Search, filters, sorting, and list rendering
assets/directory.css       Responsive visual system
data/platforms.json        Canonical directory dataset
scripts/validate-data.mjs  Dataset validation
vite.config.js             Static rendering and SEO build steps
public/                    Headers, robots, manifest, and public assets
```

## Data quality

Platforms change their pricing, submission rules, link attributes, and availability. Treat every entry as a starting point and verify important details on the destination website before paying or submitting a product.

Useful contributions include:

- Adding a relevant launch platform or directory
- Correcting a URL, category, or description
- Updating access or link information
- Reporting an inactive website
- Removing duplicate entries

Descriptions should be factual and specific. Do not add promotional claims, copied marketing text, affiliate parameters, or invented metrics.

## Trademarks and affiliation

Product and company names are used only to identify the services listed. Their trademarks belong to their respective owners. Remote favicons remain hosted by those owners. This independent project is not affiliated with or endorsed by Product Hunt.

## License

The code is available under the [MIT License](LICENSE). See [`NOTICE.md`](NOTICE.md) for attribution and project notices.
