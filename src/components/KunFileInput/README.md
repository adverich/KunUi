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
- `change` — se emite al seleccionar archivos; payload: `Event` nativo del `<input type="file">`
- `click:clear`
- `click:control`
- `update:focused`

## Atributos (`$attrs`)

El componente declara `inheritAttrs: false` y reenvía `$attrs` al contenedor interno
(el área clickeable/foco), no al wrapper raíz. Esto evita el doble binding de
listeners (`@change`, `@click`, etc.) y la duplicación de `id`/`aria-*` en el DOM.


## Dependencias

- src/utils
