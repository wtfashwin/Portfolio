# Ashwin Upadhyay — Portfolio

A portfolio for AI systems and backend engineering, with source-linked projects, upstream contributions, professional experience, and dated credential records.

[View the portfolio](https://wtfashwin.github.io/Portfolio/)

## What it does

- Presents public projects, accepted upstream changes, profiles, and technical writing.
- Uses React and Three.js for the interface and background visuals.
- Pre-renders the React application so work and contact links are present in the initial HTML.
- Generates `profile.json`, its `portfolio.json` alias, `portfolio.md`, and `llms.txt` for readers and crawlers.
- Includes an engineering notebook and project diagrams that explain the work.

The notebook and diagrams are explanations of the work, not live sessions or benchmark results.

## Develop

Use Node.js 20, as configured in the Pages workflow, and npm.

```bash
git clone https://github.com/wtfashwin/Portfolio.git
cd Portfolio
npm ci
npm run dev
```

Edit the content or interface, then check and preview the production build:

```bash
npm test
npm run check:theme
npm run build
npm run preview
```

The build generates the public exports, builds with Vite, pre-renders the application, and checks the crawler-facing output. The output directory is `dist/`.

## Content and source guide

- `src/data.js` — identity, experience, projects, and contribution records.
- `src/platforms.json` — public profiles and writing links.
- `src/kaggle-evidence.json` — dated Kaggle evidence.
- `src/ui/` and `src/three/` — interface and visual components.
- `scripts/generate-profile.mjs` and `scripts/prerender.mjs` — text/JSON exports and initial HTML.
- `tests/` and `scripts/refresh-work.test.mjs` — available tests.

Update public claims against their linked sources and retain the original evidence dates. Badge awards and competition scores have separate check times; refreshing badges does not reverify scores. Keep planned awards, private paths, and credentials out of public data.

[Public profiles](https://wtfashwin.github.io/Portfolio/#profiles) and [technical writing](https://wtfashwin.github.io/Portfolio/#writing) use native disclosures. The [Kaggle badge roadmap](docs/kaggle-badge-roadmap.md) and [public benchmark dataset](https://www.kaggle.com/datasets/ashwinupadhyay/measured-cpu-ml-benchmarks) provide supporting records.

## Available checks and utilities

- `npm test` — notebook-content and refresh-utility tests.
- `npm run check:theme` — fixed-palette source checks.
- `npm run check:crawlers` — checks the generated `dist/` HTML and text exports; run after a build.
- `npm run refresh:work` — local candidate-review utility; its ignored cache is excluded from public exports.
- `npm run check:refresh` — refresh-utility recovery tests.

## Deployment and limits

[GitHub Actions](.github/workflows/deploy.yml) builds and publishes GitHub Pages on pushes to `main`. The workflow runs `npm ci`, `npm test`, and `npm run build`. Vite uses a relative asset base for static hosting.

Credential and platform records are dated snapshots. Automatic activity feeds are excluded. The earlier scroll-theme utilities remain in source but are not mounted by the current fixed-palette design.

Crawler rules need an origin-level `/robots.txt` to govern crawling. A file at `/Portfolio/robots.txt` is informational for this project path.

## License and attribution

No repository-wide license file is included. Instrument Sans is bundled with its [SIL Open Font License](public/fonts/OFL-Instrument-Sans.txt). Platform-logo notes are in [docs/platform-logos.md](docs/platform-logos.md).
