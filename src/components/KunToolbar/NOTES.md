## Bordes y superficies

- `bordered` pasa a **default `true`** (`border-b border-default`), como el
  `dashboard-toolbar` de Nuxt UI.
- Sigue con `bg-transparent`: el borde es visible mientras el fondo detrás sea
  `bg-default` (página o appbar). Sobre un contenedor `bg-muted`/`bg-elevated`
  usar `border-muted` explícito.
- `KunToolbarItems` variante `outlined`: `ring ring-accented` (antes
  `border border-default`).

## `KunToolbarItems` alineado a `KunColor` × `KunVariant`

- `color`: `KunColor | null` (prop > `theme.defaults['toolbar-items']` > `neutral`).
- `variant`: estándar `KunVariant` (`null` hereda theme, fallback `ghost`).
- La superficie se pinta con `KUN_SURFACE_BG[resolvedColor][resolvedVariant]`
  (patrón de `KunList`): fondo + ring, literales, sin encadenar al texto.
- Mapeo legacy → nuevo (los valores viejos son error de validación):
  - `flat` → `ghost` (`bg-transparent`, `shadow-none`)
  - `text` → `ghost` (default actual)
  - `elevated` → `solid` (fondo pleno del color)
  - `tonal` → `soft` (`bg-${color}/10` en vez de `bg-muted`)
  - `outlined` → `outline` (`ring`, igual al `bordered` de la lista)
  - `plain` → `ghost`
- Ruptura: con solo `color` y sin variante ya **no** se pinta `bg-${color}`;
  la variante debe ser `solid` para fondo pleno (antes `variant="text"` +
  `color` pintaba).
