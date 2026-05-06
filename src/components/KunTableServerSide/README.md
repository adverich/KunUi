# KunTableServerSide

Componente de UI `KunTableServerSide`.

## Uso

```vue
<script setup>
import KunTableServerSide from '@/components/KunTableServerSide/src/components/KunTableServerSide.vue'
</script>

<template>
  <KunTableServerSide />
</template>
```

## Props

- `result`
- `loading`
- `headers`
- `filters`
- `page`
- `itemsPerPage`
- `sortBy`
- `search`

Admite además las props visuales y de comportamiento compartidas con `KunTable`.

## Eventos

- `update:page`
- `update:itemsPerPage`
- `update:sortBy`
- `update:search`
- `update:query`
- `focusOnSearch`

## Notas

- Espera una respuesta paginada estilo Laravel `paginate()`.
- La búsqueda, filtros, ordenamiento y paginación se resuelven en el servidor.
- La selección aplica a los items visibles de la página actual.
