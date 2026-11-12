## Bordes y superficies

- Superficie `bg-default` (antes `bg-elevated`), como la `card` de Nuxt UI.
- El borde siempre es `variant="outline"` (`ring` con el color resuelto):
  sobre `bg-elevated` un `border` era invisible en dark
  (`--kun-border == --kun-bg-elevated == neutral-800`).

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
- Mapeo histórico de la migración previa (los valores viejos son error de
  validación):
  - `elevated` → `solid` (default: `bg-default` + `shadow-elevation`)
  - `outlined` → `outline` (`ring`, con el color resuelto)
  - `tonal` → `soft` (`bg-${color}/10`, antes `bg-muted`)
  - `text` / `plain` → `ghost` (`bg-transparent` + `shadow-none`)
- Props booleanas `flat` y `outlined` **eliminadas** (fin de la migración):
  sin reemplazo a nivel prop; `flat` → `variant="solid"` + `elevation="0"`;
  `outlined` → `variant="outline"`. Pasarlas es un attr DOM anodino, no
  comportamiento.
