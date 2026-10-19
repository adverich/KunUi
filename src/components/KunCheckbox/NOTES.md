## Control con caja (rediseño)

Antes el estado estaba dibujado por el glifo (`lucide:square` /
`square-check` / `square-minus`) y `color`/`baseColor` pintaban el **texto** del
root.

Ahora el control es una **caja** con el patrón de Nuxt UI:

- contorno `ring-1 ring-inset ring-accented` sobre `bg-default`, `rounded-sm`;
- activa/indeterminada: `bg-primary text-inverted` por defecto, salvo que el
  consumidor pase `color` (clases libres, p. ej. `bg-success text-inverted`);
- inactiva: `bg-default`, con `baseColor` opcional;
- error: `ring-error`.

Los glifos por defecto pasan a `lucide:check` (activo), `lucide:minus`
(indeterminado) y **ninguno** (inactivo): el `square` propio ya no se dibuja
(la caja lo reemplaza). `trueIcon`/`falseIcon`/`indeterminateIcon` siguen
overrideando el glifo interior.

Ruptura: el estado activo ya no hereda el color del texto como color de glifo;
para colorear la caja pasar una clase de fondo en `color`
(ej. `color="bg-success text-inverted"`, como en `KunRelationMatrix`).
