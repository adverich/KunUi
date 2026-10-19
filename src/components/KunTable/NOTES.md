## Estructura de `headers`

```js
const headers = [
  {
    key: 'nombre',                // Identificador único
    value: 'nombre',              // Clave del dato (soporta paths: 'usuario.nombre')
    label: 'Nombre',              // Texto visible
    sortable: true,               // Permite ordenar
    headerAlign: 'left',          // 'left' | 'center' | 'right'
    columnType: 'function',       // Opcional: columna calculada
    columnFunction: 'formatDate', // Nombre en `functionMap`
    relationPath: 'user.id'       // Path alternativo para datos anidados
  }
]
```

## Estructura de `filters`

```js
const filters = [
  {
    value: 'rol',                 // Debe coincidir con header.value
    label: 'Rol',
    items: [...],                 // Opciones del filtro
    'item-value': 'id',           // Clave de comparación (default 'id')
    placeholderText: 'Seleccionar rol',
    textNoItem: 'No hay roles disponibles'
  }
]
```

## Matching de filtros

- Selección múltiple dentro de un filtro: **OR**.
- Varios filtros activos: **AND**.
- Celda escalar: igualdad exacta (case-insensitive) contra `item-value`.
- Celda array (relaciones M2M, p. ej. `price_lists`): **includes-any** —
  pasa si algún miembro tiene `item-value` entre los seleccionados.

## Props de slots

| Slot | Props |
|------|-------|
| `#item.{key}` | `{ item, index, value, header }` |
| `#header.{key}` | `{ header }` |
| `#item.actions` | `{ item, index, loading }` |
| `#expand` | `{ item, index }` |
| `#thead` / `#tfoot` / `#footer` | `{ items, headers, page, itemsPerPage, ... }` |
| `#body.prepend` / `#body.append` | `{ items, headers, ... }` |

## Características

- **Búsqueda global:** filtra en columnas `sortable` o `searchableKeys`.
- **Ordenamiento:** simple o múltiple (`multiSort`); strings, números y fechas.
- **Selección:** individual, por página o todos los filtrados.
- **Responsive:** en móvil se transforma a tarjetas (`KunTableIterators`).
- **Serialización:** `functionMap` para columnas `function` dinámicas.

## Ejemplo completo

```vue
<KunTable
  :items="usuarios" :headers="headers" :filters="filtros"
  searchable filterable :show-select="true"
  v-model:selected-items="seleccionados" :items-per-page="15"
>
  <template #item.estado="{ value }">
    <KunBadge :color="value === 'activo' ? 'success' : 'error'" :text="value" />
  </template>
  <template #item.actions="{ item, loading }">
    <KunBtn icon="mdi-pencil" size="xs" :loading="loading" @click="editar(item)" />
  </template>
  <template #expand="{ item }">
    <p><strong>Bio:</strong> {{ item.biografia }}</p>
  </template>
</KunTable>
```

## Bordes y radio

- Wrapper `rounded-lg`; div de búsqueda y spans de acción `rounded-md` (antes
  `rounded` pelado, que no escalaba con `--kun-radius`).
- Superficies: wrapper `bg-default ring ring-default`; thead `bg-elevated`; filas
  `bg-default` con separador `border-t border-default` y hover `bg-elevated/50`.
  La caja de búsqueda es un control: `ring ring-inset ring-accented` (antes
  `border border-default`, que sobre `bg-muted`/`bg-elevated` desaparecía en dark).
