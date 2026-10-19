## Muesca del label flotante + desplazamiento por `rounded` (variante outlined)

Igual que `KunTextField`/`KunNumberField`, vía el composable compartido
`useKunFieldNotch` (`src/utils/useKunFieldNotch.ts`): el overlay dibuja el
borde nativo completo (respeta cualquier `rounded`, pill incluida;
`roundedClass` = `fieldsetRoundedClass`) y la muesca se recorta con `mask`
sobre la caja real del label (medida por JS + `ResizeObserver`). Hueco real
en cualquier fondo, sin `fieldset`/`legend`. El label flotante se desplaza
2px por escalón de `rounded`.

## Bordes y radio

- Default de `rounded`: `'rounded-md'` (antes `'rounded'` pelado).
- `textareaClasses` y el borde del fieldset derivan ahora de
  `fieldsetRoundedClass`, sin claves `rounded` / `rounded-none` paralelas.
- La barra de carga interna usa `rounded-md`.
- Contorno por rol: `filled` → `bg-default border-accented`; `outlined`/`underlined`
  → `border-accented`; `solo` → `bg-elevated ring ring-inset ring-accented`; notch
  `border-accented` (fin del hack `dark:border-muted`).
