Starter Next.js + TypeScript frontend for interactive branching moral stories.

## Run

1. Install: `pnpm install` (or `npm install`)
2. Dev: `pnpm dev`
3. Build: `pnpm build` and `pnpm start`

Stories live in `/stories/*.json`. Add new story JSON and run build — the home page will list it automatically.

## Notes
- ReactBits animations: add the package and integrate in components (SceneCard, Choices, EndingView).
- Analytics stub in `src/utils/analytics.ts` — wire to GA4 later.