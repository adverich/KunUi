## Atributos

Usa `inheritAttrs: false` y reenvía `$attrs` al contenedor interno: `@change`
/ `@click` e `id` / `aria-*` no se duplican en el DOM.

## Bordes y radio

- Contenedor `rounded-md`; chips con el nombre de archivo `rounded-sm`.
- Contorno por matriz `KunVariant` (con `color`, fallback
  `kunTheme.defaults.input`): `subtle` → `bg-elevated ring ring-inset ring-accented`
  (default); `outline` → `bg-default` + mismo ring; `soft` → `bg-elevated`;
  `ghost`/`link` → transparente; `solid` → fondo pleno del color con texto
  contrastado. Foco y error: ring literal por color (`KUN_FIELD_FOCUS_RING`
  / `KUN_FIELD_ERROR_RING`, en `src/utils/kunFieldVariant.ts`). Antes
  `bg-muted` + `border border-default`, que en dark quedaba invisible
  (`--kun-border == --kun-bg-muted == neutral-800`).
- Eje migrado: la unión `'filled' | 'outlined' | 'solo'` fue reemplazada
  por el `KunVariant` canónico (los valores viejos son error de validación).
