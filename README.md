# Ashwin Upadhyay — Portfolio

A portfolio for AI systems and backend engineering: source-linked projects, merged upstream contributions, professional experience, and dated credential records. An interactive engineering notebook explains two accepted changes; original diagrams make the public projects inspectable.

Built with React and Vite. Content lives in `src/data.js`. The Kaggle panel reads `src/kaggle-evidence.json`, a dated public snapshot. Badge awards and competition scores retain their separate check times; refreshing badges does not reverify older scores.

The build generates `profile.json` and `llms.txt`, then pre-renders the real React application into the initial HTML. Work and contact links remain available without JavaScript. Fonts are self-hosted, controls support keyboard input, and nonessential motion respects the system preference. The notebook and project diagrams are explanations, not live application sessions or benchmark results.

[The badge roadmap](docs/kaggle-badge-roadmap.md) records the Kaggle catalog. [The benchmark dataset](https://www.kaggle.com/datasets/ashwinupadhyay/measured-cpu-ml-benchmarks) contains 16 verified measurements.

## Develop

```bash
npm ci
npm run dev
npm test
npm run build
npm run preview
```

## Refresh evidence

Read back awarded cards from Kaggle before editing the snapshot. Include only verified awards, award dates, source URLs, and evidence check times. Keep planned badges, estimated scores, private paths, and credentials out of the public file. Preserve score receipt times when only badges are refreshed.

## Deploy

[GitHub Actions](.github/workflows/deploy.yml) builds and publishes GitHub Pages on pushes to `main`. Vite uses a relative asset base for static hosting.

## Public profiles and writing

The existing `src/platforms.json` directory is retained: 14 public profiles, four technical articles, and one co-authored paper. Writing and profiles open through native disclosures; existing `#writing` and `#profiles` links remain valid. Original evidence dates are preserved.

The build publishes `profile.json`, its `portfolio.json` alias (schema version 2), `portfolio.md`, and `llms.txt`. `npm run check:crawlers` verifies source links and dated records in the actual HTML and text exports.

`npm run refresh:work` remains a local candidate review utility; its ignored cache never enters the website or public exports. `npm run check:refresh` tests its recovery behavior. Automatic activity feeds remain excluded.

Crawler rules must be published at the origin's `/robots.txt` to govern crawling; the project-level `/Portfolio/robots.txt` is only informational. The earlier scroll-theme utilities remain in source but are not mounted by this fixed-palette design.
