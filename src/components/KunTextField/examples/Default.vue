<script setup lang="ts">
import { ref, computed } from 'vue'
import KunTextField from '../src/components/KunTextField.vue'
import type { KunTextFieldDensity } from '../src/composables/KunTextFieldProps.js'
import KunSwitch from '../../KunSwitch/src/components/KunSwitch.vue'
import KunSelect from '../../KunSelect/src/components/KunSelect.vue'

// ------------------------------------------------------------------
// v-model principal: se muestra en crudo debajo del campo
// ------------------------------------------------------------------
const value = ref<string | number>('Hola mundo')

// ------------------------------------------------------------------
// Controles del playground
// ------------------------------------------------------------------
const label = ref('Nombre')
const placeholder = ref('Escribí tu nombre…')
const prefix = ref('')
const suffix = ref('')
const hint = ref('Solo letras, por favor')
const errorMessage = ref('')

const type = ref('text')
const typeOptions = ref([
  { id: 'text', name: 'text' },
  { id: 'password', name: 'password (con toggle)' },
  { id: 'email', name: 'email' },
  { id: 'number', name: 'number' },
  { id: 'search', name: 'search' },
  { id: 'tel', name: 'tel' },
  { id: 'url', name: 'url' },
])

const density = ref<KunTextFieldDensity>('default')
const densityOptions = ref([
  { id: 'default', name: 'default' },
  { id: 'comfortable', name: 'comfortable' },
  { id: 'compact', name: 'compact' },
])

// Decoradores (iconos como string; vacío = sin icono)
const prependIcon = ref('')
const appendIcon = ref('')
const prependInnerIcon = ref('')
const appendInnerIcon = ref('')
const prependInnerClass = ref('')
const appendInnerClass = ref('')

// Estilo y diseño (clases Tailwind libres)
const rounded = ref('rounded-md')
const labelSize = ref('text-sm')
const floatingLabelSize = ref('text-xs')
const labelOpacity = ref('opacity-60')
const floatingLabelOpacity = ref('opacity-80')
const labelLeft = ref('')
const floatingLabelLeft = ref('left-2')
const floatingLabelTop = ref('top-[-2px]')
const labelClass = ref('')
const inputTextSize = ref('')
const inputWeight = ref('')
const placeholderTextSize = ref('')
const inputStyle = ref('')

// Atributos HTML nativos
const id = ref('')
const name = ref('')
const autocomplete = ref('off')
const inputmode = ref('')
const pattern = ref('')

const spellcheckRaw = ref('default')
const spellcheckOptions = ref([
  { id: 'default', name: 'default (null)' },
  { id: 'true', name: 'true' },
  { id: 'false', name: 'false' },
])
const spellcheckProp = computed(() => {
  if (spellcheckRaw.value === 'true') return true
  if (spellcheckRaw.value === 'false') return false
  return undefined
})

// Numéricos: se editan como string y se convierten (vacío = null)
const minlengthRaw = ref('')
const maxlengthRaw = ref('20')
const debounceRaw = ref('300')
const minlengthProp = computed(() => (minlengthRaw.value === '' ? undefined : Number(minlengthRaw.value)))
const maxlengthProp = computed(() => (maxlengthRaw.value === '' ? undefined : Number(maxlengthRaw.value)))
const debounceProp = computed(() => (debounceRaw.value === '' ? 300 : Number(debounceRaw.value)))

// Estado (booleans)
const dirty = ref(false)
const textCenter = ref(false)
const error = ref(false)
const required = ref(false)
const disabled = ref(false)
const readonly = ref(false)
const clearable = ref(true)
const counter = ref(false)
const persistentHint = ref(false)
const hideDetails = ref(false)
const validateOnBlur = ref(false)
const showPasswordToggle = ref(true)

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
      <h2 class="text-lg font-semibold">KunTextField</h2>

      <KunTextField
        v-model="value"
        :type="type"
        :placeholder="placeholder"
        :label="label"
        :dirty="dirty"
        :prefix="prefix"
        :suffix="suffix"
        :prepend-icon="prependIcon || undefined"
        :append-icon="appendIcon || undefined"
        :prepend-inner-icon="prependInnerIcon || undefined"
        :append-inner-icon="appendInnerIcon || undefined"
        :prepend-inner-class="prependInnerClass"
        :append-inner-class="appendInnerClass"
        :rounded="rounded"
        :label-size="labelSize"
        :floating-label-size="floatingLabelSize"
        :label-opacity="labelOpacity"
        :floating-label-opacity="floatingLabelOpacity"
        :label-left="labelLeft || undefined"
        :floating-label-left="floatingLabelLeft"
        :floating-label-top="floatingLabelTop"
        :label-class="labelClass"
        :input-text-size="inputTextSize || undefined"
        :input-weight="inputWeight || undefined"
        :placeholder-text-size="placeholderTextSize || undefined"
        :input-style="inputStyle"
        :text-center="textCenter"
        :density="density"
        :error="error"
        :error-message="errorMessage"
        :id="id || undefined"
        :name="name || undefined"
        :autocomplete="autocomplete"
        :required="required"
        :disabled="disabled"
        :readonly="readonly"
        :inputmode="inputmode || undefined"
        :minlength="minlengthProp"
        :maxlength="maxlengthProp"
        :pattern="pattern || undefined"
        :spellcheck="spellcheckProp"
        :clearable="clearable"
        :counter="counter"
        :debounce="debounceProp"
        :hint="hint"
        :persistent-hint="persistentHint"
        :hide-details="hideDetails"
        :validate-on-blur="validateOnBlur"
        :show-password-toggle="showPasswordToggle"
        @focus="logEvent('focus', '')"
        @blur="logEvent('blur', '')"
        @input="logEvent('input', $event)"
        @enter="logEvent('enter', 'Enter ⏎')"
        @key-down="logEvent('keyDown', ($event as KeyboardEvent).key)"
      />

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
        <p v-else class="text-xs text-muted">Interactuá con el campo para ver eventos…</p>
      </div>
    </div>

    <!-- Panel de configuración (scroll propio: no arrastra el field) -->
    <div class="space-y-4 rounded-lg border border-default p-4 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto">
      <h3 class="text-sm font-semibold uppercase tracking-wide text-muted">Configuración</h3>

      <div class="grid grid-cols-2 gap-3 [&>*]:min-w-0">
        <KunTextField v-model="label" label="Label" density="compact" />
        <KunTextField v-model="placeholder" label="Placeholder" density="compact" />
        <KunTextField v-model="prefix" label="Prefix" density="compact" />
        <KunTextField v-model="suffix" label="Suffix" density="compact" />
        <KunTextField v-model="hint" label="Hint" density="compact" />
        <KunTextField v-model="errorMessage" label="Error message" density="compact" />

        <KunSelect
          v-model="type"
          v-model:items="typeOptions"
          label="Type"
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
          v-model="spellcheckRaw"
          v-model:items="spellcheckOptions"
          label="Spellcheck"
          item-value="id"
          item-title="name"
          density="compact"
        />

        <KunTextField v-model="prependIcon" label="Prepend icon" density="compact" />
        <KunTextField v-model="appendIcon" label="Append icon" density="compact" />
        <KunTextField v-model="prependInnerIcon" label="Prepend-inner icon" density="compact" />
        <KunTextField v-model="appendInnerIcon" label="Append-inner icon" density="compact" />
        <KunTextField v-model="prependInnerClass" label="Prepend-inner class" density="compact" />
        <KunTextField v-model="appendInnerClass" label="Append-inner class" density="compact" />

        <KunTextField v-model="id" label="Id" density="compact" />
        <KunTextField v-model="name" label="Name" density="compact" />
        <KunTextField v-model="autocomplete" label="Autocomplete" density="compact" />
        <KunTextField v-model="inputmode" label="Inputmode" density="compact" />
        <KunTextField v-model="pattern" label="Pattern" density="compact" />

        <KunTextField v-model="minlengthRaw" label="Minlength (vacío = null)" density="compact" inputmode="decimal" />
        <KunTextField v-model="maxlengthRaw" label="Maxlength (vacío = null)" density="compact" inputmode="decimal" />
        <KunTextField v-model="debounceRaw" label="Debounce ms" density="compact" inputmode="decimal" />

        <KunTextField v-model="rounded" label="Rounded" density="compact" />
        <KunTextField v-model="labelSize" label="Label size" density="compact" />
        <KunTextField v-model="floatingLabelSize" label="Floating label size" density="compact" />
        <KunTextField v-model="labelOpacity" label="Label opacity" density="compact" />
        <KunTextField v-model="floatingLabelOpacity" label="Floating label opacity" density="compact" />
        <KunTextField v-model="labelLeft" label="Label left" density="compact" />
        <KunTextField v-model="floatingLabelLeft" label="Floating label left" density="compact" />
        <KunTextField v-model="floatingLabelTop" label="Floating label top" density="compact" />
        <KunTextField v-model="labelClass" label="Label class" density="compact" />
        <KunTextField v-model="inputTextSize" label="Input text size" density="compact" />
        <KunTextField v-model="inputWeight" label="Input weight" density="compact" />
        <KunTextField v-model="placeholderTextSize" label="Placeholder text size" density="compact" />
        <KunTextField v-model="inputStyle" label="Input style" density="compact" />

        <KunSwitch v-model="dirty" label="Dirty" />
        <KunSwitch v-model="textCenter" label="Centrado" />
        <KunSwitch v-model="error" label="Error" />
        <KunSwitch v-model="required" label="Required" />
        <KunSwitch v-model="disabled" label="Disabled" />
        <KunSwitch v-model="readonly" label="Readonly" />
        <KunSwitch v-model="clearable" label="Clearable" />
        <KunSwitch v-model="counter" label="Counter" />
        <KunSwitch v-model="persistentHint" label="Persistent hint" />
        <KunSwitch v-model="hideDetails" label="Sin details" />
        <KunSwitch v-model="validateOnBlur" label="Validate on blur" />
        <KunSwitch v-model="showPasswordToggle" label="Password toggle" />
      </div>
    </div>
  </div>
</template>
