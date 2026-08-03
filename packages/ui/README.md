# @souk/ui

Shared React 19 component library and Tailwind CSS 4 design tokens for Souk SaaS products.

```bash
npm install @souk/ui
```

```tsx
import "@souk/ui/styles.css"
import { Button } from "@souk/ui/components/button"

export function CreateButton() {
  return <Button>Create project</Button>
}
```

Public table types such as `ColumnDef` are re-exported from
`@souk/ui/components/data-table`, so consumers do not depend on package-manager
hoisting details.

Imports are exposed per component, hook, and utility. See the repository README and living catalog for the complete API, DataTable server-mode contract, design rules, and release policy.
