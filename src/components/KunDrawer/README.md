# KunDrawer

Componente de UI KunDrawer.

## Uso

```vue
<script setup>
import KunDrawer from '@/components/KunDrawer/KunDrawer.vue';
</script>

<template>
  <KunDrawer />
</template>
```

## Props

| Nombre | Tipo | Valor por defecto | Descripción |
|---|---|---|---|
| modelValue | Boolean | - |  |
| absolute | Boolean | - |  |
| color | String | - |  |
| floating | Boolean | - |  |
| image | String | - |  |
| location | Object | - |  |
| permanent | Boolean | - |  |
| persistent | Boolean | - |  |
| rail | Boolean | - |  |
| railWidth | Object | - |  |
| scrim | Object | - |  |
| tag | Object | - |  |
| temporary | Boolean | - |  |
| width | Object | - |  |
| fullHeight | Boolean | - |  |
| scrollable | Object | - |  |
| swipeable | Object | - |  |
| swipeThreshold | Object | - |  |
| swipeEdgeSize | Object | - |  |
| swipeTransition | Object | - |  |
| swipeHandleSize | Object | - |  |
| swipeMinVelocity | Object | - |  |
| scrimTransition | Object | - |  |
| animationDuration | Object | - |  |
| animationEasing | Object | - |  |
| peekSize | Object | - |  |


## Eventos

- `update:model-value`
- `update:modelValue`
- `swipe-start`
- `swipe-move`
- `swipe-end`


## Dependencias

- src/utils
