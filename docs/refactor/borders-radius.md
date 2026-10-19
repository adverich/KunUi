# Bordes y radio: estandarización contra Nuxt UI

Estado: implementado (pendiente de publicar al escribir esta nota).

## Objetivo

Unificar **dos** dimensiones del trazo en todos los componentes y dejar el
vocabulario alineado con Nuxt UI (integración Vue):

1. **Radio**: cada familia de componente usa un paso fijo de la escala global.
2. **Color de borde**: un único juego de roles (`border-default`, `border-muted`,
   `border-accented`, `border-inverted`) que sigue los tokens `--kun-border*`.

## Regla de oro: nunca `rounded` pelado

Tailwind define `.rounded { border-radius: .25rem }` como valor **literal**,
mientras que las clases de escala (`rounded-sm|md|lg|...`) resuelven contra los
tokens `--radius-*` que sí escalan con `--kun-radius`:

```css
--radius-sm: var(--kun-radius);                /* 0.25rem por defecto */
--radius-md: calc(var(--kun-radius) * 1.5);
--radius-lg: calc(var(--kun-radius) * 2);
```

Consecuencia: un `rounded` pelado **rompe el escalado global** (queda clavado en
4px aunque el consumidor suba `--kun-radius`). Se eliminaron todos los usos en
`src/components/**/src/**` y en los playgrounds. Escala resultante con el default
`--kun-radius: 0.25rem`:

| clase | valor | uso |
|-------|-------|-----|
| `rounded-sm` | 4px | badges, tooltips, kbd, chips internos |
| `rounded-md` | 6px | controles (botón, input, select) e ítems (menú, lista) |
| `rounded-lg` | 8px | contenedores (card, dialog, drawer, panel, wrapper de tabla) |
| `rounded-xl` | 12px | — (sin uso en la librería) |
| `rounded-full` | píldora | avatar, chip, switch, radio, slider, badge `pill` |

La escala es **idéntica** a la de Nuxt UI (`src/templates.ts`,
`@theme default inline`): mismo factor 0.5/1/1.5/2/3/4/6 sobre `--ui-radius`.

## Tokens de color (`src/styles/theme.css`)

Antes/después de los roles que estaban desalineados:

| token | light antes | light ahora | dark antes | dark ahora |
|-------|-------------|-------------|------------|------------|
| `--kun-border` | neutral-300 | **neutral-200** | neutral-600 | **neutral-800** |
| `--kun-border-muted` | neutral-200 | neutral-200 | neutral-700 | neutral-700 |
| `--kun-border-accented` | neutral-300 | neutral-300 | neutral-500 | **neutral-700** |
| `--kun-border-inverted` | neutral-900 | neutral-900 | white | white |

Valores verificados contra `nuxt/ui@v4 src/runtime/index.css`: light
border 200 / muted 200 / accented 300 / inverted 900; dark border 800 /
muted 700 / accented 700 / inverted white. Nota: en dark `muted == accented`
(igual que Nuxt UI).

### Paridad de roles derivados

Nuxt UI deriva `ring`/`divide`/`outline`/`stroke`/`fill`/`bg-border` de los
mismos tokens. Se completaron los que faltaban en el bridge `@theme`:

- nuevos: `--ring-color-bg`, `--ring-offset-color-{default,muted,accented,inverted,bg}`,
  `--divide-color-{muted,accented,inverted,bg}`, `--stroke-{bg,default,inverted}`,
  `--fill-{bg,default,inverted}`, `--background-color-border`.
- ya existían: `--border-color-{default,muted,accented,inverted}`,
  `--ring-color-{default,muted,accented,inverted}`, `--outline-color-{default,inverted}`,
  `--divide-color-default`.

Efecto: quedan disponibles `ring-default`, `ring-offset-muted`, `divide-accented`,
`stroke-default`, `fill-inverted`, `bg-border`, etc.

## Vocabulario aplicado

| componente | antes | ahora |
|------------|-------|-------|
| `KunBtn` | prop `rounded` = `'rounded-lg'` | `'full' \| 'none' \| null` → `rounded-md` |
| `KunBadge` | `rounded-full` fijo | `rounded-sm`; `pill` (nueva) o `rounded="full"` → full; `'none'` → none |
| `KunChip` | `rounded-md` (variante `pill` para full) | siempre `rounded-full`; prop `pill` reservada sin efecto |
| `KunAvatar` | `rounded` (4px) / `rounded-full` si `rounded` truthy / `none` si `tile` | `rounded-full` por defecto; `false`/`'none'` → none; `'md'`/`'lg'`… → `rounded-<v>` |
| `KunCard` | `rounded-lg` (default `rounded: true`) | sin cambio |
| `KunCardTitle` | `rounded-md` | sin cambio |
| `KunMenu` | `rounded-b` | `rounded-md` |
| `KunDialogContent` | `rounded-xl` | `rounded-lg` |
| `KunDrawer` | `rounded-r` / `rounded-l` | `rounded-e-lg` / `rounded-s-lg` |
| `KunToolbar` | `rounded` | `rounded-lg` |
| `KunToast` | `border-l-4` ×6; barra `rounded-b`; cerrar `rounded` | `border-s-4`; barra `rounded-b-[inherit]`; cerrar `rounded-md` |
| `KunFileInput` | contenedor `rounded`, chip `rounded` | contenedor `rounded-md`, chip `rounded-sm` |
| `KunText*Field` / `KunTextarea` / `KunNumberField` | default `'rounded'` | default `'rounded-md'` |
| `KunSelect` / `KunAutocomplete` | `rounded-t` con menú abierto | `rounded-md rounded-b-none` |
| `KunDatePicker` | panel `rounded-xl`, celdas año/mes `rounded-lg` | panel `rounded-lg`, celdas `rounded-md` |
| `KunColorPicker` | trigger/inputs `rounded-lg`, panel `rounded-xl` | trigger/inputs `rounded-md`, panel `rounded-lg` |
| `KunTooltip` | default `'rounded'` | default `'rounded-sm'` |
| `KunTable` / `KunTableServerSide` | wrapper/search/spans `rounded` | wrapper `rounded-lg`, search/acciones `rounded-md` |
| `KunTableFooter` | `rounded` + dropdown `border rounded` | `rounded-md` + `border border-default rounded-md` |
| `KunRelationMatrix` | 4× `border-b` sin color | `border-b border-default` |

## Asignación de contornos por rol (superficies vs controles)

Segunda pasada: se auditó `nuxt/ui@v4` (`src/theme/*.ts`) para ver **sobre qué
superficie** va cada contorno y se reasignó en KunUI. Regla central: en dark
`--kun-bg-muted == --kun-bg-elevated == neutral-800` y `--kun-border ==
neutral-800`, por lo que **`border-default`/`ring-default` nunca debe ir sobre
`bg-muted`/`bg-elevated`** (mismo color ⇒ invisible). Nuxt usa exactamente los
mismos valores: el borde no es un problema de token sino de **ubicación**.

| rol | superficie | contorno (Nuxt) | KunUI tras la pasada |
|-----|------------|------------------|----------------------|
| Superficie flotante (menú, date/color picker, dialog, popover, dropdowns) | `bg-default` | `ring ring-default` | igual (antes `bg-elevated` + `border border-default`) |
| Chrome docked (Appbar, Drawer, Toolbar) | `bg-default` | `border-b`/`border-e`/`border-s` `border-default` | igual; `bordered`/`border` **default `true`** |
| Card/panel `outlined` | `bg-default` | `ring ring-default` | `ring ring-default` (antes `border border-default` sobre `bg-elevated`) |
| Control (TextField, Textarea, NumberField, FileInput, Select, ColorPicker, Table search) | `bg-default` | `ring ring-inset ring-accented` / notch `border-accented` | igual (antes `bg-muted` + `border-default`) |
| Ítem/fila (Table, RelationMatrix) | `bg-default` | `divide-y divide-default`, hover `bg-elevated/50` | fila `bg-default`, hover `bg-elevated/50`, thead `bg-elevated` |
| ListItem/ToolbarItems `outlined` | — | `ring ring-accented` | `ring ring-accented` |
| `KunSwitch` track off | — | `bg-accented` | `bg-accented` (antes `bg-muted`) |
| `KunCheckbox` | — | caja `ring ring-inset ring-accented`, activa `bg-primary text-inverted` | caja nueva (antes glifo `square`/`square-check`) |
| `KunTooltip` | `bg-default` | `bg-default ring ring-default` | `bg-default text-highlighted ring ring-default` (antes `bg-inverted`) |

Componentes reasignados: `KunMenu`, `KunDatePicker`, `KunColorPicker`,
`KunDialogContent`, `KunTableFooter`, `KunSelect`/`KunAutocomplete` (create-item),
`KunAppbar`, `KunDrawer`, `KunToolbar`, `KunTooltip`, `KunCard`, `KunListItem`,
`KunToolbarItems`, `KunTable`/`KunTableServerSide`/`KunTableHeaders`/`KunTableRow`,
`KunTextField`, `KunTextarea`, `KunNumberField`, `KunFileInput`, `KunSwitch`,
`KunCheckbox`, `KunList`, `KunRelationMatrix`. `src/App.vue` pasa a `bg-default`
(el chrome y la página comparten color; la separación la da el borde).

### Ruptura adicional

- `KunAppbar.bordered`, `KunToolbar.bordered` y `KunDrawer.border` pasan a
  **`true`** por defecto (borde siempre visible, como Nuxt).
- `KunTooltip` deja de ser `bg-inverted` (alto contraste) → `bg-default`.
- `KunCheckbox` cambia el glifo por una **caja con ring**; `color`/`baseColor`
  ahora tiñen la caja activa/inactiva (para el estado activo, pasar p.ej.
  `bg-success text-inverted`).
- `KunSwitch.offColor` por defecto `bg-accented`.

## Lados lógicos (RTL)

Se migraron los trazos direccionales a propiedades lógicas:

- `KunToast.vue`: `border-l-4` → `border-s-4` (6 toasts: distintas variantes usan
  el mismo template).
- `KunList.vue`: `pl-4 border-l-2` → `ps-4 border-s-2 border-default`.
- `KunNumberField.vue`: `border-r`/`border-l` → `border-e`/`border-s`;
  `rounded-l-[inherit]`/`rounded-r-[inherit]` → `rounded-s-[inherit]`/`rounded-e-[inherit]`.
- `KunDrawer.vue`: `rounded-r`/`rounded-l` → `rounded-e-lg`/`rounded-s-lg`
  (`isStart` = lado inicial → redondea el lado **final**).

Excepción documentada: la flecha de `KunTooltip` (`useTooltip.ts`) mantiene
aristas **físicas** (`border-t`/`border-l` + rotación 45°) porque su orientación
depende de `location` físico, no del flujo de texto.

## Notch del fieldset (`src/utils/useKunFieldNotch.ts`)

La escala de radios usada para calcular el corte del label estaba
desactualizada (incluía `5xl`/`6xl`, no `3xl`):

- `ROUNDED_SCALE`: 9 entradas → **8** (`none, sm, md, lg, xl, 2xl, 3xl, full`).
- `ROUNDED_STEPS_PX`: `[0,2,4,6,8,12,16]` → **`[0,4,6,8,12,16,24]`** (px reales de
  la escala nueva; `full` se resuelve con la caja, no con el índice).
- alias `'rounded'` → `rounded-sm` (compat con consumidores que pasen el valor viejo).

Efecto visual: para `rounded-md` el label se desplaza 4px en vez de 6px.

## Excepciones (intencionales)

- `border-current` en `KunDivider` (y los bordes de variante `outline`): el color
  lo hereda el `text-*` de la variante, no un rol de borde.
- `border-white/*` en `KunCarousel/examples/_demos/DemoHoverSplit.vue`: overlays
  sobre imagen, no UI de superficie.
- `KunDatePicker`: el día seleccionado es `rounded-full` y el rango usa
  `rounded-none` — geometría propia del calendario (círculo + segmento), no sigue
  el vocabulario de ítems.

## Ruptura de compatibilidad y migración

Cambio **visual global**: badges dejan de ser píldora por defecto, botones/cards/
menús/dialogs/toasts cambian de radio y los bordes neutros se aclaran en light y
se oscurecen en dark. Impacta a NeoPosPos y NeoPosEcommerce.

- `KunBadge`: el pill ahora es opt-in → añadir `pill` donde se esperaba píldora.
- `KunBadge.rounded` ya no acepta clases Tailwind (`'rounded-2xl'`): solo
  `'full' | 'none' | null`.
- `KunBtn.rounded` ya no acepta clases: solo `'full' | 'none' | null`.
- `KunChip`: la variante `pill` desapareció (siempre es píldora).
- `KunAvatar.rounded`: `true` ya **no** fuerza `rounded-full` (es el default);
  para circular explícito usar el default; `false`/`'none'` = cuadrado.

Requiere bump de versión + nota de migración.

## Verificación

- `pnpm run typecheck` → 0.
- `pnpm run build` → OK.
- Grep de control: 0 clases `rounded` peladas y 0 `rounded-xl`/`2xl`/`3xl` en
  `src/components/**/src/**`.
- `pnpm run dev` → `/examples/KunTheme` moviendo el slider de `--kun-radius`
  (0.25 → 0.5rem) para confirmar que toda la UI escala; recorrido de los
  playgrounds tocados (Badge, Avatar, Chip, Table, Toast, Menu, FileInput,
  NumberField, DatePicker, ColorPicker, Drawer).
