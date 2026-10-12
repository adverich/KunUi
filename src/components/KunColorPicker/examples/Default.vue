<script setup lang="ts">
import { ref, computed } from 'vue'
import KunColorPicker from '../src/components/KunColorPicker.vue'
import type { KunColorPickerColorType } from '../src/composables/kunColorPickerProps.js'
import KunSwitch from '../../KunSwitch/src/components/KunSwitch.vue'
import KunSelect from '../../KunSelect/src/components/KunSelect.vue'
import KunTextField from '../../KunTextField/src/components/KunTextField.vue'
import KunBtn from '../../KunBtn/src/components/KunBtn.vue'

// ------------------------------------------------------------------
// v-model principal: se muestra en crudo debajo del picker
// ------------------------------------------------------------------
const color = ref('#3b82f6')

// ------------------------------------------------------------------
// Controles del playground
// ------------------------------------------------------------------
const label = ref('Color de acento')
const placeholder = ref('#000000')
const originalColorRaw = ref('#2563EB')
const originalColorProp = computed<string | undefined>(() =>
  originalColorRaw.value === '' ? undefined : originalColorRaw.value,
)

const colorType = ref<KunColorPickerColorType>('all')
const colorTypeOptions = ref([
  { id: 'all', name: 'all (elegible)' },
  { id: 'hex', name: 'hex' },
  { id: 'rgb', name: 'rgb' },
  { id: 'hsl', name: 'hsl' },
])

const allowTransparent = ref(true)
const resettable = ref(true)
const showPreview = ref(true)
const disabled = ref(false)

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
</script>

<template>
  <div class="p-4 grid gap-6 lg:grid-cols-2 lg:items-start">
    <!-- Vista previa + v-model (fija: siempre visible al scrollear opciones) -->
    <div class="space-y-3 min-w-0 lg:sticky lg:top-4">
      <h2 class="text-lg font-semibold">KunColorPicker</h2>

      <KunColorPicker
        v-model="color"
        :original-color="originalColorProp"
        :label="label"
        :placeholder="placeholder"
        :color-type="colorType"
        :allow-transparent="allowTransparent"
        :resettable="resettable"
        :show-preview="showPreview"
        :disabled="disabled"
        @change="logEvent('change', $event)"
        @reset="logEvent('reset', $event)"
        @open="logEvent('open', '')"
        @close="logEvent('close', '')"
      />

      <div class="flex items-center gap-3">
        <span
          class="inline-block w-10 h-10 rounded border border-ui"
          :style="{ backgroundColor: color }"
        />
        <code class="text-sm">{{ color }}</code>
        <KunBtn text="Volver a rojo" size="xs" @click="color = '#EF4444'" />
      </div>

      <div class="rounded-lg bg-surface p-3 font-mono text-sm">
        <div class="text-ui-muted text-xs mb-1">v-model en crudo</div>
        <div>{{ JSON.stringify(color) }} <span class="text-ui-muted">({{ typeof color }})</span></div>
      </div>

      <div class="rounded-lg bg-surface p-3 text-sm">
        <div class="text-ui-muted text-xs mb-1">Últimos eventos</div>
        <ul v-if="eventLog.length" class="space-y-1 font-mono text-xs">
          <li v-for="e in eventLog" :key="e.id">
            <span class="font-semibold">{{ e.name }}</span>
            <span v-if="e.detail" class="text-ui-muted"> — {{ e.detail }}</span>
          </li>
        </ul>
        <p v-else class="text-xs text-ui-muted">Interactuá con el picker para ver eventos…</p>
      </div>
    </div>

    <!-- Panel de configuración (scroll propio: no arrastra el picker) -->
    <div class="space-y-4 rounded-xl border border-ui p-4 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto">
      <h3 class="text-sm font-semibold uppercase tracking-wide text-ui-muted">Configuración</h3>

      <div class="grid grid-cols-2 gap-3 [&>*]:min-w-0">
        <KunTextField v-model="label" label="Label" density="compact" />
        <KunTextField v-model="placeholder" label="Placeholder" density="compact" />
        <KunTextField v-model="originalColorRaw" label="Original color (vacío = por defecto)" density="compact" />

        <KunSelect
          v-model="colorType"
          v-model:items="colorTypeOptions"
          label="Color type"
          item-value="id"
          item-title="name"
          density="compact"
        />

        <KunSwitch v-model="allowTransparent" label="Allow transparent" />
        <KunSwitch v-model="resettable" label="Resettable" />
        <KunSwitch v-model="showPreview" label="Show preview" />
        <KunSwitch v-model="disabled" label="Disabled" />
      </div>
    </div>
  </div>
</template>
