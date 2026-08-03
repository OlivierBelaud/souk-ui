# Souk UI

The governed design system and React component library for every Souk SaaS product.

Souk UI packages a calm, Linear-inspired visual language as production code: React 19, Tailwind CSS 4, the official shadcn/ui component sources, Radix primitives, and TanStack Table. Applications consume decisions instead of recreating them.

## What is included

- 60+ real shadcn/ui primitives, including forms, overlays, navigation, charts, AI/message patterns, and feedback components.
- A Souk token layer with light/dark themes, semantic status colors, consistent focus states, Inter Variable, and reduced-motion support.
- An advanced DataTable with search, sorting, faceted filters, row selection, pagination, page-size control, column visibility, empty states, and controlled server-side mode.
- A living catalog in `apps/web` that documents foundations, primitives, DataTable behavior, and reusable SaaS patterns.
- Unit, coverage, browser, responsive, and accessibility tests plus package, type, format, lint, size, and supply-chain checks.
- Changesets and a provenance-enabled npm release workflow.

## Repository map

```text
apps/web                 Living catalog and integration fixture
packages/ui/src          Components, hooks, utilities, and tokens
packages/ui/dist         Tree-shakeable ESM package output
tests/e2e                Playwright and axe browser contracts
DESIGN.md                Visual language and governance rules
```

## Install

The package is prepared as `@souk/ui`. Until the first npm release is bootstrapped, consume it from the workspace or GitHub package source.

```bash
npm install @souk/ui
```

Import the system once in the application entry CSS or TypeScript entry:

```ts
import "@souk/ui/styles.css"
```

Then import components by subpath. Subpath exports keep application bundles tree-shakeable.

```tsx
import { Button } from "@souk/ui/components/button"
import { DataTable } from "@souk/ui/components/data-table"
```

For a TanStack Start application, place the stylesheet import in the root route or global stylesheet and use components normally from client-capable routes. Interactive entries include the `"use client"` boundary for framework interoperability.

## DataTable

```tsx
import type { ColumnDef } from "@souk/ui/components/data-table"

import { DataTable } from "@souk/ui/components/data-table"
import { DataTableColumnHeader } from "@souk/ui/components/data-table-column-header"
import { dataTableFacetedFilter } from "@souk/ui/components/data-table-faceted-filter"

const columns: ColumnDef<Project>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Project" />
    ),
  },
  {
    accessorKey: "status",
    filterFn: dataTableFacetedFilter,
  },
]

export function Projects({ projects }: { projects: Project[] }) {
  return (
    <DataTable
      columns={columns}
      data={projects}
      getRowId={(project) => project.id}
      filterColumn="name"
      filterPlaceholder="Search projects…"
      filters={[
        {
          columnId: "status",
          title: "Status",
          options: [
            { label: "Active", value: "active" },
            { label: "Paused", value: "paused" },
          ],
        },
      ]}
    />
  )
}
```

For API-backed tables, provide controlled `pagination`, `sorting`, and `columnFilters` state with their corresponding change handlers, then enable `manualPagination`, `manualSorting`, and `manualFiltering`. Pass `pageCount` or `rowCount` from the response.

## Development

Requirements: Node 22.14+ and npm 11.

```bash
npm install
npm run dev
```

The complete local gate is:

```bash
npm run check
npm run test:e2e
```

Useful focused commands:

```bash
npm run typecheck
npm run test:coverage
npm run check:package
npm run size
```

## Adding or changing components

Run the official shadcn CLI against the catalog. Its aliases route generated source into `packages/ui`.

```bash
npx shadcn@latest add <component> --cwd apps/web
```

Every behavioral change needs a user-facing test. Every visual change must remain token-driven and be checked in both themes and at mobile width. See [CONTRIBUTING.md](./CONTRIBUTING.md) and [DESIGN.md](./DESIGN.md).

## Releasing

1. Add a changeset with `npm run changeset`.
2. Merge the version update produced by `npm run version-packages`.
3. Create a GitHub release tagged with the exact package version, for example `v0.1.0`.
4. The publish workflow validates the repository again and publishes `@souk/ui` with npm provenance.

The first npm publication must be bootstrapped by an owner of the `@souk` scope. After that, configure npm Trusted Publishing for `.github/workflows/publish.yml`; no long-lived npm token is required.

## License

MIT © Olivier Belaud
