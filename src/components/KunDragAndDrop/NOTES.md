## Modelo data-first (inspirado en FormKit Drag and Drop)

El array es la fuente de verdad. HTML5 nativo, sin dependencias.

```vue
<KunDragAndDrop v-model="todo" group="kanban" />
<KunDragAndDrop v-model="done" group="kanban" />
```

## Scroll durante drag

HTML5 DnD bloquea la rueda del mouse. Con `autoScroll` (default), acercar
el puntero al borde del ancestro `overflow: auto|scroll` más cercano
desplaza la vista. No depende de la rueda.

## Contrato del composable headless

```js
const [parentRef, items, updateConfig] = useKunDragAndDrop(
  [{ id: 1, title: 'A' }],
  { group: 'board', dragHandle: '[data-kun-dnd-handle]' }
)
```

1 valor del array = 1 hijo inmediato del parent, con `data-kun-dnd-item` y
`data-kun-dnd-key` (o `KunDragAndDropItem`).
