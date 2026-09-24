# KunDragAndDrop

Data-first drag and drop alineado a [FormKit Drag and Drop](https://drag-and-drop.formkit.com):
`performSort` por índice del target, validación anti-loop (`currentTarget` + threshold), handles con armado en `pointerdown` (FormKit #139).

## Uso declarativo

```vue
<script setup>
import { ref } from 'vue'
import { KunDragAndDrop } from 'adverich-kun-ui'

const items = ref([
  { id: 1, title: 'Uno' },
  { id: 2, title: 'Dos' },
])
</script>

<template>
  <KunDragAndDrop v-model="items" />
</template>
```

## Uso headless

```js
import { useKunDragAndDrop } from 'adverich-kun-ui'

const [parent, items, updateConfig] = useKunDragAndDrop(
  [{ id: 1, title: 'A' }, { id: 2, title: 'B' }],
  { group: 'board' }
)
```

Renderizá `items` como hijos inmediatos de `parent` y marcá cada ítem con `data-kun-dnd-item` + `data-kun-dnd-key` (o usá `KunDragAndDropItem`).

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| modelValue / items | Array | - | Lista ordenada |
| itemKey | String/Function | `'id'` | Clave estable |
| group | String | null | Transfer entre parents con el mismo group |
| sortable | Boolean | true | Permite reordenar |
| disabled | Boolean | false | Desactiva DnD |
| dragHandle | String | null | Selector CSS del handle (null = ítem completo) |
| itemDraggable | Function | null | `(item) => boolean` |
| layout | `'list'` \| `'grid'` | `'list'` | Solo CSS |
| draggingClass | String | `'opacity-50'` | Clase mientras se arrastra |
| tag | String | `'div'` | Tag del contenedor |

## Eventos

`update:modelValue`, `update:items`, `drag-start`, `drag-end`, `sort`, `transfer`

## Subcomponentes

- `KunDragAndDropItem` — wrapper de ítem
- `KunDragAndDropHandle` — agarre (`data-kun-dnd-handle`)
