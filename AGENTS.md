# Souk UI agent guide

This repository owns the shared design system and React component package only. Do not edit consuming applications from this repository.

- Preserve the public subpath import contract under `@souk/ui/components/*`, `hooks/*`, and `lib/*`.
- Keep visual decisions token-driven in `packages/ui/src/styles/globals.css`.
- Use the official shadcn CLI from `apps/web` when adding upstream components.
- Write behavior tests before production changes and validate with `npm run check` plus `npm run test:e2e`.
- Add a Changeset for consumer-visible changes.
- Do not publish locally unless the user explicitly requests a release and npm authentication is verified.
