<script setup lang="ts">
import { ref, computed } from 'vue'
import KunTextarea from '../src/components/KunTextarea.vue'
import KunSwitch from '../../KunSwitch/src/components/KunSwitch.vue'
import KunSelect from '../../KunSelect/src/components/KunSelect.vue'
import KunTextField from '../../KunTextField/src/components/KunTextField.vue'

// ------------------------------------------------------------------
// Tipos de unión (kunTextareaProps.ts no exporta tipos: se definen aquí
// a partir de los valores documentados en cada prop)
// ------------------------------------------------------------------
type KunTextareaVariant = 'filled' | 'outlined' | 'underlined' | 'solo'
type KunTextareaDensity = 'default' | 'comfortable' | 'compact'
type KunTextareaTextAlign = 'left' | 'center' | 'right'
type KunTextareaFormatModel = 'auto' | 'json' | 'plain'
type KunTextareaHideDetails = boolean | 'auto'

// ------------------------------------------------------------------
// v-model principal: se muestra en crudo debajo del campo
// ------------------------------------------------------------------
const value = ref<string>('Hola mundo\nSegunda línea para probar el auto-grow…')

// ------------------------------------------------------------------
// Controles del playground
// ------------------------------------------------------------------
const label = ref('Descripción')
const hint = ref('Contanos un poco más')
const placeholder = ref('Escribí tu texto…')
const name = ref('')
const id = ref('')
const autocomplete = ref('off')

const bgColor = ref('')
const textColor = ref('')
const color = ref('')
const focusRingColor = ref('ring-ui-focus')
const loadingColor = ref('')
const rounded = ref('')

const prependIcon = ref('')
const appendIcon = ref('')
const prependInnerIcon = ref('')
const appendInnerIcon = ref('')

const errorMessage = ref('')

const variant = ref<KunTextareaVariant>('outlined')
const variantOptions = ref([
  { id: 'filled', name: 'filled' },
  { id: 'outlined', name: 'outlined' },
  { id: 'underlined', name: 'underlined' },
  { id: 'solo', name: 'solo' },
])

const density = ref<KunTextareaDensity>('default')
const densityOptions = ref([
  { id: 'default', name: 'default' },
  { id: 'comfortable', name: 'comfortable' },
  { id: 'compact', name: 'compact' },
])

const textAlign = ref<KunTextareaTextAlign>('left')
const textAlignOptions = ref([
  { id: 'left', name: 'left' },
  { id: 'center', name: 'center' },
  { id: 'right', name: 'right' },
])

const formatModel = ref<KunTextareaFormatModel>('auto')
const formatModelOptions = ref([
  { id: 'auto', name: 'auto (detecta JSON)' },
  { id: 'json', name: 'json (siempre)' },
  { id: 'plain', name: 'plain (nunca JSON)' },
])

const hideDetails = ref<KunTextareaHideDetails>(false)
const hideDetailsOptions = ref([
  { id: false, name: 'false' },
  { id: true, name: 'true' },
  { id: 'auto', name: 'auto' },
])

// Numéricos: se editan como string y se convierten (vacío = undefined,
// salvo debounceTime que cae a su default 300 como en el template)
const rowsRaw = ref('3')
const maxRowsRaw = ref('')
const maxLengthRaw = ref('120')
const maxErrorsRaw = ref('3')
const debounceRaw = ref('300')
const rowsProp = computed(() => (rowsRaw.value === '' ? undefined : Number(rowsRaw.value)))
const maxRowsProp = computed(() => (maxRowsRaw.value === '' ? undefined : Number(maxRowsRaw.value)))
const maxLengthProp = computed(() => (maxLengthRaw.value === '' ? undefined : Number(maxLengthRaw.value)))
const maxErrorsProp = computed(() => (maxErrorsRaw.value === '' ? undefined : Number(maxErrorsRaw.value)))
const debounceProp = computed(() => (debounceRaw.value === '' ? 300 : Number(debounceRaw.value)))

const persistentHint = ref(false)
const loading = ref(false)
const clearable = ref(true)
const persistentClear = ref(false)
const blurValidation = ref(false)
const error = ref(false)
const counter = ref(true)
const persistentCounter = ref(false)
const autoGrow = ref(true)
const noResize = ref(false)
const dirty = ref(false)
const tile = ref(false)
const flat = ref(false)
const clearIcon = ref(false)
const disabled = ref(false)
const readonly = ref(false)

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
      <h2 class="text-lg font-semibold">KunTextarea</h2>

      <KunTextarea
        v-model="value"
        :label="label || undefined"
        :hint="hint || undefined"
        :persistent-hint="persistentHint"
        :bg-color="bgColor || undefined"
        :text-color="textColor || undefined"
        :text-align="textAlign"
        :format-model="formatModel"
        :loading="loading"
        :prepend-icon="prependIcon || undefined"
        :append-icon="appendIcon || undefined"
        :prepend-inner-icon="prependInnerIcon || undefined"
        :append-inner-icon="appendInnerIcon || undefined"
        :clearable="clearable"
        :persistent-clear="persistentClear"
        :hide-details="hideDetails"
        :disabled="disabled"
        :readonly="readonly"
        :blur-validation="blurValidation"
        :error-messages="errorMessage || undefined"
        :max-errors="maxErrorsProp"
        :error="error"
        :counter="counter"
        :persistent-counter="persistentCounter"
        :max-length="maxLengthProp"
        :auto-grow="autoGrow"
        :no-resize="noResize"
        :max-rows="maxRowsProp"
        :placeholder="placeholder || undefined"
        :name="name || undefined"
        :id="id || undefined"
        :autocomplete="autocomplete || undefined"
        :rows="rowsProp"
        :dirty="dirty"
        :variant="variant"
        :density="density"
        :rounded="rounded || undefined"
        :tile="tile"
        :flat="flat"
        :color="color || undefined"
        :focus-ring-color="focusRingColor || undefined"
        :loading-color="loadingColor || undefined"
        :clear-icon="clearIcon"
        :debounce-time="debounceProp"
        @update:model-value="logEvent('update:modelValue', $event)"
        @update:focused="logEvent('update:focused', $event)"
        @click:clear="logEvent('click:clear', '')"
        @click:control="logEvent('click:control', $event)"
        @mousedown:control="logEvent('mousedown:control', '')"
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
        <KunTextField v-model="hint" label="Hint" density="compact" />
        <KunTextField v-model="errorMessage" label="Error message" density="compact" />

        <KunSelect
          v-model="variant"
          v-model:items="variantOptions"
          label="Variant"
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
          v-model="textAlign"
          v-model:items="textAlignOptions"
          label="Text align"
          item-value="id"
          item-title="name"
          density="compact"
        />
        <KunSelect
          v-model="formatModel"
          v-model:items="formatModelOptions"
          label="Format model"
          item-value="id"
          item-title="name"
          density="compact"
        />
        <KunSelect
          v-model="hideDetails"
          v-model:items="hideDetailsOptions"
          label="Hide details"
          item-value="id"
          item-title="name"
          density="compact"
        />

        <KunTextField v-model="prependIcon" label="Prepend icon" density="compact" />
        <KunTextField v-model="appendIcon" label="Append icon" density="compact" />
        <KunTextField v-model="prependInnerIcon" label="Prepend-inner icon" density="compact" />
        <KunTextField v-model="appendInnerIcon" label="Append-inner icon" density="compact" />

        <KunTextField v-model="id" label="Id" density="compact" />
        <KunTextField v-model="name" label="Name" density="compact" />
        <KunTextField v-model="autocomplete" label="Autocomplete" density="compact" />

        <KunTextField v-model="rowsRaw" label="Rows (vacío = default)" density="compact" inputmode="decimal" />
        <KunTextField v-model="maxRowsRaw" label="Max rows (vacío = sin límite)" density="compact" inputmode="decimal" />
        <KunTextField v-model="maxLengthRaw" label="Max length (vacío = sin límite)" density="compact" inputmode="decimal" />
        <KunTextField v-model="maxErrorsRaw" label="Max errors (vacío = default)" density="compact" inputmode="decimal" />
        <KunTextField v-model="debounceRaw" label="Debounce ms" density="compact" inputmode="decimal" />

        <KunTextField v-model="bgColor" label="Bg color" density="compact" />
        <KunTextField v-model="textColor" label="Text color" density="compact" />
        <KunTextField v-model="color" label="Color (acento)" density="compact" />
        <KunTextField v-model="focusRingColor" label="Focus ring color" density="compact" />
        <KunTextField v-model="loadingColor" label="Loading color" density="compact" />
        <KunTextField v-model="rounded" label="Rounded" density="compact" />

        <KunSwitch v-model="persistentHint" label="Persistent hint" />
        <KunSwitch v-model="loading" label="Loading" />
        <KunSwitch v-model="clearable" label="Clearable" />
        <KunSwitch v-model="persistentClear" label="Persistent clear" />
        <KunSwitch v-model="clearIcon" label="Clear icon" />
        <KunSwitch v-model="counter" label="Counter" />
        <KunSwitch v-model="persistentCounter" label="Persistent counter" />
        <KunSwitch v-model="autoGrow" label="Auto grow" />
        <KunSwitch v-model="noResize" label="Sin resize" />
        <KunSwitch v-model="blurValidation" label="Blur validation" />
        <KunSwitch v-model="error" label="Error" />
        <KunSwitch v-model="dirty" label="Dirty" />
        <KunSwitch v-model="tile" label="Tile" />
        <KunSwitch v-model="flat" label="Flat" />
        <KunSwitch v-model="disabled" label="Disabled" />
        <KunSwitch v-model="readonly" label="Readonly" />
      </div>
    </div>
  </div>
</template>
