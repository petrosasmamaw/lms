# LMS Design System

World-class UI/UX redesign for **lms-admin** and **lms-client**, built on a shared token architecture with app-specific accent colors.

## Philosophy

Stripe-level precision, Linear-level density, Vercel-level minimalism. No gradients on buttons, no box-shadow cards, no emoji icons — borders and subtle backgrounds create hierarchy.

## Token architecture

| File | Purpose |
|------|---------|
| `src/styles/tokens.css` | Single source of truth for colors, typography scale, radii, spacing |
| `src/index.css` | Tailwind v4 theme + component classes consuming tokens |
| `src/lib/theme.js` | Dark/light mode persistence (`localStorage`) |

### Typography

- **Display / headings:** Plus Jakarta Sans (500–800)
- **Body / UI:** Inter (400–500)
- **Data / mono:** JetBrains Mono (400–500)

Type scale uses CSS variables (`--text-xs` through `--text-4xl`) with paired line-height and letter-spacing.

### Colors

All colors are CSS custom properties with **light** (`:root`) and **dark** (`html.dark`) values:

- Neutrals: `--color-bg-*`, `--color-border*`, `--color-text-*`
- Accent: admin `#6C63FF` (violet), client `#F97316` (orange)
- Semantic: success, warning, error, info — each with muted variant

**Default:** light mode. Dark mode available via navbar toggle (`class="dark"` on `<html>`).

### Component classes

| Class | Usage |
|-------|-------|
| `btn-primary` / `btn-secondary` / `btn-ghost` / `btn-danger` | Buttons |
| `input` / `select` / `label` | Form fields |
| `card` / `card-interactive` | Surfaces |
| `badge-*` | Status pills (muted bg + colored text) |
| `tab-btn-active` / `tab-btn-inactive` | Tab navigation |
| `data-table` | Student lists |
| `empty-state` | Zero-data screens |
| `skeleton` | Loading placeholders |
| `spinner` | Inline loading |
| `toast-error` / `toast-success` | Feedback |
| `page-title` / `page-subtitle` / `eyebrow` | Page hierarchy |

## What changed

### Both apps

- Replaced gradient backgrounds and shadow-heavy cards with token-based flat surfaces
- Added Google Fonts (Plus Jakarta Sans, Inter, JetBrains Mono)
- Added Lucide React icons (stroke-width 1.5) — removed all emoji UI icons
- Dark mode default + theme toggle in navbar
- Focus rings, hover/active states on all interactive elements
- Loading skeletons for async sections
- Empty states with icon + title + description
- `prefers-reduced-motion` respected in tokens

### lms-admin

- Violet accent (`#6C63FF`)
- Student list upgraded to data table with verify badges
- Department/course cards use icon + border hover lift
- Auth forms with proper labels and autocomplete

### lms-client

- Orange accent (`#F97316`) for student brand distinction
- Exam UI: progress bar, choice labels with accent selection
- Pending verification screen uses Clock icon (no emoji)
- Course cards simplified with single CTA

## Running

```bash
# Admin (port 5173)
cd lms-admin && npm run dev

# Client (port 5174)
cd lms-client && npm run dev
```

Toggle light/dark via the sun/moon button in the navbar.

## Quality checklist

- [x] No hardcoded hex in components (only in `tokens.css`)
- [x] CSS reset (box-sizing, margin)
- [x] Hover + focus + active on interactive elements
- [x] Keyboard focus rings (`:focus-visible`)
- [x] 4px spacing grid
- [x] Typography hierarchy via size + weight + color
- [x] Lucide icons at 1.5 stroke
- [x] Empty states with icon + text
- [x] Light and dark mode
- [x] Mobile-responsive layouts (flex-wrap, grid breakpoints)
