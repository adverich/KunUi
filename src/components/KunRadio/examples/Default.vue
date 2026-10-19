<script setup lang="ts">
import { ref, computed } from 'vue'
import KunRadio from '../src/components/KunRadio.vue'
import KunSwitch from '../../KunSwitch/src/components/KunSwitch.vue'
import KunTextField from '../../KunTextField/src/components/KunTextField.vue'

// ------------------------------------------------------------------
// v-models: aceptan null como "vacío" (nada seleccionado)
// ------------------------------------------------------------------
const singleValue = ref<string | number | boolean | Record<string, unknown> | null>(null)
const groupValue = ref<string | number | boolean | Record<string, unknown> | null>('b')

// ------------------------------------------------------------------
// Controles del playground (props de KunRadio)
// ------------------------------------------------------------------
const label = ref('Opción individual')
const color = ref('text-primary')
const baseColor = ref('text-muted')
const name = ref('kun-radio-demo')
const idRaw = ref('')
const trueIconRaw = ref('')
const falseIconRaw = ref('')

const idProp = computed(() => (idRaw.value === '' ? undefined : idRaw.value))
const nameProp = computed(() => (name.value === '' ? undefined : name.value))
const trueIconProp = computed(() => (trueIconRaw.value === '' ? undefined : trueIconRaw.value))
const falseIconProp = computed(() => (falseIconRaw.value === '' ? undefined : falseIconRaw.value))

const trueValue = ref(true)
const falseValue = ref(false)

const disabled = ref(false)
const readonly = ref(false)
const error = ref(false)

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
      <h2 class="text-lg font-semibold">KunRadio</h2>

      <div class="space-y-4">
        <div class="space-y-2">
          <p class="text-xs font-medium uppercase tracking-wide text-muted">Individual</p>
          <KunRadio
            v-model="singleValue"
            value="single"
            :label="label"
            :color="color"
            :base-color="baseColor"
            :true-icon="trueIconProp"
            :false-icon="falseIconProp"
            :name="nameProp"
            :id="idProp"
            :true-value="trueValue"
            :false-value="falseValue"
            :disabled="disabled"
            :readonly="readonly"
            :error="error"
            @update:model-value="logEvent('update:modelValue', $event)"
            @focus="logEvent('focus', 'single')"
            @blur="logEvent('blur', 'single')"
          />
          <button
            type="button"
            class="text-xs text-muted underline underline-offset-2 hover:text-default"
            @click="singleValue = null"
          >
            Limpiar (null)
          </button>
        </div>

        <div class="space-y-2">
          <p class="text-xs font-medium uppercase tracking-wide text-muted">Grupo (mismo v-model)</p>
          <div class="flex flex-col gap-2">
            <KunRadio
              v-model="groupValue"
              value="a"
              label="Opción A"
              :color="color"
              :base-color="baseColor"
              :true-icon="trueIconProp"
              :false-icon="falseIconProp"
              :name="nameProp"
              :disabled="disabled"
              :readonly="readonly"
              :error="error"
              @update:model-value="logEvent('update:modelValue', $event)"
              @focus="logEvent('focus', 'a')"
              @blur="logEvent('blur', 'a')"
            />
            <KunRadio
              v-model="groupValue"
              value="b"
              label="Opción B"
              :color="color"
              :base-color="baseColor"
              :true-icon="trueIconProp"
              :false-icon="falseIconProp"
              :name="nameProp"
              :disabled="disabled"
              :readonly="readonly"
              :error="error"
              @update:model-value="logEvent('update:modelValue', $event)"
              @focus="logEvent('focus', 'b')"
              @blur="logEvent('blur', 'b')"
            />
            <KunRadio
              v-model="groupValue"
              value="c"
              label="Opción C"
              :color="color"
              :base-color="baseColor"
              :true-icon="trueIconProp"
              :false-icon="falseIconProp"
              :name="nameProp"
              :disabled="disabled"
              :readonly="readonly"
              :error="error"
              @update:model-value="logEvent('update:modelValue', $event)"
              @focus="logEvent('focus', 'c')"
              @blur="logEvent('blur', 'c')"
            />
          </div>
          <button
            type="button"
            class="text-xs text-muted underline underline-offset-2 hover:text-default"
            @click="groupValue = null"
          >
            Limpiar (null)
          </button>
        </div>
      </div>

      <div class="rounded-lg bg-muted p-3 font-mono text-sm space-y-1">
        <div class="text-muted text-xs mb-1">v-model en crudo</div>
        <div>single: {{ JSON.stringify(singleValue) }} <span class="text-muted">({{ String(singleValue === null ? 'null' : typeof singleValue) }})</span></div>
        <div>group: {{ JSON.stringify(groupValue) }} <span class="text-muted">({{ String(groupValue === null ? 'null' : typeof groupValue) }})</span></div>
      </div>

      <div class="rounded-lg bg-muted p-3 text-sm">
        <div class="text-muted text-xs mb-1">Últimos eventos</div>
        <ul v-if="eventLog.length" class="space-y-1 font-mono text-xs">
          <li v-for="e in eventLog" :key="e.id">
            <span class="font-semibold">{{ e.name }}</span>
            <span v-if="e.detail" class="text-muted"> — {{ e.detail }}</span>
          </li>
        </ul>
        <p v-else class="text-xs text-muted">Interactuá con los radios para ver eventos…</p>
      </div>
    </div>

    <!-- Panel de configuración (scroll propio: no arrastra el demo) -->
    <div class="space-y-4 rounded-lg border border-default p-4 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto">
      <h3 class="text-sm font-semibold uppercase tracking-wide text-muted">Configuración</h3>

      <div class="grid grid-cols-2 gap-3 [&>*]:min-w-0">
        <KunTextField v-model="label" label="Label (individual)" density="compact" />
        <KunTextField v-model="color" label="Color (seleccionado)" density="compact" />
        <KunTextField v-model="baseColor" label="Base color" density="compact" />
        <KunTextField v-model="name" label="Name (vacío = sin grupo)" density="compact" />
        <KunTextField v-model="idRaw" label="Id (vacío = auto)" density="compact" />
        <KunTextField v-model="trueIconRaw" label="True icon (vacío = default)" density="compact" />
        <KunTextField v-model="falseIconRaw" label="False icon (vacío = default)" density="compact" />
        <KunSwitch v-model="trueValue" label="True value" />
        <KunSwitch v-model="falseValue" label="False value" />

        <KunSwitch v-model="disabled" label="Disabled" />
        <KunSwitch v-model="readonly" label="Readonly" />
        <KunSwitch v-model="error" label="Error" />
      </div>
    </div>
  </div>
</template>
