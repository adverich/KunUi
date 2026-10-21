## Control con caja (rediseño)

Antes el estado estaba dibujado por el glifo (`lucide:square` /
`square-check` / `square-minus`) y `color`/`baseColor` pintaban el **texto** del
root.

Ahora el control es una **caja** con el patrón de Nuxt UI:

- contorno `ring-1 ring-inset ring-accented`, `rounded-sm`;
- inactiva: `bg-elevated` (se lee sobre fondos oscuros; `bg-default` se
  confundía con la página en dark), con `baseColor` opcional;
- activa/indeterminada: `bg-primary text-highlighted` por defecto, salvo que
  el consumidor pase `color` (clases libres, p. ej. `bg-success text-highlighted`);
- con `iconColor` la caja queda neutra (`bg-elevated`) y el glifo se pinta con
  ese color: así un check verde/rojo no cae sobre `bg-primary` (verde sobre
  celeste era ilegible en dark);
- error: `ring-error`.

El glifo ya no lleva `opacity-70`: se dibuja a opacidad completa (`glow` suma
un `drop-shadow` al enfocar). Tamaño interno: sm `w-3 h-3`, md `w-3.5 h-3.5`,
lg `w-4 h-4`.

Los glifos por defecto pasan a `lucide:check` (activo), `lucide:minus`
(indeterminado) y **ninguno** (inactivo): el `square` propio ya no se dibuja
(la caja lo reemplaza). `trueIcon`/`falseIcon`/`indeterminateIcon` siguen
overrideando el glifo interior.

Ruptura: el estado activo ya no hereda el color del texto como color de glifo;
para colorear la caja pasar una clase de fondo en `color`
(ej. `color="bg-success text-highlighted"`, como en `KunRelationMatrix`).
La librería no aplica `text-inverted`; si el consumidor quiere ese
comportamiento, debe pasarlo manualmente en `color` o `class`.
