# KunAvatar

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
