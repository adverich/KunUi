# Migración al theme global KunUI (ruptura total)

Guía para `@pos`, ecommerce y cualquier consumidor de `adverich-kun-ui`.
Rige desde la versión que incluye `src/theme/kunTheme.ts` (Fases A–E del plan
`docs/refactor/theme-global-plan.md`).

## Qué cambió

- `colors.css` / `clases.css` eliminados. Los tokens viven en `src/styles/theme.css`
  (`--kun-*` + puente `@theme default inline` a utilidades sin prefijo).
- Props libres `bgColor` / `textColor` / `borderColor` eliminadas. Reemplazo:
  `color: KunColor` (`primary | secondary | success | info | warning | error | neutral`)
  + `variant: KunVariant` (`solid | outline | soft | subtle | ghost | link`).
- Superficies fijas por rol: `bg-elevated`, `bg-muted`, `bg-default`,
  `text-default`, `text-muted`, `border-default`. Tooltips: `bg-inverted text-inverted`.
- `KunBtn`: `default→solid`, `outlined→outline`, `soft→soft`, `tonal→subtle`,
  `text`/`plain`→`ghost`. `rounded` solo `full | none` (`undefined` = escala global).
- `KunChip`: `default→solid`, `outlined→outline`, `flat→soft`, `pill`→ prop `pill`.
- `KunAlert`: `color` + `variant` (default `error/solid`). Se eliminan
  `bgColor`, `textColor`, `borderColor`, `iconBgColor`.
- `KunDialog` / `KunMenu` / `KunDrawer` / `KunCard` / `KunToolbar` / `KunAppbar`:
  fondo fijo por rol, sin props de color (ver READMEs regenerados).
- Fields (`KunTextField`, `KunTextarea`, `KunNumberField`, `KunSelect`,
  `KunAutocomplete`): fondo `bg-muted`, borde `border-default`, foco
  `border-primary`, label flotante `text-primary`, error `text-error`/`border-error`.
  Se eliminan `bgInput`, `borderColor`, `textColor`, `labelColor`,
  `floatingLabelColor`, `placeholderColor`, `bgMenuColor`, `bgItemListColor`,
  `selectedItemListColor`, `hoverItemListColor`.
- `KunListItem`: `activeClass` / `bgItems` / `hoverBg` eliminados
  (activo = `bg-accented`, hover = `hover:bg-elevated`).
- `KunBadge`: `color` semántico (default `error`). `KunTooltip`: invertido fijo.

## Mapa rápido de clases (ver §9 del plan para la tabla completa)

| Antes | Ahora |
|---|---|
| `bg-button` + `hover:bg-button-hover` | `variant="solid"` (`bg-primary` + `hover:bg-primary/75`) |
| `bg-background` / `bg-surface` / `bg-surface-light` | `bg-muted` (fondos suaves) o `bg-default` (base) |
| `bg-surface-dark` / `bg-card` / `bg-menu` / `bg-drawer` | `bg-elevated` |
| `text-ui` / `text-ui-selection` | `text-default` |
| `text-ui-muted` / `placeholder-ui` | `text-muted` |
| `text-ui-inverse` | `text-inverted` |
| `border-ui` / `border-surface` | `border-default` |
| `field-border-focus` / `ring-ui-focus` | `focus-visible:outline-primary/25` |

## @pos: color por negocio en runtime (sin rebuild)

```ts
import { kunTheme } from 'adverich-kun-ui'

// Opción A: nombre del catálogo Tailwind
kunTheme.setPrimary('blue')
kunTheme.setNeutral('slate')
```

Alcance del catálogo por contrato CSS:

- `theme.css` trae el catálogo completo (22 paletas × 11 paradas) vía
  `@source inline`, así que cualquier nombre resuelve en ambos contratos:
  - `@import "adverich-kun-ui/theme.css"` en el CSS propio de la app
    (contrato principal, recomendado): el build de la app compila el mismo
    `@source` y emite el catálogo.
  - `adverich-kun-ui/dist/adverich-kun-ui.css` (standalone): ya viene compilado
    con el catálogo completo.
- Solo un nombre fuera del catálogo (y no registrado) devuelve `false` sin
  escribir nada (igual que un nombre desconocido).

```ts
// Opción B: HEX del negocio (ej. al cambiar de tenant) — funciona en ambos contratos
if (kunTheme.registerPalette('brand', tenant.brandHex)) {
  kunTheme.setPrimary('brand') // solo si el registro devolvió true
}
// Si el HEX es basura, no se escribe nada y la UI sigue igual.

// Opcionales
kunTheme.setRadius('0.75rem')
kunTheme.setFont({ sans: 'Inter, system-ui, sans-serif' })
kunTheme.setColorMode('dark') // o 'light' | 'system'; default: light-only
```

Con `app.use`:

```ts
app.use(KunUI, {
  theme: { primary: 'sky', neutral: 'slate', radius: '0.25rem', colorMode: 'light' },
})
```

## Anti-FOUC (reponer theme persistido antes del primer paint)

```html
<script>
(function () {
  try {
    var p = localStorage.getItem('kun:theme:primary');
    var n = localStorage.getItem('kun:theme:neutral');
    var r = localStorage.getItem('kun:theme:radius');
    var m = localStorage.getItem('kun:theme:colorMode');
    var doc = document.documentElement;
    // p/n guardan "nombre" o "nombre:HEX" (ver kunTheme.restore)
    window.__KUN_THEME_BOOT__ = { primary: p, neutral: n, radius: r, colorMode: m };
    if (r) doc.style.setProperty('--kun-radius', r);
    var dark = m === 'dark';
    doc.setAttribute('data-theme', dark ? 'dark' : 'light');
    doc.classList.toggle('dark', dark);
    if (dark) doc.style.setProperty('color-scheme', 'dark');
  } catch (e) { /* sin storage */ }
})();
</script>
```

Luego, al arrancar la app, `kunTheme.restore()` re-registra paletas custom
(`nombre:HEX`) y repone los alias completos. La librería no inyecta este
script sola.
