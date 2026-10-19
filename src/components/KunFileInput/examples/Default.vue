<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import KunFileInput from '../src/components/KunFileInput.vue'
import type { KunFileInputVariant } from '../src/composables/kunFileInputProps.js'
import KunSwitch from '../../KunSwitch/src/components/KunSwitch.vue'
import KunSelect from '../../KunSelect/src/components/KunSelect.vue'
import KunTextField from '../../KunTextField/src/components/KunTextField.vue'

// ------------------------------------------------------------------
// v-model principal: NO se puede pre-fijar (File solo existe vía
// diálogo del navegador). En crudo se muestran nombres/cuenta.
// ------------------------------------------------------------------
const model = ref<File | File[] | null>(null)

// ------------------------------------------------------------------
// Controles del playground
// ------------------------------------------------------------------
const label = ref('Archivos')
const hint = ref('Seleccioná uno o varios archivos')
const errorMessagesRaw = ref('')
const errorMessagesProp = computed(() => (errorMessagesRaw.value === '' ? undefined : errorMessagesRaw.value))
const counterStringRaw = ref('')
const counterSizeStringRaw = ref('')

const variant = ref<KunFileInputVariant>('filled')
const variantOptions = ref([
  { id: 'filled', name: 'filled' },
  { id: 'outlined', name: 'outlined' },
  { id: 'solo', name: 'solo' },
])

const showSize = ref<boolean | number>(false)
const showSizeOptions = ref<Array<{ id: boolean | number; name: string }>>([
  { id: false, name: 'Oculto' },
  { id: true, name: 'Base 1000' },
  { id: 1024, name: 'Base 1024' },
])

const iconSize = ref('size-4')

// Iconos como string; vacío = sin icono
const prependIcon = ref('')
const appendIcon = ref('')
const prependInnerIcon = ref('')
const appendInnerIcon = ref('')
const clearIcon = ref('')
const prependInnerClass = ref('')
const appendInnerClass = ref('')

const multiple = ref(false)
const clearable = ref(true)
const chips = ref(false)
const dirty = ref(true)
const disabled = ref(false)
const error = ref(false)
const persistentHint = ref(false)
const counter = ref(true)

// Al alternar `multiple` se resetea el modelo al shape correcto.
watch(multiple, (v) => {
  if (v) {
    model.value = model.value === null ? [] : Array.isArray(model.value) ? model.value : [model.value]
  } else {
    model.value = Array.isArray(model.value) ? (model.value[0] ?? null) : model.value
  }
})

// Resumen legible del v-model (File no es JSON-serializable).
const fileSummary = computed(() => {
  const files = Array.isArray(model.value) ? model.value : model.value ? [model.value] : []
  return {
    count: files.length,
    names: files.map((f) => f.name),
    totalBytes: files.reduce((acc, f) => acc + f.size, 0),
  }
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

function describeFiles(v: unknown): string {
  if (v === null || v === undefined) return 'null'
  const files = Array.isArray(v) ? v : [v]
  return files.map((f) => (f as File)?.name ?? String(f)).join(', ') || 'vacío'
}

function describeChange(e: unknown): string {
  const input = (e as Event)?.target as HTMLInputElement | null
  const n = input?.files?.length ?? 0
  return `${n} archivo(s)`
}
</script>

<template>
  <div class="p-4 grid gap-6 lg:grid-cols-2 lg:items-start">
    <!-- Vista previa + v-model (fija: siempre visible al scrollear opciones) -->
    <div class="space-y-3 min-w-0 lg:sticky lg:top-4">
      <h2 class="text-lg font-semibold">KunFileInput</h2>

      <KunFileInput
        v-model="model"
        :multiple="multiple"
        :clearable="clearable"
        :chips="chips"
        :show-size="showSize"
        :label="label || undefined"
        :dirty="dirty"
        :disabled="disabled"
        :error="error"
        :error-messages="errorMessagesProp"
        :hint="hint || undefined"
        :persistent-hint="persistentHint"
        :counter="counter"
        :counter-string="counterStringRaw || undefined"
        :counter-size-string="counterSizeStringRaw || undefined"
        :prepend-icon="prependIcon || undefined"
        :append-icon="appendIcon || undefined"
        :prepend-inner-icon="prependInnerIcon || undefined"
        :append-inner-icon="appendInnerIcon || undefined"
        :prepend-inner-class="prependInnerClass"
        :append-inner-class="appendInnerClass"
        :clear-icon="clearIcon || undefined"
        :icon-size="iconSize"
        :variant="variant"
        @update:model-value="logEvent('update:modelValue', describeFiles($event))"
        @click:clear="logEvent('click:clear', '')"
        @click:control="logEvent('click:control', '')"
        @update:focused="logEvent('update:focused', $event)"
        @change="logEvent('change', describeChange($event))"
      />

      <div class="rounded-lg bg-muted p-3 font-mono text-sm">
        <div class="text-muted text-xs mb-1">v-model en crudo (nombres/cuenta — File no es serializable)</div>
        <div>{{ JSON.stringify(fileSummary) }} <span class="text-muted">({{ Array.isArray(model) ? 'array' : model === null ? 'null' : 'File' }})</span></div>
      </div>

      <div class="rounded-lg bg-muted p-3 text-sm">
        <div class="text-muted text-xs mb-1">Últimos eventos</div>
        <ul v-if="eventLog.length" class="space-y-1 font-mono text-xs">
          <li v-for="e in eventLog" :key="e.id">
            <span class="font-semibold">{{ e.name }}</span>
            <span v-if="e.detail" class="text-muted"> — {{ e.detail }}</span>
          </li>
        </ul>
        <p v-else class="text-xs text-muted">Seleccioná archivos para ver eventos…</p>
      </div>
    </div>

    <!-- Panel de configuración (scroll propio: no arrastra el field) -->
    <div class="space-y-4 rounded-lg border border-default p-4 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto">
      <h3 class="text-sm font-semibold uppercase tracking-wide text-muted">Configuración</h3>

      <div class="grid grid-cols-2 gap-3 [&>*]:min-w-0">
        <KunTextField v-model="label" label="Label" density="compact" />
        <KunTextField v-model="hint" label="Hint" density="compact" />
        <KunTextField v-model="errorMessagesRaw" label="Error messages (vacío = ninguno)" density="compact" />
        <KunTextField v-model="counterStringRaw" label="Counter string (vacío = auto)" density="compact" />
        <KunTextField v-model="counterSizeStringRaw" label="Counter size string" density="compact" />
        <KunTextField v-model="iconSize" label="Icon size" density="compact" />

        <KunSelect
          v-model="variant"
          v-model:items="variantOptions"
          label="Variant"
          item-value="id"
          item-title="name"
          density="compact"
        />
        <KunSelect
          v-model="showSize"
          v-model:items="showSizeOptions"
          label="Show size"
          item-value="id"
          item-title="name"
          density="compact"
        />

        <KunTextField v-model="prependIcon" label="Prepend icon" density="compact" />
        <KunTextField v-model="appendIcon" label="Append icon" density="compact" />
        <KunTextField v-model="prependInnerIcon" label="Prepend-inner icon" density="compact" />
        <KunTextField v-model="appendInnerIcon" label="Append-inner icon" density="compact" />
        <KunTextField v-model="clearIcon" label="Clear icon" density="compact" />
        <KunTextField v-model="prependInnerClass" label="Prepend-inner class" density="compact" />
        <KunTextField v-model="appendInnerClass" label="Append-inner class" density="compact" />

        <KunSwitch v-model="multiple" label="Multiple" />
        <KunSwitch v-model="clearable" label="Clearable" />
        <KunSwitch v-model="chips" label="Chips" />
        <KunSwitch v-model="dirty" label="Dirty" />
        <KunSwitch v-model="disabled" label="Disabled" />
        <KunSwitch v-model="error" label="Error" />
        <KunSwitch v-model="persistentHint" label="Persistent hint" />
        <KunSwitch v-model="counter" label="Counter" />
      </div>
    </div>
  </div>
</template>
