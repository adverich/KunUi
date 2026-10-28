## Bordes y superficies

- El panel flotante pasa a `bg-default` + `ring ring-default` (antes
  `bg-elevated` + `border border-default`, invisible en dark).
- Trigger, input de valor y selector de formato son **controles**:
  `bg-default` + `ring ring-inset ring-accented` (foco `ring-primary`). Antes
  `bg-muted` + `border border-default`.
- El tablero de previsualización interna (`checkerboard ... border-muted`) no
  cambia: `--kun-border-muted` (neutral-700) sí contrasta.
