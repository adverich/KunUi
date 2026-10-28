## Muesca del label flotante + desplazamiento por `rounded` (variante outline)

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
- Contorno por rol de la matriz `KunVariant` (con `color` resuelto, fallback
  `kunTheme.defaults.input`): `outline` → reposo `bg-default` con borde del
  overlay (`accented`/foco/fondo pleno); `soft` → `bg-elevated`; `subtle` →
  `bg-elevated ring ring-inset ring-accented`; `ghost`/`link` → transparente;
  `solid` → fondo pleno del color con texto contrastado. Foco y error usan
  ring literal por color (`KUN_FIELD_FOCUS_RING` / `KUN_FIELD_ERROR_RING`,
  en `src/utils/kunFieldVariant.ts`).
## Validación

- `error` (boolean, "estado de error visual") ahora marca el estado de verdad
  inmediatamente, incluso sin mensajes (además de `errorMessages` / `rules`).
- Eje migrado: la unión `'filled' | 'outlined' | 'underlined' | 'solo'` fue
  reemplazada por `KunVariant` canónico (los valores viejos son error de
  validación). El label flotante con muesca queda atado a `outline`.
