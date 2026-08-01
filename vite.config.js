import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' makes the build host-agnostic — works on GitHub Pages project sites
// (wtfashwin.github.io/Portfolio/), Vercel, Netlify, or any static host, with no
// per-host path rewrites. This single-page scroll site has no client-side routing,
// so relative asset URLs are safe everywhere.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1200,
  },
})
