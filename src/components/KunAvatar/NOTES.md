# KunAvatar

## Color y variante (alineado a `KunVariant`)

- `color`: `KunColor | null`; `null` hereda `kunTheme.configure({ defaults: { avatar } })`
  (fallback `neutral`). Nunca clases Tailwind crudas (`bg-green-500`): el color va
  por la matriz `KUN_VARIANT_CLASSES` (literal en `src/theme/kunVariants.ts`), que
  pinta fondo + texto del avatar.
- `variant`: estándar `KunVariant` (`solid | outline | soft | subtle | ghost | link`);
  `null` hereda theme (fallback `soft`). El default (sin color ni variante) queda
  `soft × neutral` = `bg-elevated text-default`, equivalente token-correcto del
  antiguo `bg-muted`.
- Mapeo legacy → nuevo (los valores viejos son error de validación):
  - `flat` → `solid ` (fondo pleno; antes `bg-${color}` + `bg-opacity-30` removido)
  - `tonal` → `soft`
  - `outlined` → `outline` (antes `border border-current`; hoy `outline` añade `ring`)
  - `text` → `ghost`
- Si el consumidor pasa una clase `bg-*` por `$attrs`, no se aplica la matriz
  (override manual explícito).
- `border` ya no recibe colores de paleta: `true | 'default' | 'muted' | 'accented' | 'inverted'`
  → `border border-<rol>` (tokens `--kun-border*`). Los avatares coloreados usan
  `color`, no `border-$color`.


## Tamaños

Escala canónica compartida: `xxs` (24px) · `xs` (28px) · `sm` (32px) ·
`md` (36px, default) · `lg` (40px) · `xl` (48px) · `xxl` (56px). Es la misma
que usan `KunBtn`, `KunIcon`, `KunListItemAvatar` y `KunDragAndDropHandle`
(fuente única: `src/theme/kunSizes.ts`).

Alias legacy con su px histórico: `3xs` (32px → `sm`), `2xs` (36px → `md`),
`2xl` (72px) y `3xl` (80px). Los nombres `xs`/`sm`/`md`/`lg`/`xl` cambiaron de
métrica: ver `docs/refactor/sizes.md` para migrar.

`density` mueve un paso de la escala (comfortable −1, compact −2, con piso en
`xxs`).

El ícono usa el tamaño compartido (50% del lado): `md` = 36px / 18px. En
tamaño numérico, el ícono se calcula como ~50% del px y el `font-size` como
~40%.

## Bordes y radio

`rounded` acepta `String | Number | Boolean` y se resuelve así:

- `tile`, `false` o `'none'` → `rounded-none`.
- string distinto de `'full'` (p. ej. `'md'`, `'lg'`) → `rounded-<valor>` (paso de
  la escala global).
- default (`undefined`) → `rounded-full`.

Cambio respecto al comportamiento anterior:

- **Antes**: cualquier `rounded` truthy (incluido `true`) forzaba `rounded-full`;
  el default era `rounded` pelado (4px fijos que no seguían `--kun-radius`).
- **Ahora**: el default es circular; `false` / `'none'` da cuadrado y un string da
  el paso de escala pedido.

Nota: en `KunToast` el `rounded` del `<KunAvatar>` es la prop booleana del avatar
(el chrome de la tarjeta lo aporta el consumidor vía `ui.root`).

## Círculo con dimensión custom

Si el avatar es circular (default o `rounded="full"`) y el consumidor pasa
`w-*`, `h-*` o `size-*`, se omite el `size-*` canónico y se agrega
`aspect-square`. Así `class="w-16"` y `class="h-16"` producen un círculo de
64px, no un óvalo.

Con `rounded="lg"`/`tile` no se fuerza 1:1: la dimensión custom se respeta como
en cualquier caja rectangular.
