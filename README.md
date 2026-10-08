# Ashwin Upadhyay — Portfolio

A concise portfolio for AI systems and backend engineering: professional experience, selected public projects, merged open-source fixes, and verified credentials. Dark styling with a static background and responsive cards.

Built with React and Vite. Content lives in `src/data.js`. The Kaggle panel reads `src/kaggle-evidence.json`, a dated public snapshot. Badge awards and competition scores retain their separate check times; refreshing badges does not reverify older scores.

The snapshot confirms 19 awarded Kaggle badges as of October 8, 2026 at 15:10 UTC. [The badge roadmap](docs/kaggle-badge-roadmap.md) records all 61 catalog entries. [The benchmark dataset](https://www.kaggle.com/datasets/ashwinupadhyay/measured-cpu-ml-benchmarks) contains 16 verified measurements.

## Develop

```bash
npm ci
npm run dev
npm run build
npm run preview
```

## Refresh evidence

Read back awarded cards from Kaggle before editing the snapshot. Include only verified awards, award dates, source URLs, and evidence check times. Keep planned badges, estimated scores, private paths, and credentials out of the public file. Preserve score receipt times when only badges are refreshed.

## Deploy

[GitHub Actions](.github/workflows/deploy.yml) builds and publishes GitHub Pages on pushes to `main`. Vite uses a relative asset base for static hosting.
