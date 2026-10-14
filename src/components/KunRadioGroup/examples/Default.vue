<script setup lang="ts">
import { ref } from 'vue'
import KunRadioGroup from '../src/components/KunRadioGroup.vue'
import KunRadio from '../../KunRadio/src/components/KunRadio.vue'
import KunSwitch from '../../KunSwitch/src/components/KunSwitch.vue'
import KunSelect from '../../KunSelect/src/components/KunSelect.vue'
import KunTextField from '../../KunTextField/src/components/KunTextField.vue'

// ------------------------------------------------------------------
// v-model principal: se muestra en crudo debajo del grupo
// ------------------------------------------------------------------
const value = ref<string | null>('manzana')

// Opciones genéricas renderizadas vía slot (el grupo no tiene prop items)
const fruits = ref([
  { value: 'manzana', title: 'Manzana' },
  { value: 'banana', title: 'Banana' },
  { value: 'naranja', title: 'Naranja' },
  { value: 'pera', title: 'Pera' },
])

// ------------------------------------------------------------------
// Controles del playground
// ------------------------------------------------------------------
type KunRadioGroupDirection = 'vertical' | 'horizontal'

const label = ref('Fruta favorita')
const name = ref('frutas')
const color = ref('')
const baseColor = ref('')
const trueIcon = ref('$radioboxMarked')
const falseIcon = ref('$radioboxBlank')

const direction = ref<KunRadioGroupDirection>('vertical')
const directionOptions = ref([
  { id: 'vertical', name: 'vertical' },
  { id: 'horizontal', name: 'horizontal' },
])

const inline = ref(false)
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
      <h2 class="text-lg font-semibold">KunRadioGroup</h2>

      <KunRadioGroup
        v-model="value"
        :label="label"
        :name="name"
        :color="color"
        :base-color="baseColor"
        :direction="direction"
        :inline="inline"
        :disabled="disabled"
        :readonly="readonly"
        :error="error"
        :true-icon="trueIcon"
        :false-icon="falseIcon"
        @update:model-value="logEvent('update:modelValue', JSON.stringify($event))"
      >
        <KunRadio
          v-for="fruit in fruits"
          :key="fruit.value"
          :value="fruit.value"
          :label="fruit.title"
        />
      </KunRadioGroup>

      <button
        type="button"
        class="text-xs text-ui-muted underline underline-offset-2 hover:text-ui"
        @click="value = null"
      >
        Limpiar selección (null)
      </button>

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
        <p v-else class="text-xs text-ui-muted">Interactuá con el grupo para ver eventos…</p>
      </div>
    </div>

    <!-- Panel de configuración (scroll propio: no arrastra el grupo) -->
    <div class="space-y-4 rounded-xl border border-ui p-4 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto">
      <h3 class="text-sm font-semibold uppercase tracking-wide text-ui-muted">Configuración</h3>

      <div class="grid grid-cols-2 gap-3 [&>*]:min-w-0">
        <KunTextField v-model="label" label="Label" density="compact" />
        <KunTextField v-model="name" label="Name" density="compact" />
        <KunTextField v-model="color" label="Color (vacío = default)" density="compact" />
        <KunTextField v-model="baseColor" label="Base color (vacío = default)" density="compact" />
        <KunTextField v-model="trueIcon" label="True icon" density="compact" />
        <KunTextField v-model="falseIcon" label="False icon" density="compact" />

        <KunSelect
          v-model="direction"
          v-model:items="directionOptions"
          label="Direction"
          item-value="id"
          item-title="name"
          density="compact"
        />

        <KunSwitch v-model="inline" label="Inline" />
        <KunSwitch v-model="disabled" label="Disabled" />
        <KunSwitch v-model="readonly" label="Readonly" />
        <KunSwitch v-model="error" label="Error" />
      </div>
    </div>
  </div>
</template>
