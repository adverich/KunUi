# KunRadio

Componente de UI KunRadio.

## Uso

```vue
<script setup>
import KunRadio from '@/components/KunRadio/KunRadio.vue';
</script>

<template>
  <KunRadio />
</template>
```

## Props

| Nombre | Tipo | Valor por defecto | Descripción |
|---|---|---|---|
| label | String | - |  |
| color | String | - |  |
| baseColor | String | - |  |
| trueValue | Object | - |  |
| falseValue | Object | - |  |
| trueIcon | Object | - |  |
| falseIcon | Object | - |  |
| disabled | Boolean | - |  |
| readonly | Boolean | - |  |
| error | Boolean | - |  |
| name | String | - |  |
| id | String | - |  |


## Eventos

- `update:modelValue`
- `focus`
- `blur`


## Dependencias

- src/icons
