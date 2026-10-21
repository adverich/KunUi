# KunChip

## Bordes y radio

- Default: `rounded-full` (píldora).
- `rounded="full"`: círculo 1:1. Sin dimensiones custom el lado se calcula
  según contenido y densidad; con `w-*`/`h-*` se agrega `aspect-square`.
- `rounded="none"`: esquinas rectas.

La prop `pill` queda reservada y sin efecto: usar `rounded` para elegir forma.
El vocabulario de `variant` es el global
(`solid|outline|soft|subtle|ghost|link`).

Migración: `variant="pill"` -> `variant="solid"`; el redondeo píldora sigue
siendo el default.
## Color

`color` + `textColor` se reemplazaron por `color`
(`primary|secondary|...|neutral`) + `variant`, resueltos con `kunVariantClasses`.
