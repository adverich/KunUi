# KunTextField

Componente de UI KunTextField.

## Uso

```vue
<script setup>
import KunTextField from '@/components/KunTextField/KunTextField.vue';
</script>

<template>
  <KunTextField />
</template>
```

## Atributos HTML

Los atributos `id`, `name`, `autocomplete`, `required`, `readonly`, `disabled`,
`inputmode`, `minlength`, `maxlength`, `pattern` y `spellcheck` se aplican al
`<input>` nativo interno. `rules` sigue disponible para validación de negocio/UI.


## Eventos

- `update:modelValue`
- `focus`
- `blur`
- `handleClick`
- `keyDown`
- `keyUp`
- `enter`


## Dependencias

- src/icons
