## Comportamiento

Mismo sistema de `item-value` / `item-title` / `returnObject` / `multiple`
que `KunAutocomplete`, pero con campo `readonly`: click o Enter/Espacio
abre el menú. Sin búsqueda ni filtrado.

## Bordes y radio

- Con el menú abierto el campo pasa a `rounded-md rounded-b-none` (antes
  `rounded-t`, que dejaba los lados sin la escala global).
- El ítem "crear" del menú separa con `border-b border-muted` (antes
  `border-default`, invisible sobre `bg-muted` en dark).
