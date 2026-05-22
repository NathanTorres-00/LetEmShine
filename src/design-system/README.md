# Shine by Lucy design system

**Figma:** [ShineByLucy](https://www.figma.com/design/PGLgfeZHhkOaKXpDOqxdEa/ShineByLucy?node-id=214-2)  
**Source page:** Shine Foundations (`214:2`)

## Typography

| Style | Font | Size |
|--------|------|------|
| Display/Script | Imperial Script | 80px |
| Display/Serif | Gloock | 48px |
| Heading/XL | Inclusive Sans | 40px |
| Heading/LG | Inclusive Sans | 28px |
| Body/MD | Inclusive Sans | 15px |
| Label/Caps | Inclusive Sans | 11px |

## Color semantics

| Token | Value |
|--------|--------|
| `bg/default` | `#ffffff` |
| `bg/muted` | `#f8fafc` (site sections) |
| `bg/inverse` | `#1b1b1d` |
| `text/primary` | `#0a0a0a` |
| `text/secondary` | `#5a5a5e` |
| `text/muted` | `#9a9a9e` |

## Usage in code

```ts
import { ds } from "@/design-system/classes";
```

```tsx
<h1 className={ds.displayScript}>Shine</h1>
<p className={ds.labelCaps}>✦ Luxury beauty</p>
```
