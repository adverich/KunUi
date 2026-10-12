<script setup lang="ts">
import { ref } from 'vue'
import KunDialog from '../src/components/KunDialog.vue'
import type { KunDialogXPosition, KunDialogYPosition } from '../src/composables/kunDialogProps.js'
import KunBtn from '../../KunBtn/src/components/KunBtn.vue'
import KunSwitch from '../../KunSwitch/src/components/KunSwitch.vue'
import KunSelect from '../../KunSelect/src/components/KunSelect.vue'
import KunTextField from '../../KunTextField/src/components/KunTextField.vue'

// ------------------------------------------------------------------
// Estado del diálogo (v-model)
// ------------------------------------------------------------------
const open = ref(false)

// ------------------------------------------------------------------
// Controles del playground
// ------------------------------------------------------------------
const xPosition = ref<KunDialogXPosition>('center')
const xPositionOptions = ref([
  { id: 'start', name: 'start' },
  { id: 'center', name: 'center' },
  { id: 'end', name: 'end' },
])

const yPosition = ref<KunDialogYPosition>('center')
const yPositionOptions = ref([
  { id: 'top', name: 'top' },
  { id: 'center', name: 'center' },
  { id: 'bottom', name: 'bottom' },
])

const overlay = ref(true)
const fullscreen = ref(false)
const scrollable = ref(false)
const persistent = ref(false)

const dialogClass = ref('')
const contentClass = ref('')
const bgColor = ref('bg-surface-dark')
const minHeight = ref('h-fit')
const height = ref('h-fit')
const maxHeight = ref('max-h-dvh')
const minWidth = ref('min-w-1/3')
const width = ref('w-full')
const maxWidth = ref('max-w-full')

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

function onUpdateModelValue(value: boolean): void {
  logEvent(value ? 'open' : 'close', `update:modelValue → ${value}`)
}
</script>

<template>
  <div class="p-4 grid gap-6 lg:grid-cols-2 lg:items-start">
    <!-- Vista previa (fija: siempre visible al scrollear opciones) -->
    <div class="space-y-3 min-w-0 lg:sticky lg:top-4">
      <h2 class="text-lg font-semibold">KunDialog</h2>

      <KunBtn @click="open = true">
        Abrir
      </KunBtn>

      <KunDialog
        v-model="open"
        :overlay="overlay"
        :fullscreen="fullscreen"
        :scrollable="scrollable"
        :persistent="persistent"
        :dialog-class="dialogClass"
        :x-position="xPosition"
        :y-position="yPosition"
        :content-class="contentClass"
        :bg-color="bgColor"
        :min-height="minHeight"
        :height="height"
        :max-height="maxHeight"
        :min-width="minWidth"
        :width="width"
        :max-width="maxWidth"
        @update:model-value="onUpdateModelValue"
      >
        <div class="p-6 space-y-3">
          <h3 class="text-lg font-semibold">Título del diálogo</h3>
          <p class="text-sm text-ui-muted">
            Este es un texto genérico de ejemplo para mostrar el contenido del diálogo.
          </p>
          <div class="flex justify-end gap-2">
            <KunBtn variant="tonal" @click="open = false">
              Cerrar
            </KunBtn>
            <KunBtn @click="open = false">
              Aceptar
            </KunBtn>
          </div>
        </div>
      </KunDialog>

      <div class="rounded-lg bg-surface p-3 text-sm">
        <div class="text-ui-muted text-xs mb-1">Últimos eventos</div>
        <ul v-if="eventLog.length" class="space-y-1 font-mono text-xs">
          <li v-for="e in eventLog" :key="e.id">
            <span class="font-semibold">{{ e.name }}</span>
            <span v-if="e.detail" class="text-ui-muted"> — {{ e.detail }}</span>
          </li>
        </ul>
        <p v-else class="text-xs text-ui-muted">Abrí el diálogo para ver eventos…</p>
      </div>
    </div>

    <!-- Panel de configuración (scroll propio: no arrastra el diálogo) -->
    <div class="space-y-4 rounded-xl border border-ui p-4 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto">
      <h3 class="text-sm font-semibold uppercase tracking-wide text-ui-muted">Configuración</h3>

      <div class="grid grid-cols-2 gap-3 [&>*]:min-w-0">
        <KunSelect
          v-model="xPosition"
          v-model:items="xPositionOptions"
          label="X position"
          item-value="id"
          item-title="name"
          density="compact"
        />
        <KunSelect
          v-model="yPosition"
          v-model:items="yPositionOptions"
          label="Y position"
          item-value="id"
          item-title="name"
          density="compact"
        />

        <KunTextField v-model="bgColor" label="Bg color" density="compact" />
        <KunTextField v-model="dialogClass" label="Dialog class" density="compact" />
        <KunTextField v-model="contentClass" label="Content class" density="compact" />

        <KunTextField v-model="minWidth" label="Min width" density="compact" />
        <KunTextField v-model="width" label="Width" density="compact" />
        <KunTextField v-model="maxWidth" label="Max width" density="compact" />

        <KunTextField v-model="minHeight" label="Min height" density="compact" />
        <KunTextField v-model="height" label="Height" density="compact" />
        <KunTextField v-model="maxHeight" label="Max height" density="compact" />

        <KunSwitch v-model="overlay" label="Overlay" />
        <KunSwitch v-model="fullscreen" label="Fullscreen" />
        <KunSwitch v-model="scrollable" label="Scrollable" />
        <KunSwitch v-model="persistent" label="Persistent" />
      </div>
    </div>
  </div>
</template>
