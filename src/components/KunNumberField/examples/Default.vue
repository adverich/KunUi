<script setup lang="ts">
import { ref, computed } from 'vue'
import KunNumberField from '../src/components/KunNumberField.vue'
import type { KunNumberFieldDensity } from '../src/composables/KunNumberFieldProps.js'
import KunSwitch from '../../KunSwitch/src/components/KunSwitch.vue'
import KunSelect from '../../KunSelect/src/components/KunSelect.vue'
import KunTextField from '../../KunTextField/src/components/KunTextField.vue'

// ------------------------------------------------------------------
// v-model principal: se muestra en crudo debajo del campo
// ------------------------------------------------------------------
const value = ref<number | null>(1234.5)

// ------------------------------------------------------------------
// Controles del playground
// ------------------------------------------------------------------
const label = ref('Monto')
const placeholder = ref('0,00')
const precision = ref(2)
const precisionOptions = ref([
  { id: 0, name: '0 decimales' },
  { id: 1, name: '1 decimal' },
  { id: 2, name: '2 decimales' },
  { id: 3, name: '3 decimales' },
  { id: 4, name: '4 decimales' },
])

const formatMode = ref('natural')
const formatModeOptions = ref([
  { id: 'natural', name: 'natural (entrada libre)' },
  { id: 'bank', name: 'bank (estricto)' },
])

const density = ref<KunNumberFieldDensity>('default')
const densityOptions = ref([
  { id: 'default', name: 'default' },
  { id: 'comfortable', name: 'comfortable' },
  { id: 'compact', name: 'compact' },
])

const locale = ref('auto')
const localeOptions = ref([
  { id: 'auto', name: 'Auto (es-AR)' },
  { id: 'es-AR', name: 'es-AR' },
  { id: 'en-US', name: 'en-US' },
  { id: 'de-DE', name: 'de-DE' },
  { id: 'pt-BR', name: 'pt-BR' },
])
const localeProp = computed(() => (locale.value === 'auto' ? null : locale.value))

const controlVariant = ref('default')
const controlVariantOptions = ref([
  { id: 'default', name: 'default (lados)' },
  { id: 'stacked', name: 'stacked (apiladas)' },
  { id: 'split', name: 'split (extremos)' },
])

const prefix = ref('$')
const suffix = ref('')
const minRaw = ref('')
const maxRaw = ref('')
const stepRaw = ref('1')
const minProp = computed(() => (minRaw.value === '' ? undefined : Number(minRaw.value)))
const maxProp = computed(() => (maxRaw.value === '' ? undefined : Number(maxRaw.value)))
const stepProp = computed(() => (stepRaw.value === '' ? undefined : Number(stepRaw.value)))

const useGrouping = ref(true)
const textCenter = ref(false)
const clearable = ref(true)
const disabled = ref(false)
const readonly = ref(false)
const noArrows = ref(false)
const hideDetails = ref(false)

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
  <div class="p-4 grid gap-6 lg:grid-cols-[1fr_320px]">
    <!-- Vista previa + v-model -->
    <div class="space-y-3 min-w-0">
      <h2 class="text-lg font-semibold">KunNumberField</h2>

      <KunNumberField
        v-model="value"
        :label="label"
        :placeholder="placeholder"
        :precision="precision"
        :format-mode="formatMode"
        :density="density"
        :locale="localeProp"
        :control-variant="controlVariant"
        :prefix="prefix"
        :suffix="suffix"
        :min="minProp"
        :max="maxProp"
        :step="stepProp"
        :use-grouping="useGrouping"
        :text-center="textCenter"
        :clearable="clearable"
        :disabled="disabled"
        :readonly="readonly"
        :no-arrows="noArrows"
        :hide-details="hideDetails"
        @focus="logEvent('focus', '')"
        @blur="logEvent('blur', '')"
        @input="logEvent('input', $event)"
        @enter="logEvent('enter', 'Enter ⏎')"
        @key-down="logEvent('keyDown', ($event as KeyboardEvent).key)"
      />

      <div class="rounded-lg bg-surface p-3 font-mono text-sm">
        <div class="text-ui-muted text-xs mb-1">v-model en crudo</div>
        <div>{{ JSON.stringify(value) }} <span class="text-ui-muted">({{ typeof value }})</span></div>
      </div>

      <div class="rounded-lg bg-surface p-3 text-sm">
        <div class="text-ui-muted text-xs mb-1">Últimos eventos</div>
        <ul v-if="eventLog.length" class="space-y-1 font-mono text-xs">
          <li v-for="e in eventLog" :key="e.id">
            <span class="font-semibold">{{ e.name }}</span>
            <span v-if="e.detail" class="text-ui-muted"> — {{ e.detail }}</span>
          </li>
        </ul>
        <p v-else class="text-xs text-ui-muted">Interactuá con el campo para ver eventos…</p>
      </div>
    </div>

    <!-- Panel de configuración -->
    <div class="space-y-4 rounded-xl border border-ui p-4 h-fit lg:sticky lg:top-4">
      <h3 class="text-sm font-semibold uppercase tracking-wide text-ui-muted">Configuración</h3>

      <KunTextField v-model="label" label="Label" density="compact" />
      <KunTextField v-model="placeholder" label="Placeholder" density="compact" />
      <KunTextField v-model="prefix" label="Prefix" density="compact" />
      <KunTextField v-model="suffix" label="Suffix" density="compact" />

      <KunSelect
        v-model="precision"
        v-model:items="precisionOptions"
        label="Precision"
        item-value="id"
        item-title="name"
        density="compact"
      />
      <KunSelect
        v-model="formatMode"
        v-model:items="formatModeOptions"
        label="Format mode"
        item-value="id"
        item-title="name"
        density="compact"
      />
      <KunSelect
        v-model="density"
        v-model:items="densityOptions"
        label="Density"
        item-value="id"
        item-title="name"
        density="compact"
      />
      <KunSelect
        v-model="locale"
        v-model:items="localeOptions"
        label="Locale"
        item-value="id"
        item-title="name"
        density="compact"
      />
      <KunSelect
        v-model="controlVariant"
        v-model:items="controlVariantOptions"
        label="Control variant"
        item-value="id"
        item-title="name"
        density="compact"
        :disabled="noArrows"
      />

      <KunTextField v-model="minRaw" label="Min (vacío = sin límite)" density="compact" inputmode="decimal" />
      <KunTextField v-model="maxRaw" label="Max (vacío = sin límite)" density="compact" inputmode="decimal" />
      <KunTextField v-model="stepRaw" label="Step" density="compact" inputmode="decimal" />

      <div class="grid grid-cols-2 gap-x-3 gap-y-2 pt-1">
        <KunSwitch v-model="useGrouping" label="Grouping" />
        <KunSwitch v-model="textCenter" label="Centrado" />
        <KunSwitch v-model="clearable" label="Clearable" />
        <KunSwitch v-model="hideDetails" label="Sin details" />
        <KunSwitch v-model="disabled" label="Disabled" />
        <KunSwitch v-model="readonly" label="Readonly" />
        <KunSwitch v-model="noArrows" label="Sin flechas" />
      </div>
    </div>
  </div>
</template>
