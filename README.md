# Ashwin Upadhyay — Portfolio

A concise portfolio for AI systems and backend engineering: professional experience, selected public projects, merged open-source fixes, and verified credentials. A floating glass navigation bar and a scroll-driven transition from dark to soft light, with responsive cards. Reduced Motion keeps the dark palette stable.

Built with React and Vite. Content lives in `src/data.js`. The Kaggle panel reads `src/kaggle-evidence.json`, a dated public snapshot. Badge awards and competition scores retain their separate check times; refreshing badges does not reverify older scores.

`src/platforms.json` lists 14 confirmed public profiles and publication links, four Medium articles, and one co-authored paper. Profile ownership comes from public cross-links, named publications, or direct confirmation. The directory is a verified baseline, not an exhaustive search of the internet.

The snapshot confirms 19 awarded Kaggle badges as of October 8, 2026 at 15:10 UTC. [The badge roadmap](docs/kaggle-badge-roadmap.md) records all 61 catalog entries. [The benchmark dataset](https://www.kaggle.com/datasets/ashwinupadhyay/measured-cpu-ml-benchmarks) contains 16 verified measurements.

## Develop

```bash
npm ci
npm run dev
npm run build
npm run check:crawlers
npm run preview
```

## Refresh evidence

Read back awarded cards from Kaggle before editing the snapshot. Include only verified awards, award dates, source URLs, and evidence check times. Keep planned badges, estimated scores, private paths, and credentials out of the public file. Preserve score receipt times when only badges are refreshed.

## Deploy

[GitHub Actions](.github/workflows/deploy.yml) builds and publishes GitHub Pages on pushes to `main`. Vite uses a relative asset base for static hosting.

## HTML and machine-readable content

`npm run build` renders the same React application into `dist/index.html` before deployment. The initial HTTP response includes the introduction, experience, projects, skills, contribution links, credentials, and badges. JavaScript hydrates that HTML to add navigation and theme interactions. Readers that do not execute JavaScript receive the same public content.

The build also publishes:

- `portfolio.md`: plain text and source links derived from the page's content data.
- `portfolio.json`: structured public facts and the original Kaggle evidence timestamps.
- `llms.txt`: a supplementary directory of these resources and verification records.
- `sitemap.xml`: the absolute canonical portfolio URL.

The HTML includes a canonical URL and Schema.org `ProfilePage` / `Person` JSON-LD. Build checks fail if key work entries, contribution links, badge counts, or dated score exports are missing. `npm run check:crawlers` repeats the checks against an existing build.

This improves access to the content; it does not guarantee indexing, inclusion in AI answers, or accurate summaries from every model. [Google recommends static rendering or server rendering for JavaScript sites](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics). `llms.txt` is supplementary and does not replace readable HTML, source links, or crawl permissions.

Crawler permissions belong in `https://wtfashwin.github.io/robots.txt`, at the origin root. A file at `/Portfolio/robots.txt` would not control this project site's crawling. [Google's robots.txt guidance](https://developers.google.com/search/docs/crawling-indexing/robots/create-robots-txt) explains that scope. Review the root publisher before changing those permissions. [OpenAI documents OAI-SearchBot and GPTBot separately](https://developers.openai.com/api/docs/bots): search visibility and training crawling are separate choices.

## Refresh recent public work

```bash
npm run refresh:work
npm run check:refresh
npm run build
```

`scripts/refresh-work.mjs` exports `pullLatestWork({ profiles, previous, fetchImpl, now, timeoutMs, limit })`. The CLI reads verified profiles from `src/platforms.json` and writes `src/work-feed.json`. It fetches recent public updates to owned repositories, excluding upstream forks, and merged PRs through GitHub's public API, plus article titles, links, and dates through the verified Medium RSS feed. It uses no credentials and does not retrieve private work or full article bodies.

The cache records each platform's check attempt separately from its last successful fetch. HTTP blocks, rate limits, malformed responses, timeouts, and incomplete GitHub search results preserve the last successful records and their original fetch time. A repository push date does not prove that Ashwin authored every commit; PR dates are explicitly marked as merged dates or last-update dates according to the available evidence.

Other platforms remain manual. This function does not refresh Kaggle or LeetCode badge counts, change the verified writing baseline, schedule recurring jobs, commit, or publish. Review the cache before publishing; the limited feeds are recent observations, not a complete contribution inventory. [GitHub documents its public repository endpoints](https://docs.github.com/en/rest/repos/repos#list-repositories-for-a-user) and [search limitations](https://docs.github.com/en/rest/search/search#search-issues-and-pull-requests). [Medium documents its profile RSS feeds](https://help.medium.com/hc/en-us/articles/214874118-Using-RSS-feeds-of-profiles-publications-and-topics).

## Theme verification

`npm run check:theme` checks 1,001 palettes against the WCAG 4.5:1 text contrast threshold, including the glass navigation over dark and bright backdrops. It also checks that scroll motion converges without overshooting. The animation schedules frames while scroll state changes and stops when it settles. The navigation uses a web glass treatment, not Apple’s native Liquid Glass APIs.
