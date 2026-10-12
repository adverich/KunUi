<script setup lang="ts">
import { ref, computed } from 'vue'
import KunModalFooter from '../src/components/KunModalFooter.vue'
import KunMultipleModalFooter from '../src/components/KunMultipleModalFooter.vue'
import type { KunModalFooterColor } from '../src/composables/kunModalFooterProps.js'
import type { KunMultipleModalFooterPosition } from '../src/composables/kunMultipleModalFooterProps.js'
import KunSwitch from '../../KunSwitch/src/components/KunSwitch.vue'
import KunSelect from '../../KunSelect/src/components/KunSelect.vue'
import KunTextField from '../../KunTextField/src/components/KunTextField.vue'

// ------------------------------------------------------------------
// KunModalFooter simple (v-model)
// ------------------------------------------------------------------
const visible = ref(true)
const idRaw = ref('')
const idProp = computed((): string | number | undefined => {
  if (idRaw.value === '') return undefined
  const parsed = Number(idRaw.value)
  return Number.isNaN(parsed) ? idRaw.value : parsed
})
const message = ref('Cambios guardados')
const color = ref<KunModalFooterColor>('green')
const colorOptions = ref([
  { id: 'blue', name: 'blue' },
  { id: 'green', name: 'green' },
  { id: 'red', name: 'red' },
  { id: 'yellow', name: 'yellow' },
  { id: 'gray', name: 'gray' },
  { id: 'orange', name: 'orange' },
])
const width = ref('300px')
const height = ref('auto')
const isFixed = ref(false)

// ------------------------------------------------------------------
// KunMultipleModalFooter (2 mensajes apilados, sin example dir propio)
// ------------------------------------------------------------------
interface StackMessage {
  id: number;
  text: string;
  color: KunModalFooterColor;
}

const stackMessages = ref<StackMessage[]>([
  { id: 1, text: 'Primer mensaje', color: 'blue' },
  { id: 2, text: 'Segundo mensaje', color: 'green' },
])
const stackPosition = ref<KunMultipleModalFooterPosition>('bottom-right')
const stackPositionOptions = ref([
  { id: 'bottom-left', name: 'bottom-left' },
  { id: 'bottom-right', name: 'bottom-right' },
  { id: 'bottom-center', name: 'bottom-center' },
  { id: 'top-left', name: 'top-left' },
  { id: 'top-right', name: 'top-right' },
  { id: 'top-center', name: 'top-center' },
])

function reshowStack(): void {
  const base = Date.now()
  stackMessages.value = [
    { id: base, text: 'Primer mensaje', color: 'blue' },
    { id: base + 1, text: 'Segundo mensaje', color: 'green' },
  ]
}
</script>

<template>
  <div class="p-4 grid gap-6 lg:grid-cols-2 lg:items-start">
    <!-- Vista previa (fija: siempre visible al scrollear opciones) -->
    <div class="space-y-3 min-w-0 lg:sticky lg:top-4">
      <h2 class="text-lg font-semibold">KunModalFooter</h2>

      <div class="flex gap-2">
        <button type="button" class="rounded bg-primary px-3 py-1.5 text-sm text-white" @click="visible = true">
          Mostrar
        </button>
        <button type="button" class="rounded border border-ui px-3 py-1.5 text-sm" @click="visible = false">
          Ocultar
        </button>
      </div>

      <KunModalFooter
        v-model="visible"
        :id="idProp"
        :message="message"
        :color="color"
        :width="width || undefined"
        :height="height || undefined"
        :is-fixed="isFixed"
      />
      <p v-if="!visible" class="text-xs text-ui-muted">Footer oculto (v-model=false). La ✕ interna también lo cierra.</p>

      <h2 class="text-lg font-semibold pt-4">KunMultipleModalFooter</h2>
      <button type="button" class="rounded bg-primary px-3 py-1.5 text-sm text-white" @click="reshowStack">
        Mostrar 2 mensajes
      </button>
      <p class="text-xs text-ui-muted">Apilados en la esquina (se auto-cierran a los ~5s).</p>
      <KunMultipleModalFooter
        :messages="stackMessages"
        :position="stackPosition"
        :width="width || undefined"
        :height="height || undefined"
      />
    </div>

    <!-- Panel de configuración (scroll propio) -->
    <div class="space-y-4 rounded-xl border border-ui p-4 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto">
      <h3 class="text-sm font-semibold uppercase tracking-wide text-ui-muted">Configuración</h3>

      <div class="grid grid-cols-2 gap-3 [&>*]:min-w-0">
        <KunSwitch v-model="visible" label="Model value (visible)" />
        <KunSwitch v-model="isFixed" label="Is fixed" />
        <KunTextField v-model="message" label="Message" density="compact" />
        <KunTextField v-model="idRaw" label="Id (vacío = sin id)" density="compact" />
        <KunSelect
          v-model="color"
          v-model:items="colorOptions"
          label="Color"
          item-value="id"
          item-title="name"
          density="compact"
        />
        <KunTextField v-model="width" label="Width (vacío = 300px)" density="compact" />
        <KunTextField v-model="height" label="Height (vacío = auto)" density="compact" />

        <p class="col-span-2 pt-2 text-xs font-semibold uppercase tracking-wide text-ui-muted">Múltiple</p>
        <KunSelect
          v-model="stackPosition"
          v-model:items="stackPositionOptions"
          label="Stack position"
          item-value="id"
          item-title="name"
          density="compact"
        />
      </div>
    </div>
  </div>
</template>
