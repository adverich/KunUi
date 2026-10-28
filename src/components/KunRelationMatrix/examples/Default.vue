<script setup lang="ts">
import { ref } from 'vue'
import KunRelationMatrix from '../src/components/KunRelationMatrix.vue'
import type { KunRelationMatrixDirection, MatrixRow } from '../src/composables/kunRelationMatrixProps.js'
import KunSwitch from '../../KunSwitch/src/components/KunSwitch.vue'
import KunSelect from '../../KunSelect/src/components/KunSelect.vue'
import KunTextField from '../../KunTextField/src/components/KunTextField.vue'

// ------------------------------------------------------------------
// Demo data: 3 filas x 3 columnas genéricas con estado de relación.
// Con direction 'column' la relación vive en la columna (source);
// con 'row' vive en la fila: ambos lados traen `users` con ids.
// ------------------------------------------------------------------
const rows = ref<MatrixRow[]>([
  { id: 'r1', name: 'Fila 1', users: [{ id: 'c1' }, { id: 'c3' }] },
  { id: 'r2', name: 'Fila 2', users: [{ id: 'c2' }] },
  { id: 'r3', name: 'Fila 3', users: [] as unknown[] },
])

const columns = ref<MatrixRow[]>([
  { id: 'c1', name: 'Columna 1', users: [{ id: 'r1' }] },
  { id: 'c2', name: 'Columna 2', users: [{ id: 'r2' }] },
  { id: 'c3', name: 'Columna 3', users: [{ id: 'r1' }] },
])

// ------------------------------------------------------------------
// Controles del playground: unión tipada
// ------------------------------------------------------------------
const relationDirection = ref<KunRelationMatrixDirection>('column')
const relationDirectionOptions = ref([
  { id: 'column', name: 'column (relación en la columna)' },
  { id: 'row', name: 'row (relación en la fila)' },
])

// ------------------------------------------------------------------
// Controles del playground: claves, etiquetas y título
// ------------------------------------------------------------------
const rowKey = ref('id')
const columnKey = ref('id')
const relationKey = ref('users')
const rowLabel = ref('name')
const columnLabel = ref('name')
const relationTitle = ref('Relaciones')

// rowLabel/columnLabel son String opcionales: vacío => undefined
const returnObject = ref(false)

// ------------------------------------------------------------------
// Log de eventos en vivo
// ------------------------------------------------------------------
interface LoggedEvent {
  id: number;
  name: string;
  detail: string;
}
let eventSeq = 0
const eventLog = ref<LoggedEvent[]>([])

function logEvent(name: string, detail: unknown): void {
  eventSeq += 1
  eventLog.value.unshift({ id: eventSeq, name, detail: String(detail ?? '') })
  if (eventLog.value.length > 8) eventLog.value.pop()
}

function handleToggleRelation(payload: { row: MatrixRow; column: MatrixRow; hasRelation: boolean; existingRelationData: unknown }): void {
  logEvent('toggleRelation', JSON.stringify({ hasRelation: payload.hasRelation, row: payload.row, column: payload.column }))
}
</script>

<template>
  <div class="p-4 grid gap-6 lg:grid-cols-2 lg:items-start">
    <!-- Vista previa + estado en crudo (fija: siempre visible al scrollear opciones) -->
    <div class="space-y-3 min-w-0 lg:sticky lg:top-4">
      <h2 class="text-lg font-semibold">KunRelationMatrix</h2>

      <div class="h-72 overflow-hidden rounded-lg border border-default">
        <KunRelationMatrix
          :rows="rows"
          :columns="columns"
          :row-key="rowKey"
          :column-key="columnKey"
          :relation-key="relationKey"
          :row-label="rowLabel || undefined"
          :column-label="columnLabel || undefined"
          :relation-title="relationTitle"
          :relation-direction="relationDirection"
          :return-object="returnObject"
          :on-toggle-relation="handleToggleRelation"
        />
      </div>

      <div class="rounded-lg bg-muted p-3 font-mono text-sm">
        <div class="text-muted text-xs mb-1">Estado de relaciones en crudo</div>
        <div class="max-h-40 overflow-y-auto text-xs">{{ JSON.stringify({ rows, columns }) }}</div>
      </div>

      <div class="rounded-lg bg-muted p-3 text-sm">
        <div class="text-muted text-xs mb-1">Últimos eventos</div>
        <ul v-if="eventLog.length" class="space-y-1 font-mono text-xs">
          <li v-for="e in eventLog" :key="e.id">
            <span class="font-semibold">{{ e.name }}</span>
            <span v-if="e.detail" class="text-muted"> — {{ e.detail }}</span>
          </li>
        </ul>
        <p v-else class="text-xs text-muted">Alterná una celda para ver eventos…</p>
      </div>
    </div>

    <!-- Panel de configuración (scroll propio: no arrastra la matriz) -->
    <div class="space-y-4 rounded-lg border border-default p-4 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto">
      <h3 class="text-sm font-semibold uppercase tracking-wide text-muted">Configuración</h3>

      <div class="grid grid-cols-2 gap-3 [&>*]:min-w-0">
        <KunSelect
          v-model="relationDirection"
          v-model:items="relationDirectionOptions"
          label="Relation direction"
          item-value="id"
          item-title="name"
          density="compact"
        />
        <KunTextField v-model="relationTitle" label="Relation title" density="compact" />

        <KunTextField v-model="rowKey" label="Row key" density="compact" />
        <KunTextField v-model="columnKey" label="Column key" density="compact" />
        <KunTextField v-model="relationKey" label="Relation key" density="compact" />
        <KunTextField v-model="rowLabel" label="Row label (vacío = undefined)" density="compact" />
        <KunTextField v-model="columnLabel" label="Column label (vacío = undefined)" density="compact" />

        <KunSwitch v-model="returnObject" label="Return object (objetos vs claves)" />
      </div>
    </div>
  </div>
</template>
