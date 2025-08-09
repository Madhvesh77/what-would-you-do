# Authoring stories

- Add a JSON file to `/stories/<id>.json` using the schema in `/src/types/story.ts`.
- Keep stories short (5–10 nodes), 4–6 decision points is recommended.
- Use `tags` on choices to record traits. Archetypes map to tag sets.
- `next` is ordered; first condition that evaluates true gets chosen.
- Test locally by visiting `http://localhost:3000/<storyId>` after `pnpm dev`.