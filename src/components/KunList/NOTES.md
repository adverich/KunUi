## Bordes y superficies

- El listado anidado (`sub`) marca el lado inicial con `border-s-2 border-primary`
  (antes `border-default`: sobre el fondo de página el acento no se percibía).
  Sigue siendo un trazo lógico (RTL correcto).
- `nav` mantiene `p-2 rounded-md`.

## Color y superficie del contenedor

- Nuevos props `color` (`KunColor | null`) y `variant` (`KunVariant | null`).
  Solo pinta la **capa de superficie** del `<ul>` (fondo + ring de
  `KUN_SURFACE_BG`, literal en `src/theme/kunVariants.ts`); el texto no se
  tiñe entero: eso lo hacen los ítems con la matriz completa.
- Fallback de defaults: prop > `kunTheme.configure({ defaults: { list: … } })`
  > `color: 'primary'`, `variant: 'soft'`.
- `bg` (clase Tailwind libre, ej. `bg-sky-900/60`) **gana** sobre
  color×variante para el fondo del contenedor cuando está definida.
- El contenedor siempre lleva `rounded-lg`; `nav` lo acota a `rounded-md`
  por especificidad de aparición posterior en el binding.
- El color resuelto se hereda a los ítems vía `kunListContext.color`
  (accesorio reactivo); un ítem puede sobreescribirlo con su propio `color`.

