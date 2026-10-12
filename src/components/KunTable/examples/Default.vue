<script setup lang="ts">
import { ref, computed } from 'vue'
import KunTable from '../src/components/KunTable.vue'
import KunSwitch from '../../KunSwitch/src/components/KunSwitch.vue'
import KunSelect from '../../KunSelect/src/components/KunSelect.vue'
import KunTextField from '../../KunTextField/src/components/KunTextField.vue'
import type { KunTableSearchPosition } from '../src/composables/KunTableProps.js'
import type { TableFilterDefinition } from '../src/composables/kunTableFilterProps.js'
import type { TableItem } from '../src/composables/useRowKey.js'
import type { KunTableHeader } from '../../../utils/tableFormatters.js'

// ------------------------------------------------------------------
// Dataset demo: 9 usuarios { id, name, email, role, active }
// ------------------------------------------------------------------
const users = ref<TableItem[]>([
  { id: 1, name: 'Ana Gómez', email: 'ana.gomez@demo.com', role: 'admin', active: true },
  { id: 2, name: 'Bruno Díaz', email: 'bruno.diaz@demo.com', role: 'editor', active: true },
  { id: 3, name: 'Carla Ruiz', email: 'carla.ruiz@demo.com', role: 'viewer', active: false },
  { id: 4, name: 'Diego Torres', email: 'diego.torres@demo.com', role: 'editor', active: true },
  { id: 5, name: 'Elena Mora', email: 'elena.mora@demo.com', role: 'viewer', active: true },
  { id: 6, name: 'Franco Silva', email: 'franco.silva@demo.com', role: 'admin', active: false },
  { id: 7, name: 'Gina López', email: 'gina.lopez@demo.com', role: 'editor', active: true },
  { id: 8, name: 'Hugo Castro', email: 'hugo.castro@demo.com', role: 'viewer', active: false },
  { id: 9, name: 'Iván Pérez', email: 'ivan.perez@demo.com', role: 'admin', active: true },
])

// Una columna ordenable (name, id) + una filtrable por columna (role)
const headers = ref<KunTableHeader[]>([
  { key: 'id', value: 'id', label: 'ID', sortable: true, headerAlign: 'right' },
  { key: 'name', value: 'name', label: 'Nombre', sortable: true, headerAlign: 'left' },
  { key: 'email', value: 'email', label: 'Email', headerAlign: 'left' },
  { key: 'role', value: 'role', label: 'Rol', headerAlign: 'left' },
  { key: 'active', value: 'active', label: 'Activo', headerAlign: 'center' },
])

// Filtro por columna sobre `role` (coincide con header.value)
const filters = ref<TableFilterDefinition[]>([
  {
    value: 'role',
    label: 'Rol',
    title: 'name',
    items: [
      { id: 'admin', name: 'Admin' },
      { id: 'editor', name: 'Editor' },
      { id: 'viewer', name: 'Viewer' },
    ],
    'item-value': 'id',
    placeholderText: 'Seleccionar rol',
    textNoItem: 'No hay roles disponibles',
  },
])

// ------------------------------------------------------------------
// Controles del playground (solo props efectivas)
// ------------------------------------------------------------------
const searchable = ref(true)
const searchPosition = ref<KunTableSearchPosition>('end')
const searchPositionOptions = ref<{ id: KunTableSearchPosition; name: string }[]>([
  { id: 'start', name: 'start' },
  { id: 'center', name: 'center' },
  { id: 'end', name: 'end' },
])
const searchPlaceholder = ref('Buscar...')
const debounceRaw = ref('300')
const debounceTimeProp = computed(() => {
  const n = Number(debounceRaw.value)
  return Number.isFinite(n) && n >= 0 ? n : 300
})

const filterable = ref(true)

const showSelect = ref(true)
const hideSelected = ref(false)
const selectedItems = ref<TableItem[]>([])
const selectedIds = computed(() => selectedItems.value.map((item) => item.id))

const showExpand = ref(true)
const striped = ref(false)
const stripedClassProp = computed(() => (striped.value ? 'bg-surface-dark' : ''))

const itemsPerPageRaw = ref('5')
const itemsPerPageProp = computed(() => {
  const n = Number(itemsPerPageRaw.value)
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 5
})
function onItemsPerPage(value: number | string): void {
  itemsPerPageRaw.value = String(value)
}
const pageOptionsRaw = ref('5, 10, 25')
const pageOptionsProp = computed(() => {
  const parsed = pageOptionsRaw.value
    .split(',')
    .map((part) => Number(part.trim()))
    .filter((n) => Number.isFinite(n) && n > 0)
    .map((n) => Math.floor(n))
  return parsed.length ? [...new Set(parsed)] : [5, 10, 25, 50, 100]
})

const noDataText = ref('No hay elementos disponibles')
const loadingText = ref('Cargando...')
const showEmpty = ref(false)
const showLoading = ref(false)
const displayedItems = computed(() => (showEmpty.value || showLoading.value ? [] : users.value))
const effectiveNoDataText = computed(() => (showLoading.value ? loadingText.value : noDataText.value))
</script>

<template>
  <div class="p-4 grid gap-6 lg:grid-cols-2 lg:items-start">
    <!-- Vista previa (fija: siempre visible al scrollear opciones) -->
    <div class="space-y-3 min-w-0 lg:sticky lg:top-4">
      <h2 class="text-lg font-semibold">KunTable</h2>

      <KunTable
        :items="displayedItems"
        :headers="headers"
        :searchable="searchable"
        :search-position="searchPosition"
        :search-placeholder="searchPlaceholder"
        :debounce-time="debounceTimeProp"
        :filterable="filterable"
        :filters="filters"
        :show-select="showSelect"
        :hide-selected="hideSelected"
        v-model:selected-items="selectedItems"
        :show-expand="showExpand"
        :striped-class="stripedClassProp"
        :items-per-page="itemsPerPageProp"
        :page-options="pageOptionsProp"
        :no-data-text="effectiveNoDataText"
        :loading-text="loadingText"
        @update:items-per-page="onItemsPerPage"
      >
        <template #item.active="{ value }">
          <span
            class="rounded-full px-2 py-0.5 text-xs"
            :class="value ? 'bg-success/15 text-success' : 'bg-error/15 text-error'"
          >
            {{ value ? 'Activo' : 'Inactivo' }}
          </span>
        </template>
        <template #expand="{ item }">
          <div class="text-sm">
            <strong>{{ item.name }}</strong> — {{ item.email }} · rol {{ item.role }}
          </div>
        </template>
      </KunTable>

      <div class="rounded-lg bg-surface p-3 font-mono text-sm">
        <div class="text-ui-muted text-xs mb-1">v-model:selectedItems (ids)</div>
        <div>{{ JSON.stringify(selectedIds) }} <span class="text-ui-muted">({{ selectedItems.length }} seleccionados)</span></div>
      </div>
    </div>

    <!-- Panel de configuración (scroll propio: no arrastra la tabla) -->
    <div class="space-y-4 rounded-xl border border-ui p-4 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto">
      <h3 class="text-sm font-semibold uppercase tracking-wide text-ui-muted">Configuración</h3>

      <div class="grid grid-cols-2 gap-3">
        <p class="col-span-2 pt-2 text-xs font-semibold uppercase tracking-wide text-ui-muted">Búsqueda</p>
        <KunSwitch v-model="searchable" label="Searchable" />
        <KunSelect
          v-model="searchPosition"
          v-model:items="searchPositionOptions"
          label="Search position"
          item-value="id"
          item-title="name"
          density="compact"
        />
        <KunTextField v-model="searchPlaceholder" label="Search placeholder" density="compact" />
        <KunTextField v-model="debounceRaw" label="Debounce (ms)" density="compact" inputmode="numeric" />

        <p class="col-span-2 pt-2 text-xs font-semibold uppercase tracking-wide text-ui-muted">Filtros por columna (rol)</p>
        <KunSwitch v-model="filterable" label="Filterable (modal por columna)" />

        <p class="col-span-2 pt-2 text-xs font-semibold uppercase tracking-wide text-ui-muted">Selección</p>
        <KunSwitch v-model="showSelect" label="Show select" />
        <KunSwitch v-model="hideSelected" label="Hide selected (aviso)" />

        <p class="col-span-2 pt-2 text-xs font-semibold uppercase tracking-wide text-ui-muted">Filas</p>
        <KunSwitch v-model="showExpand" label="Show expand" />
        <KunSwitch v-model="striped" label="Striped (stripedClass)" />

        <p class="col-span-2 pt-2 text-xs font-semibold uppercase tracking-wide text-ui-muted">Paginación</p>
        <KunTextField v-model="itemsPerPageRaw" label="Items per page" density="compact" inputmode="numeric" />
        <KunTextField v-model="pageOptionsRaw" label="Page options (csv)" density="compact" />

        <p class="col-span-2 pt-2 text-xs font-semibold uppercase tracking-wide text-ui-muted">Textos y estados</p>
        <KunTextField v-model="noDataText" label="No data text" density="compact" />
        <KunTextField v-model="loadingText" label="Loading text" density="compact" />
        <KunSwitch v-model="showEmpty" label="Sin datos (items = [])" />
        <KunSwitch v-model="showLoading" label="Loading (vacío + loadingText)" />
      </div>
    </div>
  </div>
</template>
