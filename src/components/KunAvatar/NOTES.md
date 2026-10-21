# KunAvatar

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
