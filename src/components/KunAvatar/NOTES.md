# KunAvatar

## Tamaños

Escala: `3xs` (32px) · `2xs` (36px) · `xs` (40px) · `sm` (44px) · `md` (48px,
default) · `lg` (56px) · `xl` (64px) · `2xl` (72px) · `3xl` (80px).

Los nombres previos (`x-small`, `small`, `default`, `large`, `x-large`) se
eliminaron: usar la escala nueva o `size` numérico en px.

`density` mueve un paso de la escala (comfortable −1, compact −2, con piso en
`3xs`).

El ícono hereda el `text-*` del tamaño (`size-[1em]`), por lo que escala junto
con el avatar. En tamaño numérico, el `font-size` se calcula como ~40% del px.

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
