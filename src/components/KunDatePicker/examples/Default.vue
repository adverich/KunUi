<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import KunDatePicker from '../src/components/KunDatePicker.vue'
import KunSwitch from '../../KunSwitch/src/components/KunSwitch.vue'
import KunSelect from '../../KunSelect/src/components/KunSelect.vue'
import KunTextField from '../../KunTextField/src/components/KunTextField.vue'

// ------------------------------------------------------------------
// Uniones cerradas del DatePicker (el props file no las exporta)
// ------------------------------------------------------------------
type DatePickerMode = 'date' | 'datetime' | 'time'
type DatePickerAlign = 'left' | 'center' | 'right'

// ------------------------------------------------------------------
// v-model principal: simple o rango según el switch `range`
// ------------------------------------------------------------------
const range = ref(false)
const model = ref<Date | string | Date[] | null>(null)
watch(range, () => { model.value = null })

// ------------------------------------------------------------------
// Controles del playground
// ------------------------------------------------------------------
const label = ref('Fecha')
const placeholder = ref('Seleccioná una fecha')
const errorMessage = ref('')

const mode = ref<DatePickerMode>('date')
const modeOptions = ref([
  { id: 'date', name: 'date' },
  { id: 'datetime', name: 'datetime' },
  { id: 'time', name: 'time' },
])

const align = ref<DatePickerAlign>('left')
const alignOptions = ref([
  { id: 'left', name: 'left' },
  { id: 'center', name: 'center' },
  { id: 'right', name: 'right' },
])

const locale = ref('es-ES')
const localeOptions = ref([
  { id: 'es-ES', name: 'es-ES' },
  { id: 'es-AR', name: 'es-AR' },
  { id: 'en-US', name: 'en-US' },
  { id: 'de-DE', name: 'de-DE' },
  { id: 'pt-BR', name: 'pt-BR' },
])

const outputSel = ref('auto')
const outputOptions = ref([
  { id: 'auto', name: 'Auto (null)' },
  { id: 'date', name: 'date' },
  { id: 'datetime', name: 'datetime' },
  { id: 'time', name: 'time' },
  { id: 'iso', name: 'iso' },
])
const outputFormatProp = computed<string | undefined>(() => (outputSel.value === 'auto' ? undefined : outputSel.value))

const timezoneRaw = ref('')
const timezoneProp = computed<string | undefined>(() => (timezoneRaw.value.trim() === '' ? undefined : timezoneRaw.value.trim()))

const valueFormatRaw = ref('')
const valueFormatProp = computed<string | undefined>(() => (valueFormatRaw.value === '' ? undefined : valueFormatRaw.value))
const formatRaw = ref('')
const formatProp = computed<string | undefined>(() => (formatRaw.value === '' ? undefined : formatRaw.value))
const displayFormatRaw = ref('')
const displayFormatProp = computed<string | undefined>(() => (displayFormatRaw.value === '' ? undefined : displayFormatRaw.value))

const startDateRaw = ref('')
const startDateProp = computed<string | undefined>(() => (startDateRaw.value.trim() === '' ? undefined : startDateRaw.value.trim()))
const startTimeRaw = ref('')
const startTimeProp = computed<string | undefined>(() => (startTimeRaw.value.trim() === '' ? undefined : startTimeRaw.value.trim()))

const minDateRaw = ref('')
const maxDateRaw = ref('')
function toDateOrUndefined(raw: string): Date | undefined {
  if (raw.trim() === '') return undefined
  const d = new Date(`${raw.trim()}T12:00:00`)
  return isNaN(d.getTime()) ? undefined : d
}
const minDateProp = computed<Date | undefined>(() => toDateOrUndefined(minDateRaw.value))
const maxDateProp = computed<Date | undefined>(() => toDateOrUndefined(maxDateRaw.value))

const widthRaw = ref('')
const widthProp = computed<string | number | undefined>(() => (widthRaw.value.trim() === '' ? undefined : widthRaw.value.trim()))
const calendarWidthRaw = ref('320')
const calendarWidthProp = computed<string | number>(() => {
  const t = calendarWidthRaw.value.trim()
  if (t === '') return 320
  const n = Number(t)
  return !isNaN(n) && String(n) === t ? n : t
})

const daySize = ref('2rem')
const fontSize = ref('0.875rem')
const maxHeight = ref('400px')

const onlyIcon = ref(false)
const autoApply = ref(true)
const enableTime = ref(false)
const enableSeconds = ref(false)
const fullWidth = ref(false)
const disabled = ref(false)

// ------------------------------------------------------------------
// Panel de v-model en legible + crudo
// ------------------------------------------------------------------
function formatReadable(v: unknown): string {
  if (v === null || v === undefined) return 'null'
  if (v instanceof Date) return isNaN(v.getTime()) ? 'Invalid Date' : v.toLocaleString(locale.value)
  if (Array.isArray(v)) return `[${v.map(formatReadable).join(', ')}]`
  if (typeof v === 'string') return `"${v}"`
  return String(v)
}
const modelKind = computed(() => {
  if (model.value === null) return 'null'
  if (Array.isArray(model.value)) return 'array (rango)'
  if (model.value instanceof Date) return 'Date'
  return typeof model.value
})

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
      <h2 class="text-lg font-semibold">KunDatePicker</h2>

      <KunDatePicker
        v-model="model"
        :range="range"
        :label="label"
        :placeholder="placeholder"
        :only-icon="onlyIcon"
        :disabled="disabled"
        :error-message="errorMessage"
        :auto-apply="autoApply"
        :mode="mode"
        :enable-time="enableTime"
        :enable-seconds="enableSeconds"
        :start-date="startDateProp"
        :start-time="startTimeProp"
        :min-date="minDateProp"
        :max-date="maxDateProp"
        :locale="locale"
        :timezone="timezoneProp"
        :value-format="valueFormatProp"
        :format="formatProp"
        :display-format="displayFormatProp"
        :output-format="outputFormatProp"
        :width="widthProp"
        :calendar-width="calendarWidthProp"
        :full-width="fullWidth"
        :align="align"
        :day-size="daySize"
        :font-size="fontSize"
        :max-height="maxHeight"
        @update:model-value="logEvent('update:modelValue', formatReadable($event))"
        @change="logEvent('change', formatReadable($event))"
        @open="logEvent('open', '')"
        @close="logEvent('close', '')"
      />

      <div class="rounded-lg bg-surface p-3 font-mono text-sm">
        <div class="text-ui-muted text-xs mb-1">v-model en crudo</div>
        <div>{{ formatReadable(model) }} <span class="text-ui-muted">({{ modelKind }})</span></div>
        <div class="text-ui-muted text-xs mt-1 break-all">{{ JSON.stringify(model) }}</div>
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

    <!-- Panel de configuración (scroll propio: no arrastra el field) -->
    <div class="space-y-4 rounded-xl border border-ui p-4 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto">
      <h3 class="text-sm font-semibold uppercase tracking-wide text-ui-muted">Configuración</h3>

      <div class="grid grid-cols-2 gap-3 [&>*]:min-w-0">
        <KunTextField v-model="label" label="Label" density="compact" />
        <KunTextField v-model="placeholder" label="Placeholder" density="compact" />
        <KunTextField v-model="errorMessage" label="Error message" density="compact" />

        <KunSelect
          v-model="mode"
          v-model:items="modeOptions"
          label="Mode"
          item-value="id"
          item-title="name"
          density="compact"
        />
        <KunSelect
          v-model="align"
          v-model:items="alignOptions"
          label="Align"
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
          v-model="outputSel"
          v-model:items="outputOptions"
          label="Output format"
          item-value="id"
          item-title="name"
          density="compact"
        />

        <KunTextField v-model="timezoneRaw" label="Timezone (vacío = null)" density="compact" placeholder="America/Argentina/Buenos_Aires" />
        <KunTextField v-model="valueFormatRaw" label="Value format (vacío = null)" density="compact" placeholder="YYYY-MM-DD" />
        <KunTextField v-model="displayFormatRaw" label="Display format (vacío = null)" density="compact" placeholder="DD/MM/YYYY" />
        <KunTextField v-model="formatRaw" label="Format legacy (vacío = null)" density="compact" placeholder="YYYY-MM-DD" />

        <KunTextField v-model="startDateRaw" label="Start date (YYYY-MM-DD, vacío = null)" density="compact" placeholder="2026-01-01" />
        <KunTextField v-model="startTimeRaw" label="Start time (HH:mm, vacío = null)" density="compact" placeholder="09:00" />
        <KunTextField v-model="minDateRaw" label="Min date (YYYY-MM-DD)" density="compact" placeholder="2026-01-01" />
        <KunTextField v-model="maxDateRaw" label="Max date (YYYY-MM-DD)" density="compact" placeholder="2026-12-31" />

        <KunTextField v-model="widthRaw" label="Width (vacío = null)" density="compact" placeholder="320px" />
        <KunTextField v-model="calendarWidthRaw" label="Calendar width" density="compact" placeholder="320" />
        <KunTextField v-model="daySize" label="Day size" density="compact" />
        <KunTextField v-model="fontSize" label="Font size" density="compact" />
        <KunTextField v-model="maxHeight" label="Max height" density="compact" />

        <KunSwitch v-model="range" label="Rango" />
        <KunSwitch v-model="autoApply" label="Auto apply" />
        <KunSwitch v-model="enableTime" label="Enable time" />
        <KunSwitch v-model="enableSeconds" label="Enable seconds" />
        <KunSwitch v-model="onlyIcon" label="Solo ícono" />
        <KunSwitch v-model="fullWidth" label="Full width" />
        <KunSwitch v-model="disabled" label="Disabled" />
      </div>
    </div>
  </div>
</template>
