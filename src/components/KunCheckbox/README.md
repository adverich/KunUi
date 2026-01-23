# KunCheckbox

Componente de UI KunCheckbox.

## Uso

```vue
<script setup>
import KunCheckbox from '@/components/KunCheckbox/KunCheckbox.vue';
</script>

<template>
  <KunCheckbox />
</template>
```

## Props

| Nombre | Tipo | Valor por defecto | Descripción |
|---|---|---|---|
| trueValue | Object | - |  |
| falseValue | Object | - |  |
| value | null | - |  |
| indeterminate | Boolean | - |  |
| multiple | Boolean | - |  |
| disabled | Boolean | - |  |
| readonly | Boolean | - |  |
| error | Boolean | - |  |
| label | String | - |  |
| hint | String | - |  |
| persistentHint | Boolean | - |  |
| rules | Array | - |  |
| validateOn | String | - |  |
| ripple | Object | - |  |
| density | Object | - |  |
| direction | Object | - |  |
| color | String | - |  |
| baseColor | String | - |  |
| trueIcon | Object | - |  |
| falseIcon | Object | - |  |
| indeterminateIcon | Object | - |  |
| prependIcon | Object | - |  |
| appendIcon | Object | - |  |
| name | String | - |  |
| id | String | - |  |
| glow | Boolean | - |  |
| centerAffix | Object | - |  |
| valueComparator | Function | - |  |
| validationValue | null | - |  |
| focused | Boolean | - |  |
| maxErrors | Object | - |  |
| size | Object | - |  |


## Eventos

- `update:modelValue`
- `update:focused`
- `click:append`
- `click:prepend`


## Dependencias

- src/icons
