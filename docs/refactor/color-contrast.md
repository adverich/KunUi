# Contraste de colores semánticos

Cada slot semántico (`primary|secondary|success|info|warning|error`) tiene
**cuatro roles** en lugar de un único `--kun-{slot}`. Fuente: `src/styles/theme.css`
(capa 2); espejo en runtime en `SEMANTIC_STOPS` de `src/theme/kunTheme.ts` y en
el generador `scripts/generate-color-compat.ts`.

| Rol | Token | Light | Dark | Utilidades |
|---|---|---|---|---|
| Superficie | `--kun-{slot}` | 400 | 700 | `bg-{slot}`, `hover:bg-{slot}/75` |
| Tonal | `--kun-{slot}-tonal` | 700 | 300 | `text-{slot}`, `ring-{slot}/NN`, `border-{slot}`, `outline-{slot}`, `divide-{slot}` |
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
| sky | light | 9.3 | 5.9 | 5.4 | 4.9 |
| sky | dark | 5.9 | 10.7 | 8.7 | 6.7 |
| blue | light | 7.6 | 6.8 | 6.3 | 5.7 |
| blue | dark | 6.8 | 9.8 | 8.1 | 6.3 |
| green | light | 11.3 | 4.9 | 4.6 | 4.3 |
| green | dark | 4.9 | 12.7 | 10.2 | 7.6 |
| amber | light | 11.7 | 5.0 | 4.7 | 4.5 |
| amber | dark | 5.0 | 12.3 | 10.0 | 7.7 |
| red | light | 7.0 | 6.4 | 5.8 | 5.2 |
| red | dark | 6.4 | 9.3 | 7.8 | 6.2 |

Antes (500 light / 400 dark, un solo rol): label flotante primary sobre blanco
2.7 (con `opacity-80` ~2.3), `bg-error` + `text-default` 2.7 (light) / 2.3 (dark).

Límite conocido: el estado seleccionado (tint /20) con `green`/`orange` en light
queda en 4.3–4.4, porque su stop 700 ya da apenas 4.9 sobre blanco. Las paletas
de marca con escala comprimida (p. ej. un 300 oscuro) pueden quedar por debajo
en dark: conviene que su 300 tenga L oklch ≥ 0.72.
