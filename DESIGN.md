# Souk UI design system

## Product position

Souk UI is shared product infrastructure for SaaS landing pages and authenticated dashboards. Its job is to remove local design arbitration while preserving enough composition freedom for different products.

The visual direction is **Linear calm**: quiet surfaces, sharp hierarchy, compact controls, semantic color, and high information density without visual noise.

## Principles

1. **Neutral first.** Product content carries the hierarchy. Chrome remains white, near-white, charcoal, and gray.
2. **Color has meaning.** Blue is focus/information; green is success; amber is caution; red is destructive. Color is not decoration.
3. **One spacing rhythm.** Layout follows Tailwind's 4px base scale. Prefer `gap` over child margins and keep related content closer than unrelated content.
4. **Compact, not cramped.** Default controls are optimized for operational dashboards; larger sizes are available for landing-page calls to action.
5. **Behavior is part of design.** Keyboard support, focus, empty/loading/error states, and reduced motion are non-negotiable states.
6. **Composition over variants.** Add a variant only when it expresses a stable semantic decision across products.

## Foundations

### Typography

- Family: Inter Variable, with system sans-serif fallback.
- Interface copy: 14px default, 12px metadata, 16px emphasized body.
- Headings: semibold with slightly negative tracking; avoid oversized dashboard headings.
- Numbers: use `tabular-nums` in tables, metrics, invoices, and timers.
- Code and identifiers: system monospace at 12px.

### Color

Tokens use OKLCH to preserve perceptual relationships in light and dark themes.

| Role               | Usage                                     |
| ------------------ | ----------------------------------------- |
| `background`       | Page canvas                               |
| `card` / `popover` | Elevated product surfaces                 |
| `foreground`       | Primary text and high-emphasis actions    |
| `muted`            | Quiet fills and grouped controls          |
| `border` / `input` | Structural boundaries and form affordance |
| `ring` / `info`    | Focus and informational state             |
| `success`          | Completed, healthy, or positive state     |
| `warning`          | Attention needed without failure          |
| `destructive`      | Irreversible or failed state              |

Never communicate status by color alone. Pair it with a label, icon, or accessible text.

### Shape and elevation

- Base radius: 10px (`0.625rem`).
- Cards and dialogs: 12px–14px derived radii.
- Elevation: one-pixel rings or borders first; soft shadows only when surfaces overlap.
- Avoid decorative gradients, glass panels, and multiple competing radii.

### Motion

Transitions clarify state; they do not decorate it. Keep standard interactions near 100–200ms. The global stylesheet collapses animation and transition duration when reduced motion is requested.

## Component contract

- Components expose `data-slot` attributes for stable styling, testing, and composition.
- Interactive components are based on Radix or Base UI primitives and preserve their accessibility behavior.
- All component imports use explicit subpaths: `@souk/ui/components/button`.
- React and React DOM are peer dependencies to prevent duplicate runtimes.
- CSS is imported once through `@souk/ui/styles.css`.
- Consumer applications may compose layout around components, but must not redefine core colors, typography, radius, focus rings, or component state styling locally.

## Data-heavy interfaces

The shared DataTable is the default for operational collections. It includes client and server modes. A product must not create another generic table abstraction for sorting, filtering, pagination, selection, or column visibility.

Use a plain `Table` only for small static comparisons. Use `DataTable` whenever a user can operate on a collection.

## Governance

- Patch: fixes, accessibility improvements, and backward-compatible polish.
- Minor: new components, tokens, patterns, and optional props.
- Major: removed exports, renamed tokens, changed default behavior, or intentionally incompatible visual changes.
- Every release uses a Changeset and passes the full repository gate.
- Product-specific needs should first be expressed as composition. Promote them into Souk UI only after they recur or clearly belong to the shared language.
