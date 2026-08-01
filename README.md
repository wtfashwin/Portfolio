# Ashwin Upadhyay — 3D Portfolio

A scroll-driven, cinematic single-page portfolio for **Ashwin Upadhyay (AI / ML Engineer)**,
built with **react-three-fiber** + **three.js**. A field of ~11,000 GPU-rendered particles
morphs between eight shapes as you scroll — each one framing a section of real, shipped work.

## The journey

| # | Shape | Section | Content |
|---|-------|---------|---------|
| 0 | Two-tone **ball** | Hero | Name + title (the name sits inside the sphere) |
| 1 | **Black hole** | Capabilities | Skill stack (GenAI, ML, Backend, Cloud, Data, Security) |
| 2 | **DNA helix** | The Core | Statement + recognition band |
| 3 | **DNA helix** | IRIS | Flagship DPSM metrics (44 routers, p95 < 500 ms, +18% accuracy, 12 connectors) |
| 4 | **DNA helix** | Work | Four roles: Sylox/IRIS, AI Privacy Verifier, Cerevra, SHAR |
| 5 | **Wave** | Principles | Hard-won engineering principles |
| 6 | **Starfield** | Open Source | Merged PRs — Langfuse, dlt, VictoriaMetrics, Unsloth, Tracecat + certs |
| 7 | **Galaxy** | Connect | Contact + links (camera dollies in for the finale) |

Two-colour palette (blue ↔ rose), `Sora` / `Inter` / `JetBrains Mono` typography,
postprocessing bloom + vignette, mouse-parallax camera.

## Stack
- `react` + `vite`
- `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`
- `three`

All content lives in [`src/data.js`](src/data.js) — edit there to update copy.

## Develop
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # → dist/
npm run preview  # serve the production build
```

## Deploy
The build is host-agnostic (`base: './'`), so `dist/` works on any static host.
A GitHub Actions workflow ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml))
builds and publishes to **GitHub Pages** on every push to `main` — just enable
Pages → Source → **GitHub Actions** in repo settings. Vercel / Netlify auto-detect Vite as well.
