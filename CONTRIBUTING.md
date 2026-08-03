# Contributing

## Setup

Use Node 22.14+ and npm 11, then run `npm install` and `npm run dev`.

## Change policy

- Keep shared behavior in `packages/ui` and examples in `apps/web`.
- Prefer existing tokens and composition over new one-off variants.
- Add a user-facing test before changing component behavior.
- Verify keyboard behavior, both themes, reduced motion, and responsive layout for UI changes.
- Add a Changeset for every consumer-visible package change.
- Do not commit build output, coverage, browser artifacts, or credentials.
- Treat untouched shadcn-generated wrappers as upstream-owned. Souk coverage
  gates target locally authored or behaviorally modified components; every
  local behavior change needs a focused test.

## Required gate

```bash
npm run check
npm run test:e2e
```

Commits should be small, scoped, and explain user value. Pull requests should describe the contract changed, screenshots or recordings for visible changes, and the validation performed.
