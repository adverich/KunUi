<script setup lang="ts">
import { ref, computed } from 'vue'
import KunNumberField from '../src/components/KunNumberField.vue'
import type { KunNumberFieldDensity, KunNumberFieldControlVariant, KunNumberFieldFormatMode } from '../src/composables/KunNumberFieldProps.js'
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

const formatMode = ref<KunNumberFieldFormatMode>('natural')
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

const controlVariant = ref<KunNumberFieldControlVariant>('default')
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
// Etiqueta · estilo
// ------------------------------------------------------------------
const labelColor = ref('text-ui')
const floatingLabelColor = ref('')
const labelSize = ref('text-sm')
const floatingLabelSize = ref('text-xs')
const labelOpacity = ref('opacity-60')
const floatingLabelOpacity = ref('opacity-80')
const labelLeft = ref('')
const floatingLabelLeft = ref('left-2')
const floatingLabelTop = ref('-top-2')
const labelClass = ref('')
const dirty = ref(false)

// ------------------------------------------------------------------
// Iconos (nombres de icono; vacío = sin icono)
// ------------------------------------------------------------------
const prependIcon = ref('')
const appendIcon = ref('')
const prependInnerIcon = ref('')
const appendInnerIcon = ref('')
const prependInnerClass = ref('')
const appendInnerClass = ref('')

// ------------------------------------------------------------------
// Colores y texto
// ------------------------------------------------------------------
const rounded = ref('rounded')
const borderColor = ref('border-ui')
const textColor = ref('text-ui')
const inputTextSize = ref('')
const inputWeight = ref('')
const placeholderColor = ref('placeholder-ui')
const placeholderTextSize = ref('')
const inputStyle = ref('')
const bgInput = ref('bg-field-background')
const controlClass = ref('')

// ------------------------------------------------------------------
// Estado y ayuda
// ------------------------------------------------------------------
const error = ref(false)
const errorMessage = ref('')
const hint = ref('')
const persistentHint = ref(false)
const required = ref(false)
const counter = ref(false)
const validateOnBlur = ref(false)

// ------------------------------------------------------------------
// Nativo
// ------------------------------------------------------------------
const idRaw = ref('')
const nameRaw = ref('')
const autocomplete = ref('off')
const separator = ref(',')
const maxlengthRaw = ref('')
const maxlengthProp = computed(() => (maxlengthRaw.value === '' ? null : Number(maxlengthRaw.value)))
const debounceRaw = ref('300')
const debounceProp = computed(() => (debounceRaw.value === '' ? 300 : Number(debounceRaw.value)))

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
        :label-color="labelColor"
        :floating-label-color="floatingLabelColor || null"
        :label-size="labelSize"
        :floating-label-size="floatingLabelSize"
        :label-opacity="labelOpacity"
        :floating-label-opacity="floatingLabelOpacity"
        :label-left="labelLeft || null"
        :floating-label-left="floatingLabelLeft"
        :floating-label-top="floatingLabelTop"
        :label-class="labelClass"
        :dirty="dirty"
        :prepend-icon="prependIcon || undefined"
        :append-icon="appendIcon || undefined"
        :prepend-inner-icon="prependInnerIcon || ''"
        :append-inner-icon="appendInnerIcon || ''"
        :prepend-inner-class="prependInnerClass || undefined"
        :append-inner-class="appendInnerClass || undefined"
        :rounded="rounded"
        :border-color="borderColor"
        :text-color="textColor"
        :input-text-size="inputTextSize || null"
        :input-weight="inputWeight || null"
        :placeholder-color="placeholderColor"
        :placeholder-text-size="placeholderTextSize || null"
        :input-style="inputStyle"
        :bg-input="bgInput"
        :control-class="controlClass || undefined"
        :error="error"
        :error-messages="errorMessage"
        :hint="hint"
        :persistent-hint="persistentHint"
        :required="required"
        :maxlength="maxlengthProp"
        :counter="counter"
        :validate-on-blur="validateOnBlur"
        :id="idRaw || null"
        :name="nameRaw || null"
        :autocomplete="autocomplete"
        :separator="separator"
        :debounce="debounceProp"
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

    <!-- Panel de configuración (scroll propio: no arrastra el field) -->
    <div class="space-y-4 rounded-xl border border-ui p-4 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto">
      <h3 class="text-sm font-semibold uppercase tracking-wide text-ui-muted">Configuración</h3>

      <div class="grid grid-cols-2 gap-3 [&>*]:min-w-0">
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
        <KunTextField v-model="stepRaw" label="Step" density="compact" inputmode="decimal" />

        <KunTextField v-model="minRaw" label="Min (vacío = sin límite)" density="compact" inputmode="decimal" />
        <KunTextField v-model="maxRaw" label="Max (vacío = sin límite)" density="compact" inputmode="decimal" />

        <p class="col-span-2 pt-2 text-xs font-semibold uppercase tracking-wide text-ui-muted">Etiqueta · estilo</p>
        <KunTextField v-model="labelColor" label="Label color" density="compact" />
        <KunTextField v-model="floatingLabelColor" label="Floating label color (vacío = labelColor)" density="compact" />
        <KunTextField v-model="labelSize" label="Label size" density="compact" />
        <KunTextField v-model="floatingLabelSize" label="Floating label size" density="compact" />
        <KunTextField v-model="labelOpacity" label="Label opacity" density="compact" />
        <KunTextField v-model="floatingLabelOpacity" label="Floating label opacity" density="compact" />
        <KunTextField v-model="labelLeft" label="Label left (vacío = auto)" density="compact" />
        <KunTextField v-model="floatingLabelLeft" label="Floating label left" density="compact" />
        <KunTextField v-model="floatingLabelTop" label="Floating label top" density="compact" />
        <KunTextField v-model="labelClass" label="Label class" density="compact" />
        <KunSwitch v-model="dirty" label="Dirty (flota label)" />

        <p class="col-span-2 pt-2 text-xs font-semibold uppercase tracking-wide text-ui-muted">Iconos</p>
        <KunTextField v-model="prependIcon" label="Prepend icon" density="compact" />
        <KunTextField v-model="appendIcon" label="Append icon" density="compact" />
        <KunTextField v-model="prependInnerIcon" label="Prepend inner icon" density="compact" />
        <KunTextField v-model="appendInnerIcon" label="Append inner icon" density="compact" />
        <KunTextField v-model="prependInnerClass" label="Prepend inner class" density="compact" />
        <KunTextField v-model="appendInnerClass" label="Append inner class" density="compact" />

        <p class="col-span-2 pt-2 text-xs font-semibold uppercase tracking-wide text-ui-muted">Colores y texto</p>
        <KunTextField v-model="rounded" label="Rounded" density="compact" />
        <KunTextField v-model="borderColor" label="Border color" density="compact" />
        <KunTextField v-model="textColor" label="Text color" density="compact" />
        <KunTextField v-model="inputTextSize" label="Input text size (vacío = text-sm)" density="compact" />
        <KunTextField v-model="inputWeight" label="Input weight (vacío = hereda)" density="compact" />
        <KunTextField v-model="placeholderColor" label="Placeholder color" density="compact" />
        <KunTextField v-model="placeholderTextSize" label="Placeholder text size" density="compact" />
        <KunTextField v-model="inputStyle" label="Input style" density="compact" />
        <KunTextField v-model="bgInput" label="Background" density="compact" />

        <p class="col-span-2 pt-2 text-xs font-semibold uppercase tracking-wide text-ui-muted">Estado y ayuda</p>
        <KunSwitch v-model="error" label="Error" />
        <KunTextField v-model="errorMessage" label="Error messages" density="compact" />
        <KunTextField v-model="hint" label="Hint" density="compact" />
        <KunSwitch v-model="persistentHint" label="Persistent hint" />
        <KunSwitch v-model="required" label="Required" />
        <KunSwitch v-model="counter" label="Counter" />
        <KunSwitch v-model="validateOnBlur" label="Validate on blur" />

        <p class="col-span-2 pt-2 text-xs font-semibold uppercase tracking-wide text-ui-muted">Nativo</p>
        <KunTextField v-model="idRaw" label="Id" density="compact" />
        <KunTextField v-model="nameRaw" label="Name" density="compact" />
        <KunTextField v-model="autocomplete" label="Autocomplete" density="compact" />
        <KunTextField v-model="separator" label="Separator" density="compact" />
        <KunTextField v-model="maxlengthRaw" label="Maxlength (vacío = sin límite)" density="compact" inputmode="decimal" />
        <KunTextField v-model="debounceRaw" label="Debounce (ms)" density="compact" inputmode="decimal" />

        <p class="col-span-2 pt-2 text-xs font-semibold uppercase tracking-wide text-ui-muted">Densidad y controles</p>
        <KunTextField v-model="controlClass" label="Control class (ej. px-4)" density="compact" />
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
