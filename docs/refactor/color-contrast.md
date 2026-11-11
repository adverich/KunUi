# Contraste de colores semánticos

Cada slot semántico (`primary|secondary|success|info|warning|error`) tiene
**cuatro roles** en lugar de un único `--kun-{slot}`. Fuente: `src/styles/theme.css`
(capa 2); espejo en runtime en `SEMANTIC_STOPS` de `src/theme/kunTheme.ts` y en
el generador `scripts/generate-color-compat.ts`.

| Rol | Token | Light | Dark | Utilidades |
|---|---|---|---|---|
| Superficie | `--kun-{slot}` | 400 | 700 | `bg-{slot}`, `hover:bg-{slot}/75` |
| Tonal | `--kun-{slot}-tonal` | 800 | 200 | `text-{slot}`, `ring-{slot}/NN`, `border-{slot}`, `outline-{slot}`, `divide-{slot}` |
| Tint | `--kun-{slot}-tint` | 400 | 300 | `bg-{slot}-tint/NN` (soft, subtle, hovers, seleccionado, error de campo) |
| Tinta | `--kun-text-on-{slot}` | neutral-950 | white | `text-on-{slot}` sobre `bg-{slot}` |

- Los trazos resuelven al tonal por **override de namespace**: Tailwind v4 busca
  `--text-color-*` / `--ring-color-*` / `--border-color-*` / `--outline-color-*` /
  `--divide-color-*` antes que `--color-*`. `bg-{slot}` sigue en la superficie.
- **Nunca `bg-{slot}/NN` para un tinte**: en dark la superficie es 700 y su tinte
  sobre `neutral-900` es invisible. Las opacidades ≥50 sobre `bg-{slot}` son
  hovers de superficie sólida y sí siguen en `bg-{slot}/NN`.
- `text-on-{slot}`: kunTheme publica `--kun-on-{slot}-light|dark` eligiendo
  blanco o `neutral-950` por luminancia WCAG contra la superficie de cada modo
  (cubre paletas custom/HEX). Son independientes del modo activo.
- Alias legacy: `text-warning-tonal` == `text-warning`.
- **No forzar `color` sobre `bg-{slot}`** (p. ej. una clase propia de la app con
  `color: var(--kun-text)`): CSS sin capa le gana a la utilidad `text-on-{slot}`
  y deja texto gris sobre rojo (3.6:1). Usar `text-on-{slot}` o
  `kunOnSurfaceTextFromBg(clases)` para fondos dinámicos.
- Texto base (`--kun-text`): light `neutral-800` (14.6:1 sobre blanco; antes
  700 = 10.4), dark `neutral-200`. `text-highlighted` queda en 900 / white.
- Helpers: `KUN_ON_SURFACE_TEXT` / `kunOnSurfaceText(color)` y
  `kunOnSurfaceTextFromBg(classes)` en `src/theme/kunVariants.ts`.

## Contraste resultante (WCAG, AA = 4.5)

Fondos: `white` (light) y `slate-900` (dark). Columnas: tinta sobre superficie
sólida, texto tonal sobre `bg-default`, texto tonal sobre tint /10 (soft) y /20
(seleccionado).

| Paleta | Modo | on/superficie | tonal/bg | tonal/tint10 | tonal/tint20 |
|---|---|---|---|---|---|
| sky | light | 9.3 | 7.5 | 6.9 | 6.3 |
| sky | dark | 5.9 | 13.4 | 10.9 | 8.4 |
| blue | light | 7.6 | 8.8 | 8.1 | 7.3 |
| blue | dark | 6.8 | 12.5 | 10.3 | 8.1 |
| green | light | 11.3 | 7.1 | 6.6 | 6.2 |
| green | dark | 4.9 | 14.8 | 11.8 | 8.9 |
| amber | light | 11.7 | 7.1 | 6.7 | 6.3 |
| amber | dark | 5.0 | 14.3 | 11.6 | 8.9 |
| red | light | 7.0 | 8.4 | 7.5 | 6.8 |
| red | dark | 6.4 | 12.3 | 10.3 | 8.2 |
| neopos (marca) | light | 7.6 | 10.7 | 9.7 | 8.9 |
| neopos (marca) | dark | 5.5 | 10.9 | 9.1 | 7.4 |

Antes (500 light / 400 dark, un solo rol): label flotante primary sobre blanco
2.7 (con `opacity-80` ~2.3), `bg-error` + `text-default` 2.7 (light) / 2.3 (dark).

Tonal en 800/200 (antes 700/300): los labels flotantes se apoyan sobre el fondo
de la página, que en apps puede ser tintado (NeoPos: celeste `#c3dcf3`). Con 700
el label primary quedaba en 3.9:1 ahí; con 800 sube a 7.6:1. Todos los pares de
la tabla superan 4.9:1, incluido el seleccionado (tint /20).
