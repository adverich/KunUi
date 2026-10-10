# KunTable

> Data table with search, filters, sorting, selection and pagination.
>
> Tabla de datos con búsqueda, filtros, orden, selección y paginación.

## Uso · Usage

```vue
<script setup>
import { KunTable } from 'adverich-kun-ui'
</script>

<template>
  <KunTable />
</template>
```

> Con `app.use(KunUI)` el componente queda registrado globalmente y no hace falta importarlo. · With `app.use(KunUI)` the component is globally registered, no import needed.

## Props

### `KunTableProps.ts`

| Propiedad · Prop | Tipo · Type | Defecto · Default | Descripción · Description |
|---|---|---|---|
| `items` | `TableItem[]` | `() => [] as TableItem[]` | Array de datos a mostrar. |
| `selected` | `TableItem[]` | `() => [] as TableItem[]` | (Deprecated) Usar v-model:selectedItems. |
| `headers` | `KunTableHeader[]` | `() => [] as KunTableHeader[]` | Configuración de columnas `{ key, value, label, sortable, ... }`. |
| `hasActions` | `Boolean` | `false` | Muestra columna de acciones (slot `item.actions`). |
| `actionLabel` | `String` | `'Acciones'` | Etiqueta del header de acciones. |
| `actionsAlign` | `String` | `-` | Alineación de acciones: 'left' \| 'center' \| 'right'. |
| `actionLoadingMap` | `Record<string, unknown>` | `() => ({})` | Mapa de loading por rowKey para la columna de acciones. |
| `filterable` | `Boolean` | `-` | Habilita filtros avanzados por columna (modal). |
| `filters` | `TableFilterDefinition[]` | `() => [] as TableFilterDefinition[]` | Configuración de filtros por columna. |
| `customFilter` | `((item: TableItem, key: string, value: unknown, header: KunTableHeader \| undefined) => boolean) \| null` | `null` | Función de filtrado personalizada `(item, key, value, header) => boolean`. |
| `itemsPerPage` | `Number \| String` | `10` | Ítems por página. |
| `page` | `Number \| String` | `1` | Página actual. |
| `sortBy` | `string \| { key: string; order: string }[]` | `() => [] as { key: string; order: string }[]` | Criterio de orden (v-model): string, objeto o array. |
| `mutliSort` | `Boolean` | `-` | Habilita ordenar por múltiples columnas. |
| `pageOptions` | `number[]` | `() => [5, 10, 25, 50, 100]` | Opciones del selector de ítems por página. |
| `searchable` | `Boolean` | `false` | Habilita barra de búsqueda. |
| `search` | `String` | `''` | Término de búsqueda (v-model). |
| `searchableKeys` | `string[] \| null` | `null` | Claves específicas donde buscar (null = todas las columnas). |
| `searchPosition` | `KunTableSearchPosition` | `'end'` | Posición de la barra de búsqueda.<br/>Valores · Values: `start` `center` `end` |
| `searchPlaceholder` | `String` | `'Buscar...'` | Placeholder de la búsqueda. |
| `debounceTime` | `Number` | `300` | Debounce en ms para ejecutar la búsqueda. |
| `showSelect` | `Boolean` | `false` | Muestra checkboxes de selección. |
| `showExpand` | `Boolean` | `false` | Habilita expansión de filas (slot `expand`). |
| `showGroupBy` | `Boolean` | `false` | (Futuro) Agrupamiento. Actualmente sin efecto. |
| `rowKey` | `string \| ((item: TableItem, index: number) => unknown)` | `'id'` | Clave estable para identidad de filas ('id', path o función). |
| `hideDefaultHeader` | `Boolean` | `false` | Oculta el header por defecto (usar slot `thead`). |
| `hideDefaultFooter` | `Boolean` | `false` | Oculta el footer por defecto (usar slot `footer`). |
| `hideSelected` | `Boolean` | `false` | Oculta el aviso de selección. |
| `wrapperClass` | `String` | `''` | Clase del contenedor principal. |
| `tableClass` | `String` | `''` | Clase del `<table>`. |
| `tbodyClass` | `String` | `''` | Clase del `<tbody>`. |
| `theadClass` | `String` | `''` | Clase del `<thead>`. |
| `trClass` | `String` | `''` | Clase de las filas. |
| `thClass` | `String` | `''` | Clase de los headers. |
| `tdClass` | `string \| ((item: TableItem) => string)` | `''` | Clase de las celdas (string o `(item) => clase`). |
| `selectedClass` | `String` | `'bg-ui-selection text-ui-selection'` | Clase de filas seleccionadas. |
| `stripedClass` | `String` | `''` | Clase de filas alternas. |
| `tfootClass` | `String` | `''` | Clase del `<tfoot>`. |
| `rowClass` | `String` | `''` | Clase adicional para filas. |
| `rowClassCondition` | `string \| ((item: TableItem) => boolean)` | `''` | Condición para aplicar `rowClass` (string o `(item) => boolean`). |
| `noDataText` | `String` | `'No hay elementos disponibles'` | Texto cuando no hay datos. |
| `loadingText` | `String` | `'Cargando...'` | Texto del estado de carga. |
| `customSlots` | `Record<string, unknown>` | `() => ({})` | Celdas custom (`item.<key>` → componente). |
| `customHeaders` | `Record<string, unknown>` | `() => ({})` | Headers custom (`header.<key>` → componente). |
| `showTopSlot` | `Boolean` | `false` | Reservado. Actualmente sin efecto (usar slots `body.prepend`/`body.append`). |
| `showBottomSlot` | `Boolean` | `false` | Reservado. Actualmente sin efecto (usar slots `body.prepend`/`body.append`). |
| `functionMap` | `Record<string, (...args: never[]) => unknown>` | `() => ({})` | Mapa de funciones para columnas tipo 'function' (serialización). |

### `kunTableFilterProps.ts`

| Propiedad · Prop | Tipo · Type | Defecto · Default | Descripción · Description |
|---|---|---|---|
| `value` | `string` | `-` | Clave de la columna a filtrar (coincide con `header.value`). |

### `kunTableFooterProps.ts`

| Propiedad · Prop | Tipo · Type | Defecto · Default | Descripción · Description |
|---|---|---|---|
| `itemsLength` | `Number` | `0` | Total de ítems (para el contador "1-10 de N"). |
| `itemsPerPage` | `Number \| String` | `10` | Ítems por página (v-model del selector). |
| `currentPage` | `Number` | `1` | Página actual (v-model). |
| `totalPages` | `Number` | `null` | Total de páginas (null = se calcula). |
| `from` | `Number` | `null` | Primer índice visible (null = se calcula). |
| `to` | `Number` | `null` | Último índice visible (null = se calcula). |
| `pageOptions` | `Array` | `() => [5, 10, 25, 50, 100]` | Opciones del selector de ítems por página. |

### `kunTableHeadersProps.ts`

| Propiedad · Prop | Tipo · Type | Defecto · Default | Descripción · Description |
|---|---|---|---|
| `headers` | `KunTableHeader[]` | `() => [] as KunTableHeader[]` | Columnas a renderizar. |
| `showSelect` | `Boolean` | `-` | Columna de checkboxes. |
| `showExpand` | `Boolean` | `-` | Columna de expansión. |
| `isExpanded` | `Boolean` | `-` | Todo expandido (alterna el botón global). |
| `allSelected` | `Boolean` | `-` | Todas las filas seleccionadas (checkbox maestro). |
| `someSelected` | `Boolean` | `-` | Selección parcial (indeterminado). |
| `moreThanPaginated` | `Boolean` | `-` | Hay seleccionados fuera de la página. |
| `sortBy` | `Object` | `-` | Criterio de orden actual (para los íconos). |
| `theadClass` | `String` | `-` | Clase del `<thead>`. |
| `trClass` | `String` | `-` | Clase de la fila de headers. |
| `thClass` | `String` | `-` | Clase de cada `<th>`. |
| `hasActions` | `Boolean` | `-` | Columna de acciones. |
| `actionLabel` | `String` | `-` | Etiqueta de la columna de acciones. |
| `customHeaders` | `Object` | `-` | Headers custom por columna (`header.<key>` → componente). |
| `disabled` | `Boolean` | `-` | Deshabilita el ordenamiento. |

### `kunTableIteratorProps.ts`

| Propiedad · Prop | Tipo · Type | Defecto · Default | Descripción · Description |
|---|---|---|---|
| `item` | `Object` | `-` | Ítem de la tarjeta (vista móvil). |
| `index` | `Number` | `-` | Índice del ítem. |
| `headers` | `KunTableHeader[]` | `() => [] as KunTableHeader[]` | Columnas a renderizar como filas etiqueta/valor. |
| `showExpand` | `Boolean` | `-` | Botón de expansión. |
| `showSelect` | `Boolean` | `-` | Checkbox de selección. |
| `isExpanded` | `Boolean` | `-` | Tarjeta expandida. |
| `isSelected` | `Boolean` | `-` | Tarjeta seleccionada. |
| `hasActions` | `Boolean` | `-` | Sección de acciones. |
| `loading` | `Boolean \| Object` | `false` | Estado de carga de las acciones. |
| `rowClass` | `String` | `-` | Clase del contenedor. |
| `selectedClass` | `String` | `-` | Clase cuando está seleccionada. |
| `border` | `String` | `'border border-ui'` | Borde de la tarjeta. |
| `rounded` | `String` | `'rounded-sm'` | Redondeo de la tarjeta. |
| `rowClassCondition` | `String \| Function` | `-` | Clase condicional por ítem (string o `(item) => clase\|false`). |
| `customSlots` | `Object` | `-` | Celdas custom por columna (`item.<key>` → componente). |

### `kunTableIteratorsProps.ts`

| Propiedad · Prop | Tipo · Type | Defecto · Default | Descripción · Description |
|---|---|---|---|
| `items` | `TableItem[]` | `() => [] as TableItem[]` | Ítems paginados a renderizar como tarjetas. |
| `headers` | `KunTableHeader[]` | `() => [] as KunTableHeader[]` | Columnas a renderizar como filas etiqueta/valor. |
| `isExpanded` | `Function` | `-` | `(item) => boolean`: tarjeta expandida. |
| `isSelected` | `Function` | `-` | `(item) => boolean`: tarjeta seleccionada. |
| `showExpand` | `Boolean` | `-` | Botón de expansión por tarjeta. |
| `showSelect` | `Boolean` | `-` | Checkbox por tarjeta. |
| `hasActions` | `Boolean` | `-` | Sección de acciones por tarjeta. |
| `actionLoadingMap` | `Object` | `-` | Mapa de loading de acciones por rowKey. |
| `getActionLoading` | `(item: TableItem, index: number) => boolean` | `() => false` | `(item, index) => boolean`: loading de las acciones. |
| `itemKey` | `(item: TableItem, index: number) => unknown` | `(_: unknown, index: number) => index` | `(item, index) => key` estable para `:key`. |
| `customSlots` | `Object` | `-` | Celdas custom por columna (`item.<key>` → componente). |

### `kunTableRowProps.ts`

| Propiedad · Prop | Tipo · Type | Defecto · Default | Descripción · Description |
|---|---|---|---|
| `item` | `Object` | `-` | Ítem de la fila. |
| `index` | `Number` | `-` | Índice del ítem. |
| `headers` | `KunTableHeader[]` | `() => [] as KunTableHeader[]` | Columnas a renderizar como celdas. |
| `showExpand` | `Boolean` | `-` | Celda de expansión. |
| `showSelect` | `Boolean` | `-` | Celda de selección. |
| `isExpanded` | `Boolean` | `-` | Fila expandida. |
| `isSelected` | `Boolean` | `-` | Fila seleccionada. |
| `rowClass` | `String` | `-` | Clase del `<tr>`. |
| `trClass` | `String` | `-` | Clase extra del `<tr>` (se combina con `rowClass`). |
| `tdClass` | `String` | `-` | Clase de cada `<td>`. |
| `selectedClass` | `String` | `-` | Clase cuando está seleccionada. |
| `stripedClass` | `String` | `-` | Clase de filas alternas. |
| `hasActions` | `Boolean` | `-` | Columna de acciones. |
| `actionsAlign` | `String` | `-` | Alineación de la columna de acciones. |
| `loading` | `Boolean \| Object` | `false` | Estado de carga de las acciones. |
| `rowClassCondition` | `String \| Function` | `-` | Clase condicional por ítem (string o `(item) => clase\|false`). |
| `customSlots` | `Object` | `-` | Celdas custom por columna (`item.<key>` → componente). |

### `kunTableRowsProps.ts`

| Propiedad · Prop | Tipo · Type | Defecto · Default | Descripción · Description |
|---|---|---|---|
| `items` | `TableItem[]` | `() => [] as TableItem[]` | Ítems paginados del `<tbody>`. |
| `tbodyClass` | `String` | `-` | Clase del `<tbody>`. |
| `isExpanded` | `(item: TableItem) => boolean` | `-` | `(item) => boolean`: fila expandida (requerido). |
| `isSelected` | `(item: TableItem) => boolean` | `-` | `(item) => boolean`: fila seleccionada (requerido). |
| `itemKey` | `(item: TableItem, index: number) => unknown` | `(_: unknown, index: number) => index` | `(item, index) => key` estable para `:key`. |
| `headers` | `KunTableHeader[]` | `() => [] as KunTableHeader[]` | Columnas a renderizar. |
| `showExpand` | `Boolean` | `-` | Columna de expansión. |
| `showSelect` | `Boolean` | `-` | Columna de selección. |
| `hasActions` | `Boolean` | `-` | Columna de acciones. |
| `loading` | `Boolean` | `-` | Estado de carga global. |
| `actionLoadingMap` | `Object` | `-` | Mapa de loading de acciones por rowKey. |
| `getActionLoading` | `(item: TableItem, index: number) => boolean` | `() => false` | `(item, index) => boolean`: loading de las acciones. |
| `customSlots` | `Object` | `-` | Celdas custom por columna (`item.<key>` → componente). |

## Modelos · Models

- `v-model:selectedItems` (`TableItem[]`, defecto · default: `() => []`)

## Eventos · Events

- `update:page`
- `update:itemsPerPage`
- `update:sortBy`
- `update:search`
- `focusOnSearch`

## Slots

- `#prependHeader`
- `#prependSearch`
- `#appendSearch`
- `#colgroup`
- `#thead`
- `#body.prepend`
- `#name`
- `#body.append`
- `#tfoot`
- `#footer`

## Notas · Notes

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
    <KunBadge :color="value === 'activo' ? 'bg-green-500' : 'bg-red-500'" :text="value" />
  </template>
  <template #item.actions="{ item, loading }">
    <KunBtn icon="mdi-pencil" size="xs" :loading="loading" @click="editar(item)" />
  </template>
  <template #expand="{ item }">
    <p><strong>Bio:</strong> {{ item.biografia }}</p>
  </template>
</KunTable>
```

---

_Generado por · Generated by `scripts/generate-docs.ts`. No editar a mano · Do not edit by hand._

Machine-readable: `registry.json` → `KunTable`.
