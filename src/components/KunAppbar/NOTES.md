## Bordes y superficies

- Superficie `bg-default` (antes `bg-elevated`), como el `header` de Nuxt UI.
- `bordered` pasa a **default `true`**: el header va siempre con
  `border-b border-default`. Con `bg-default` el borde es visible en light y dark
  (antes el borde quedaba sobre `bg-elevated`: en dark
  `--kun-border == --kun-bg-elevated == neutral-800` ⇒ invisible).
- `elevation` sigue opt-in; un header con sombra sobre `bg-default` puede verse
  redundante (Nuxt no la usa).

## Botón del drawer (default)

- Pasó de slot interno con `KunIcon size-6` a la prop `icon="$menuRounded"` de
  `KunBtn`: con ícono-only el botón es cuadrado automático y el ícono toma la
  escala canónica del `size` (50% del cuadrado; xs → 14px, no 24px). Antes el
  ícono casi tocaba el borde del círculo.
