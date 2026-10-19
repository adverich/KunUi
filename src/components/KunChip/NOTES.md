# KunChip

## Bordes y radio

- El chip es **siempre** `rounded-full` (forma píldora), sin importar `variant`.
- La variante `pill` ya no existe: el vocabulario de `variant` es el global
  (`solid|outline|soft|subtle|ghost|link`).
- La prop `pill` queda **reservada y sin efecto** (compat de API / documentación).

Migración: `variant="pill"` → `variant="solid"` (o el que corresponda); el
redondeo píldora ahora es implícito.

## Color

`color` + `textColor` se reemplazaron por `color`
(`primary|secondary|...|neutral`) + `variant`, resueltos con `kunVariantClasses`.
