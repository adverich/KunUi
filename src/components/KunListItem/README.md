# KunListItem

> Single KunList item.
>
> Ítem individual de KunList.

## Uso · Usage

```vue
<script setup>
import { KunListItem } from 'adverich-kun-ui'
</script>

<template>
  <KunListItem />
</template>
```

> Con `app.use(KunUI)` el componente queda registrado globalmente y no hace falta importarlo. · With `app.use(KunUI)` the component is globally registered, no import needed.

## Props

| Propiedad · Prop | Tipo · Type | Defecto · Default | Descripción · Description |
|---|---|---|---|
| `value` | `String \| Number \| Boolean \| Object \| Array \| null` | `-` | Valor del ítem (selección y eventos). Acepta cualquier tipo. |
| `to` | `String \| Object` | `-` | Ruta Vue Router (renderiza router-link). |
| `href` | `String` | `-` | URL externa (renderiza <a>). |
| `replace` | `Boolean` | `-` | Navegación con replace (solo con `to`). |
| `tag` | `String` | `'li'` | Tag del contenedor. |
| `disabled` | `Boolean` | `-` | Deshabilita el ítem. |
| `active` | `Boolean` | `-` | Marca el ítem como activo. |
| `selectable` | `Boolean` | `false` | Permite selección (emite toggle al contexto KunList). |
| `color` | `KunListItemColor` | `null` | Color semántico del item. `null` hereda el color resuelto de la KunList contenedora. |
| `variant` | `KunListItemVariant` | `'ghost'` | Variante visual (matriz `KunColor x KunVariant` de `kunVariants.ts`). |
| `density` | `KunListItemDensity` | `'default'` | Densidad del padding vertical.<br/>Valores · Values: `default` `comfortable` `compact` |
| `rounded` | `Boolean` | `true` | Redondeo de escala (`rounded-md`). `tile` lo anula. |
| `tile` | `Boolean` | `-` | Sin redondeo. |
| `ripple` | `Boolean \| Object` | `true` | Efecto ripple al hacer click. |
| `noGutters` | `Boolean` | `-` | Sin padding horizontal. |
| `itemPosition` | `String` | `'items-start'` | Alineación vertical del contenido. |
| `prependIcon` | `String \| Object \| Function` | `-` | Ícono al inicio (string, componente o slot `prepend`). |
| `prependAvatar` | `String` | `-` | Avatar al inicio (URL de imagen). |
| `prependClass` | `String` | `-` | Clase del contenedor del prepend. |
| `appendIcon` | `String \| Object \| Function` | `-` | Ícono al final (string, componente o slot `append`). |
| `appendAvatar` | `String` | `-` | Avatar al final (URL de imagen). |
| `appendClass` | `String` | `-` | Clase del contenedor del append. |
| `title` | `String \| Number \| Boolean` | `-` | Título (alternativa al slot). |
| `titleClass` | `String` | `'font-medium'` | Clase del título. |
| `subtitle` | `String \| Number \| Boolean` | `-` | Subtítulo (alternativa al slot). |
| `subtitleClass` | `String` | `'text-sm text-muted'` | Clase del subtítulo. |
| `containerClass` | `String \| Array \| Object` | `''` | Clase extra del contenedor. |
| `id` | `String \| Number` | `-` | Id del ítem (se genera uno si se omite). |

## Modelos · Models

- `v-model:selected` (`any`, defecto · default: `-`)

## Eventos · Events

- `click`

## Slots

- `#prepend`
- `#default`
- `#title`
- `#subtitle`
- `#append`

## Notas · Notes

## Bordes y superficies

- `variant="outline"` usa la matriz `KunColor x KunVariant` de
  `kunVariants.ts` (ring del color, patrón Nuxt UI). El trazo neutral previo
  podía quedar invisible sobre superficies del mismo tono en dark.

## Color y variantes (breaking change de `variant`)

- **`variant`** pasa de la unión `text|outlined|elevated|tonal|flat|plain`
  a la estándar `KunVariant` (`solid|outline|soft|subtle|ghost|link`).
  Mapeo mental: `outlined→outline`, `tonal→soft`, `elevated→solid`,
  `flat/plain/text→ghost` (default nuevo: `ghost`).
- Antes solo `outlined` se distinguía; ahora cada variante pinta con el
  color resuelto (`kunVariantClasses`, 42 pares literales).
- **Nuevo prop `color: KunColor | null`**: default `null` = hereda el color
  resuelto de la `KunList` contenedora (inject `kunListContext.color`).
- Fallback: prop del ítem > color resuelto de la lista > `'primary'`.
- Estado activo/seleccionado: reemplaza el `bg-accented` previo por
  `bg-{color}/15!` + `ring-inset` (`KUN_SELECTED_CLASSES`). El modificador
  `!` es intencional: variantes y estado son literales iguales en
  especificidad, el estado debe ganar.
- Hover de ítem seleccionable: `KUN_HOVER_CLASSES` del color (reemplaza
  `hover:bg-elevated` fijo).
- **`v-model:selected` en el ítem**: valor único compartido entre ítems
  → solo el que coincide queda resaltado (single). Sin v-model, cada
  ítem mantiene su valor interno (menús, uso suelto). Prioridad: lista
  gestionando selección > v-model del ítem. `null` = sin selección.
- **Selección sin lista**: si el ítem está suelto (sin `KunList`
  contenedora) o la lista no es `selectable`, el click escribe el
  v-model propio del ítem, para que `selectable` siempre
  resalte el ítem. Con lista gestionando selección (contexto) se usa
  `v-model:selected` de la lista como única fuente de verdad.
- El estado seleccionado es deliberadamente notorio: `bg-{color}/25` +
  `ring inset {color}/50` (antes era un 15% apenas perceptible).

## Slots e interacción (fixes internos)

- **Slot `append` solo**: el contenedor de append en
  `KunListItemInner.vue` se renderizaba solo con `appendIcon`/
  `appendAvatar`; un `<template #append>` sin esas props no montaba el
  contenedor y el contenido no aparecía. Ahora la condición es
  `hasAppend || $slots.append` (paridad con la rama de prepend, que ya
  verificaba `$slots.prepend`).
- **Fallback de avatar en `append`**: el avatar del fallback no aplicaba
  `appendClass` (el de prepend sí aplicaba `prependClass`) y hardcodeaba
  `w-8 h-8`. Ahora aplica `appendClass`; el tamaño queda en manos de la
  clase si se pasa.
- **Teclado**: el ítem (`role="option"`) solo respondía a `Enter`. Se
  agregó `keydown.space.prevent` en ambas ramas (link y simple) para
  seleccionar con Space.
- `kunListItemProps.ts`: se eliminó el comentario TSDoc huérfano
  («Coincidencia exacta de ruta activa.») que quedaba antes de `tag`.

## Limitaciones conocidas

- **`rounded` es `Boolean`** a diferencia del resto de la lib (props de
  clase Tailwind): `true` → `rounded-md`, `tile` gana con
  `rounded-none`. Cambiar a unión literal de escala sería breaking;
  mantener hasta decisión de release.
- **`ripple` es pasivo** con default `true`: solo aporta
  `relative overflow-hidden`, no hay efecto ripple animado real.

---

_Generado por · Generated by `scripts/generate-docs.ts`. No editar a mano · Do not edit by hand._

Machine-readable: `registry.json` → `KunListItem`.
