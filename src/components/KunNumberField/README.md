# KunNumberField

Componente de UI KunNumberField.

## Uso

```vue
<script setup>
import KunNumberField from '@/components/KunNumberField/KunNumberField.vue';
</script>

<template>
  <KunNumberField />
</template>
```

## Atributos HTML

Los atributos `id`, `name`, `autocomplete`, `required`, `readonly`, `disabled`,
`min`, `max` y `step` se aplican al `<input>` nativo interno. Los controles de
incremento/decremento y el formateo numérico respetan `min`, `max`, `step` y
`precision`; `rules` sigue disponible para validación de negocio/UI.


## Eventos

- `update:modelValue`
- `focus`
- `input`
- `blur`
- `handleClick`
- `keyDown`
- `keyUp`


## Dependencias

- src/icons
