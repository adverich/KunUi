# KunRelationMatrix

Componente de UI KunRelationMatrix.

## Uso

```vue
<script setup>
import KunRelationMatrix from '@/components/KunRelationMatrix/KunRelationMatrix.vue';
</script>

<template>
  <KunRelationMatrix />
</template>
```

## Props

| Nombre | Tipo | Valor por defecto | Descripción |
|---|---|---|---|
| relationTitle | Object | - |  |
| rows | Array | - |  |
| columns | Array | - |  |
| rowKey | Object | - |  |
| columnKey | Object | - |  |
| relationKey | Object | - |  |
| rowLabel | String | - |  |
| columnLabel | String | - |  |
| relationDirection | Object | - |  |
| type | String | - |  |
| getRelatedEntities | Function | - |  |
| onToggleRelation | Function | - |  |
| returnObject | Object | - |  |


## Eventos

Este componente no emite eventos propios.


## Dependencias

- src/utils
