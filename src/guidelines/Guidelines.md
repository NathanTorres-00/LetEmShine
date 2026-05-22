# Shine by Lucy — Design system guidelines

**Figma:** [ShineByLucy — Shine Foundations](https://www.figma.com/design/PGLgfeZHhkOaKXpDOqxdEa/ShineByLucy?node-id=214-2)

## Brand voice (visual)

Monochrome luxury beauty — neutrals, glass surfaces, no sky-blue accent.

## Typography

| Token | Font | Size |
|--------|------|------|
| Display script | Imperial Script | 80px (`Shine`) |
| Display serif | Gloock | 40px (`by Lucy`) |
| Heading XL | Inclusive Sans | 40px |
| Heading LG | Inclusive Sans | 28px |
| Body MD | Inclusive Sans | 15px |
| Label caps | Inclusive Sans | 11px, uppercase |

## Color

Use semantic tokens from `src/design-system/tokens.css`:

- `text-primary` / `neutral-950` — headlines
- `text-secondary` / `neutral-600` — body
- `text-muted` / `neutral-400` — labels
- `bg-inverse` / `neutral-900` — dark bands (welcome bar)
- Buttons: filled `neutral-900` on light; inverted on dark hero

## Components

- Logo: **Shine** (script) + **by Lucy** (serif)
- Primary CTA: pill button, `ds.btnPrimary`
- Cards: `ds.cardElevated` (24px radius, soft shadow)
- Scheduling slots: `ds.btnTimeSlot*` patterns

## Code

```ts
import { ds } from "../design-system/classes";
```

Do not use legacy sky/teal/yellow utility classes for new UI.
