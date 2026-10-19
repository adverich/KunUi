## Atributos

Usa `inheritAttrs: false` y reenvía `$attrs` al contenedor interno: `@change`
/ `@click` e `id` / `aria-*` no se duplican en el DOM.

## Bordes y radio

- Contenedor `rounded-md`; chips con el nombre de archivo `rounded-sm`.
- Contorno por rol: el control va sobre `bg-default` con `ring ring-inset ring-accented`
  (variante `solo` → `bg-elevated` + ring). Antes `bg-muted` + `border border-default`,
  que en dark quedaba invisible (`--kun-border == --kun-bg-muted == neutral-800`).
  Foco `ring-2 ring-primary/25`; error `ring-error`.
