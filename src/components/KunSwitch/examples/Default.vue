<script setup lang="ts">
import { ref, computed } from 'vue'
import KunSwitch from '../src/components/KunSwitch.vue'
import type { KunSwitchSize, KunSwitchLabelPosition } from '../src/composables/kunSwitchProps.js'
import KunSelect from '../../KunSelect/src/components/KunSelect.vue'
import KunTextField from '../../KunTextField/src/components/KunTextField.vue'

// ------------------------------------------------------------------
// v-model principal: se muestra en crudo debajo del campo
// ------------------------------------------------------------------
const value = ref<boolean | string | number>(true)

// ------------------------------------------------------------------
// Controles del playground
// ------------------------------------------------------------------
const label = ref('Notificaciones')

const size = ref<KunSwitchSize>('md')
const sizeOptions = ref([
  { id: 'xxs', name: 'xxs' },
  { id: 'xs', name: 'xs' },
  { id: 'sm', name: 'sm' },
  { id: 'md', name: 'md' },
  { id: 'lg', name: 'lg' },
  { id: 'xl', name: 'xl' },
  { id: 'xxl', name: 'xxl' },
])

const labelPosition = ref<KunSwitchLabelPosition>('right')
const labelPositionOptions = ref([
  { id: 'top', name: 'top' },
  { id: 'bottom', name: 'bottom' },
  { id: 'left', name: 'left' },
  { id: 'right', name: 'right' },
])

const onColor = ref('bg-success')
const offColor = ref('bg-surface-light')
const iconColor = ref('bg-ui-surface-raised')

const trueValueRaw = ref('true')
const falseValueRaw = ref('false')

function parseSwitchValue(raw: string): boolean | string | number {
  if (raw === 'true') return true
  if (raw === 'false') return false
  if (raw !== '' && !Number.isNaN(Number(raw))) return Number(raw)
  return raw
}

const trueValueProp = computed(() => parseSwitchValue(trueValueRaw.value))
const falseValueProp = computed(() => parseSwitchValue(falseValueRaw.value))

const disabled = ref(false)
const inset = ref(false)
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
  <div class="p-4 grid gap-6 lg:grid-cols-2 lg:items-start">
    <!-- Vista previa + v-model (fija: siempre visible al scrollear opciones) -->
    <div class="space-y-3 min-w-0 lg:sticky lg:top-4">
      <h2 class="text-lg font-semibold">KunSwitch</h2>

      <KunSwitch
        v-model="value"
        :label="label"
        :label-position="labelPosition"
        :size="size"
        :on-color="onColor"
        :off-color="offColor"
        :icon-color="iconColor"
        :true-value="trueValueProp"
        :false-value="falseValueProp"
        :disabled="disabled"
        :inset="inset"
        :hide-details="hideDetails"
        @update:model-value="logEvent('update:modelValue', $event)"
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
        <KunSelect
          v-model="labelPosition"
          v-model:items="labelPositionOptions"
          label="Label position"
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
        <KunTextField v-model="onColor" label="On color" density="compact" />
        <KunTextField v-model="offColor" label="Off color" density="compact" />
        <KunTextField v-model="iconColor" label="Icon color" density="compact" />
        <KunTextField v-model="trueValueRaw" label="True value" density="compact" />
        <KunTextField v-model="falseValueRaw" label="False value" density="compact" />

        <KunSwitch v-model="disabled" label="Disabled" />
        <KunSwitch v-model="inset" label="Inset" />
        <KunSwitch v-model="hideDetails" label="Sin details" />
      </div>
    </div>
  </div>
</template>
