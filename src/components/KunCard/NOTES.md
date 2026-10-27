## Bordes y superficies

- Superficie `bg-default` (antes `bg-elevated`), como la `card` de Nuxt UI.
- `outlined`/`variant="outlined"` pasa de `border border-default` a
  `ring ring-default`: sobre `bg-elevated` el borde era invisible en dark
  (`--kun-border == --kun-bg-elevated == neutral-800`).
- `tonal` sigue `bg-muted`; `text` sigue `bg-transparent`.

## Color y variante (alineado a `KunColor` × `KunVariant`)

- `color`: `KunColor | null` (prop > `theme.defaults.card` > `neutral`); alterna
  la superficie tinta/plena vía `KUN_SURFACE_BG` (literal, en
  `src/theme/kunVariants.ts`).
- `variant`: estándar `KunVariant` (`null` hereda theme, fallback `solid`).
  La sombra es propia de `solid` ( máxima recrea el antiguo `elevated`);
  `soft/subtle/outline/ghost/link` renderizan `shadow-none` y `hover` sigue
  sumando `hover:shadow-md`.
- Caso especial `solid × neutral` conserva `bg-default` (el `bg-inverted` de la
  matriz es de controles, no de páginas/tarjetas).
- Mapeo legacy → nuevo (los valores viejos son error de validación):
  - `elevated` → `solid` (default: `bg-default` + `shadow-elevation`)
  - `outlined` → `outline` (`ring`, con el color resuelto)
  - `flat` → `solid` + `elevation="0"` (la prop booleana `flat` queda deprecada)
  - `tonal` → `soft` (`bg-${color}/10`, antes `bg-muted`)
  - `text` / `plain` → `ghost` (`bg-transparent` + `shadow-none`)
- La prop booleana `outlined` también queda deprecada: equivalía a
  `ring ring-default`.
