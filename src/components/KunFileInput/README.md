# KunFileInput

Componente de UI KunFileInput.

## Uso

```vue
<script setup>
import KunFileInput from '@/components/KunFileInput/KunFileInput.vue';
</script>

<template>
  <KunFileInput />
</template>
```

## Props

| Nombre | Tipo | Valor por defecto | Descripción |
|---|---|---|---|
| multiple | Boolean | - |  |
| clearable | Boolean | - |  |
| chips | Boolean | - |  |
| label | String | - |  |
| disabled | Boolean | - |  |
| error | Boolean | - |  |
| hint | String | - |  |
| persistentHint | Boolean | - |  |
| counter | Boolean | - |  |
| counterString | String | - |  |
| counterSizeString | String | - |  |
| prependIcon | String | - |  |
| appendIcon | String | - |  |
| clearIcon | String | - |  |
| variant | Object | - |  |
| type | String | - |  |
| rules | Object | - |  |
| type | Array | - |  |


## Eventos

- `update:modelValue`
- `click:clear`
- `click:control`
- `update:focused`


## Dependencias

- src/utils
