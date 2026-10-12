<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import KunSlider from '../src/components/KunSlider.vue'
import KunSwitch from '../../KunSwitch/src/components/KunSwitch.vue'
import KunTextField from '../../KunTextField/src/components/KunTextField.vue'

// ------------------------------------------------------------------
// v-model principal: se muestra en crudo debajo del slider
// ------------------------------------------------------------------
const range = ref(false)
const value = ref<number | number[]>(30)

watch(range, (isRange) => {
  value.value = isRange ? [20, 80] : 30
})

// ------------------------------------------------------------------
// Controles del playground
// ------------------------------------------------------------------
const label = ref('Volumen')
// label es String con default null: vacío => null
const labelProp = computed(() => (label.value === '' ? undefined : label.value))

const minRaw = ref('0')
const maxRaw = ref('100')
const stepRaw = ref('1')
const tickSizeRaw = ref('2')
const minProp = computed(() => (minRaw.value === '' ? 0 : Number(minRaw.value)))
const maxProp = computed(() => (maxRaw.value === '' ? 100 : Number(maxRaw.value)))
const stepProp = computed(() => (stepRaw.value === '' ? 1 : Number(stepRaw.value)))
const tickSizeProp = computed(() => (tickSizeRaw.value === '' ? 2 : Number(tickSizeRaw.value)))

const tickColor = ref('border-error')
const trackColor = ref('bg-primary')
const thumbColor = ref('bg-primary')

const ticks = ref(false)
const tickLabels = ref(false)
const vertical = ref(false)
const thumbLabel = ref(true)
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
      <h2 class="text-lg font-semibold">KunSlider</h2>

      <KunSlider
        v-model="value"
        :min="minProp"
        :max="maxProp"
        :step="stepProp"
        :ticks="ticks"
        :tick-labels="tickLabels"
        :tick-size="tickSizeProp"
        :tick-color="tickColor"
        :vertical="vertical"
        :range="range"
        :label="labelProp"
        :thumb-label="thumbLabel"
        :disabled="disabled"
        :track-color="trackColor"
        :thumb-color="thumbColor"
        @update:model-value="logEvent('update:modelValue', JSON.stringify($event))"
        @input="logEvent('input', JSON.stringify($event))"
        @change="logEvent('change', JSON.stringify($event))"
      />

      <div class="rounded-lg bg-surface p-3 font-mono text-sm">
        <div class="text-ui-muted text-xs mb-1">v-model en crudo</div>
        <div>{{ JSON.stringify(value) }} <span class="text-ui-muted">({{ Array.isArray(value) ? 'array' : typeof value }})</span></div>
      </div>

      <div class="rounded-lg bg-surface p-3 text-sm">
        <div class="text-ui-muted text-xs mb-1">Últimos eventos</div>
        <ul v-if="eventLog.length" class="space-y-1 font-mono text-xs">
          <li v-for="e in eventLog" :key="e.id">
            <span class="font-semibold">{{ e.name }}</span>
            <span v-if="e.detail" class="text-ui-muted"> — {{ e.detail }}</span>
          </li>
        </ul>
        <p v-else class="text-xs text-ui-muted">Interactuá con el slider para ver eventos…</p>
      </div>
    </div>

    <!-- Panel de configuración (scroll propio: no arrastra el slider) -->
    <div class="space-y-4 rounded-xl border border-ui p-4 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto">
      <h3 class="text-sm font-semibold uppercase tracking-wide text-ui-muted">Configuración</h3>

      <div class="grid grid-cols-2 gap-3 [&>*]:min-w-0">
        <KunTextField v-model="label" label="Label (vacío = null)" density="compact" />
        <KunTextField v-model="tickColor" label="Tick color" density="compact" />
        <KunTextField v-model="trackColor" label="Track color" density="compact" />
        <KunTextField v-model="thumbColor" label="Thumb color" density="compact" />

        <KunTextField v-model="minRaw" label="Min" density="compact" inputmode="decimal" />
        <KunTextField v-model="maxRaw" label="Max" density="compact" inputmode="decimal" />
        <KunTextField v-model="stepRaw" label="Step" density="compact" inputmode="decimal" />
        <KunTextField v-model="tickSizeRaw" label="Tick size (px)" density="compact" inputmode="decimal" />

        <KunSwitch v-model="range" label="Rango (doble thumb)" />
        <KunSwitch v-model="ticks" label="Ticks" />
        <KunSwitch v-model="tickLabels" label="Etiquetas en ticks" />
        <KunSwitch v-model="thumbLabel" label="Etiqueta en thumb" />
        <KunSwitch v-model="vertical" label="Vertical" />
        <KunSwitch v-model="disabled" label="Disabled" />
      </div>
    </div>
  </div>
</template>
