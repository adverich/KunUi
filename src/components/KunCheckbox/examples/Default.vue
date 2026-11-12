<script setup lang="ts">
import { ref, computed } from 'vue'
import KunCheckbox from '../src/components/KunCheckbox.vue'
import KunSwitch from '../../KunSwitch/src/components/KunSwitch.vue'
import KunSelect from '../../KunSelect/src/components/KunSelect.vue'
import KunTextField from '../../KunTextField/src/components/KunTextField.vue'
import { KUN_COLORS, type KunColor } from '../../../theme/kunVariants.js'

// ------------------------------------------------------------------
// kunCheckboxProps.ts no exporta tipos union: tipos locales para
// cumplir con vue-tsc estricto en los refs del playground.
// ------------------------------------------------------------------
type CheckboxDensity = 'default' | 'comfortable' | 'compact'
type CheckboxDirection = 'horizontal' | 'vertical'
type CheckboxSize = 'sm' | 'md' | 'lg'
type CheckboxValidateOn = 'blur' | 'input'
type CheckboxHideDetailsSel = 'visible' | 'hidden' | 'auto'

// ------------------------------------------------------------------
// v-model principal (single: boolean | null, null = vacio) + grupo
// multiple con array compartido.
// ------------------------------------------------------------------
const value = ref<boolean | null>(true)
const groupValue = ref<unknown[]>(['opcion-1'])

// Preset indicador on/off con iconColor: caja neutra + glifo coloreado.
const indicatorOn = ref(true)
const indicatorOff = ref(false)

// ------------------------------------------------------------------
// Controles del playground (demo single)
// ------------------------------------------------------------------
const label = ref('Acepto los términos')
const hint = ref('Podés cambiar esta elección más tarde')
const name = ref('demo-checkbox')

const density = ref<CheckboxDensity>('default')
const densityOptions = ref([
  { id: 'default', name: 'default' },
  { id: 'comfortable', name: 'comfortable' },
  { id: 'compact', name: 'compact' },
])

const direction = ref<CheckboxDirection>('horizontal')
const directionOptions = ref([
  { id: 'horizontal', name: 'horizontal (label al lado)' },
  { id: 'vertical', name: 'vertical (label debajo)' },
])

const size = ref<CheckboxSize>('md')
const sizeOptions = ref([
  { id: 'sm', name: 'sm' },
  { id: 'md', name: 'md' },
  { id: 'lg', name: 'lg' },
])

const validateOn = ref<CheckboxValidateOn>('blur')
const validateOnOptions = ref([
  { id: 'blur', name: 'blur' },
  { id: 'input', name: 'input' },
])

const hideDetailsSel = ref<CheckboxHideDetailsSel>('visible')
const hideDetailsOptions = ref([
  { id: 'visible', name: 'visible' },
  { id: 'hidden', name: 'hidden' },
  { id: 'auto', name: 'auto' },
])
const hideDetailsProp = computed(() =>
  hideDetailsSel.value === 'visible' ? false : hideDetailsSel.value === 'hidden' ? true : 'auto',
)

const maxErrors = ref(1)
const maxErrorsOptions = ref([
  { id: 1, name: '1 error' },
  { id: 2, name: '2 errores' },
  { id: 3, name: '3 errores' },
])

const color = ref('')
const baseColor = ref('')
const iconColor = ref('')
const colorOptions = ref([
  { id: '', name: '(default: primary)' },
  ...KUN_COLORS.map(c => ({ id: c, name: c })),
])
const colorProp = computed<KunColor | null>(() => (color.value === '' ? null : color.value as KunColor))
const baseColorProp = computed<KunColor | null>(() => (baseColor.value === '' ? null : baseColor.value as KunColor))
const iconColorProp = computed<KunColor | null>(() => (iconColor.value === '' ? null : iconColor.value as KunColor))

const prependIcon = ref('')
const appendIcon = ref('')
const prependIconProp = computed(() => (prependIcon.value === '' ? undefined : prependIcon.value))
const appendIconProp = computed(() => (appendIcon.value === '' ? undefined : appendIcon.value))

const errorText = ref('')
const errorMessagesProp = computed(() => (errorText.value === '' ? undefined : [errorText.value]))

const indeterminate = ref(false)
const disabled = ref(false)
const readonly = ref(false)
const error = ref(false)
const persistentHint = ref(false)
const ripple = ref(true)
const glow = ref(false)
const centerAffix = ref(true)

function parseCheckboxValue(raw: string): unknown {
  if (raw === 'true') return true
  if (raw === 'false') return false
  if (raw !== '' && !Number.isNaN(Number(raw))) return Number(raw)
  return raw
}

const trueValueRaw = ref('true')
const falseValueRaw = ref('false')
const trueValueProp = computed(() => parseCheckboxValue(trueValueRaw.value))
const falseValueProp = computed(() => parseCheckboxValue(falseValueRaw.value))

const width = ref('')
const minWidth = ref('')
const maxWidth = ref('')

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
      <h2 class="text-lg font-semibold">KunCheckbox</h2>

      <KunCheckbox
        v-model="value"
        :label="label"
        :hint="hint"
        :name="name"
        :density="density"
        :direction="direction"
        :size="size"
        :validate-on="validateOn"
        :hide-details="hideDetailsProp"
        :max-errors="maxErrors"
        :color="colorProp"
        :base-color="baseColorProp"
        :icon-color="iconColorProp"
        :prepend-icon="prependIconProp"
        :append-icon="appendIconProp"
        :error-messages="errorMessagesProp"
        :true-value="trueValueProp"
        :false-value="falseValueProp"
        :width="width || undefined"
        :min-width="minWidth || undefined"
        :max-width="maxWidth || undefined"
        :indeterminate="indeterminate"
        :disabled="disabled"
        :readonly="readonly"
        :error="error"
        :persistent-hint="persistentHint"
        :ripple="ripple"
        :glow="glow"
        :center-affix="centerAffix"
        @update:model-value="logEvent('update:modelValue', $event)"
        @update:focused="logEvent('update:focused', $event)"
        @click:prepend="logEvent('click:prepend', '')"
        @click:append="logEvent('click:append', '')"
      />

      <div class="space-y-2 rounded-lg border border-default p-3">
        <div class="text-muted text-xs">Indicador on/off con iconColor (caja neutra + glifo)</div>
        <KunCheckbox v-model="indicatorOn" label="Activo" icon-color="success" hide-details />
        <KunCheckbox v-model="indicatorOff" label="Inactivo" icon-color="error" hide-details />
        <div class="font-mono text-xs">{{ indicatorOn }} / {{ indicatorOff }}</div>
      </div>

      <div class="space-y-2 rounded-lg border border-default p-3">
        <div class="text-muted text-xs">Grupo múltiple (array v-model compartido)</div>
        <KunCheckbox v-model="groupValue" multiple value="opcion-1" label="Opción 1" />
        <KunCheckbox v-model="groupValue" multiple value="opcion-2" label="Opción 2" />
        <KunCheckbox v-model="groupValue" multiple value="opcion-3" label="Opción 3" />
        <div class="font-mono text-xs">{{ JSON.stringify(groupValue) }}</div>
      </div>

      <div class="rounded-lg bg-muted p-3 font-mono text-sm">
        <div class="text-muted text-xs mb-1">v-model en crudo</div>
        <div>{{ JSON.stringify(value) }} <span class="text-muted">({{ typeof value }})</span></div>
      </div>

      <div class="rounded-lg bg-muted p-3 text-sm">
        <div class="text-muted text-xs mb-1">Últimos eventos</div>
        <ul v-if="eventLog.length" class="space-y-1 font-mono text-xs">
          <li v-for="e in eventLog" :key="e.id">
            <span class="font-semibold">{{ e.name }}</span>
            <span v-if="e.detail" class="text-muted"> — {{ e.detail }}</span>
          </li>
        </ul>
        <p v-else class="text-xs text-muted">Interactuá con el checkbox para ver eventos…</p>
      </div>
    </div>

    <!-- Panel de configuración (scroll propio: no arrastra el checkbox) -->
    <div class="space-y-4 rounded-lg border border-default p-4 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto">
      <h3 class="text-sm font-semibold uppercase tracking-wide text-muted">Configuración</h3>

      <div class="grid grid-cols-2 gap-3 [&>*]:min-w-0">
        <KunTextField v-model="label" label="Label" density="compact" />
        <KunTextField v-model="hint" label="Hint" density="compact" />
        <KunTextField v-model="name" label="Name (input nativo)" density="compact" />
        <KunTextField v-model="errorText" label="Error externo (vacío = sin error)" density="compact" />
        <KunSelect
          v-model="color"
          v-model:items="colorOptions"
          label="Color (caja activa)"
          density="compact"
        />
        <KunSelect
          v-model="iconColor"
          v-model:items="colorOptions"
          label="Icon color (glifo)"
          density="compact"
        />
        <KunSelect
          v-model="baseColor"
          v-model:items="colorOptions"
          label="Base color (caja inactiva)"
          density="compact"
        />
        <KunTextField v-model="prependIcon" label="Prepend icon (ej. $star)" density="compact" />
        <KunTextField v-model="appendIcon" label="Append icon (ej. $star)" density="compact" />
        <KunTextField v-model="trueValueRaw" label="True value" density="compact" />
        <KunTextField v-model="falseValueRaw" label="False value" density="compact" />
        <KunTextField v-model="width" label="Width" density="compact" />
        <KunTextField v-model="minWidth" label="Min width" density="compact" />
        <KunTextField v-model="maxWidth" label="Max width" density="compact" />

        <KunSelect
          v-model="density"
          v-model:items="densityOptions"
          label="Density"
          item-value="id"
          item-title="name"
          density="compact"
        />
        <KunSelect
          v-model="direction"
          v-model:items="directionOptions"
          label="Direction"
          item-value="id"
          item-title="name"
          density="compact"
        />
        <KunSelect
          v-model="size"
          v-model:items="sizeOptions"
          label="Size"
          item-value="id"
          item-title="name"
          density="compact"
        />
        <KunSelect
          v-model="validateOn"
          v-model:items="validateOnOptions"
          label="Validate on"
          item-value="id"
          item-title="name"
          density="compact"
        />
        <KunSelect
          v-model="hideDetailsSel"
          v-model:items="hideDetailsOptions"
          label="Hide details"
          item-value="id"
          item-title="name"
          density="compact"
        />
        <KunSelect
          v-model="maxErrors"
          v-model:items="maxErrorsOptions"
          label="Max errors"
          item-value="id"
          item-title="name"
          density="compact"
        />

        <KunSwitch v-model="indeterminate" label="Indeterminate" />
        <KunSwitch v-model="error" label="Error" />
        <KunSwitch v-model="persistentHint" label="Persistent hint" />
        <KunSwitch v-model="ripple" label="Ripple" />
        <KunSwitch v-model="glow" label="Glow" />
        <KunSwitch v-model="centerAffix" label="Center affix" />
        <KunSwitch v-model="disabled" label="Disabled" />
        <KunSwitch v-model="readonly" label="Readonly" />
      </div>
    </div>
  </div>
</template>
