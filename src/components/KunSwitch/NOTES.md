## Bordes y superficies

- `offColor` pasa a **`bg-accented`** (antes `bg-muted`): el track inactivo
  quedaba invisible en dark porque `--kun-bg-muted == --kun-bg-elevated ==
  --kun-border == neutral-800`. `bg-accented` (neutral-700) contrasta tanto sobre
  `bg-default` como sobre `bg-elevated`/`bg-muted`.
- `onColor` (`bg-success`) y `iconColor` (thumb, `bg-inverted`) no cambian.

## Tamaños

`KunSwitch` conserva geometría propia de track rectangular: los nombres
`xxs`…`xxl` no equivalen al cuadrado/altura de la escala compartida. El ícono
del thumb sí usa `KUN_TEXT_SIZE` para mantener la tipografía alineada.
