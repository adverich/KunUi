<script setup lang="ts">
import { ref, computed } from 'vue'
import KunAlert from '../src/components/KunAlert.vue'
import type { KunAlertPosition } from '../src/composables/kunAlertProps.js'
import type { KunColor, KunVariant } from '../../../theme/kunVariants.js'
import KunBtn from '../../KunBtn/src/components/KunBtn.vue'
import KunSwitch from '../../KunSwitch/src/components/KunSwitch.vue'
import KunSelect from '../../KunSelect/src/components/KunSelect.vue'
import KunTextField from '../../KunTextField/src/components/KunTextField.vue'

// ------------------------------------------------------------------
// Visibilidad: la alerta solo se renderiza con v-model en true.
// El auto-cierre por timeout se re-arma cada vez que se muestra.
// ------------------------------------------------------------------
const visible = ref(false)

function showAlert(): void {
  visible.value = true
}

// ------------------------------------------------------------------
// Controles del playground
// ------------------------------------------------------------------
const title = ref('Operación exitosa')
const message = ref('Los cambios se guardaron correctamente.')

const position = ref<KunAlertPosition>('br')
const positionOptions = ref([
  { id: 'tl', name: 'tl (arriba-izq)' },
  { id: 'tc', name: 'tc (arriba-centro)' },
  { id: 'tr', name: 'tr (arriba-der)' },
  { id: 'cl', name: 'cl (centro-izq)' },
  { id: 'cc', name: 'cc (centro-centro)' },
  { id: 'cr', name: 'cr (centro-der)' },
  { id: 'bl', name: 'bl (abajo-izq)' },
  { id: 'bc', name: 'bc (abajo-centro)' },
  { id: 'br', name: 'br (abajo-der)' },
])

const icon = ref('')
const iconSize = ref('size-6')
const color = ref<KunColor>('error')
const colorOptions = ref([
  { id: 'primary', name: 'primary' },
  { id: 'success', name: 'success' },
  { id: 'warning', name: 'warning' },
  { id: 'error', name: 'error' },
  { id: 'neutral', name: 'neutral' },
])
const variant = ref<KunVariant>('solid')
const variantOptions = ref([
  { id: 'solid', name: 'solid' },
  { id: 'outline', name: 'outline' },
  { id: 'soft', name: 'soft' },
  { id: 'subtle', name: 'subtle' },
])
const titleClass = ref('text-2xl font-bold')
const messageClass = ref('text-base font-normal')
const transition = ref('transition-opacity duration-300 ease-in-out')
const alertClass = ref('relative w-fit rounded-lg shadow-md')
const paddingContainer = ref('p-2')
const margin = ref('m-2')
const persistentLabel = ref('Aceptar')
const actionLabel = ref('')

const closable = ref(true)
const fullscreen = ref(false)
const persistent = ref(false)

const timeoutRaw = ref('2500')
const timeoutProp = computed(() => (timeoutRaw.value === '' ? 2500 : Number(timeoutRaw.value)))

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
    <!-- Vista previa + estado (fija: siempre visible al scrollear opciones) -->
    <div class="space-y-3 min-w-0 lg:sticky lg:top-4">
      <h2 class="text-lg font-semibold">KunAlert</h2>

      <div class="flex items-center gap-3">
        <KunBtn @click="showAlert">Mostrar alerta</KunBtn>
        <p class="text-xs text-muted">La alerta solo se renderiza con v-model en true (se auto-cierra por timeout).</p>
      </div>

      <KunAlert
        v-model="visible"
        :title="title"
        :message="message"
        :position="position"
        :icon="icon || ''"
        :icon-size="iconSize"
        :color="color"
        :variant="variant"
        :title-class="titleClass"
        :message-class="messageClass"
        :closable="closable"
        :transition="transition"
        :alert-class="alertClass"
        :padding-container="paddingContainer"
        :margin="margin"
        :fullscreen="fullscreen"
        :persistent="persistent"
        :persistent-label="persistentLabel"
        :action-label="actionLabel"
        :timeout="timeoutProp"
        @update:model-value="logEvent('update:modelValue', $event)"
        @action="logEvent('action', '')"
      />

      <div class="rounded-lg bg-muted p-3 font-mono text-sm">
        <div class="text-muted text-xs mb-1">visible (v-model)</div>
        <div>{{ JSON.stringify(visible) }}</div>
      </div>

      <div class="rounded-lg bg-muted p-3 text-sm">
        <div class="text-muted text-xs mb-1">Últimos eventos</div>
        <ul v-if="eventLog.length" class="space-y-1 font-mono text-xs">
          <li v-for="e in eventLog" :key="e.id">
            <span class="font-semibold">{{ e.name }}</span>
            <span v-if="e.detail" class="text-muted"> — {{ e.detail }}</span>
          </li>
        </ul>
        <p v-else class="text-xs text-muted">Mostrá la alerta o cerrala para ver eventos…</p>
      </div>
    </div>

    <!-- Panel de configuración (scroll propio: no arrastra la vista previa) -->
    <div class="space-y-4 rounded-lg border border-default p-4 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto">
      <h3 class="text-sm font-semibold uppercase tracking-wide text-muted">Configuración</h3>

      <div class="grid grid-cols-2 gap-3 [&>*]:min-w-0">
        <KunTextField v-model="title" label="Title" density="compact" />
        <KunTextField v-model="message" label="Message" density="compact" />

        <KunSelect
          v-model="position"
          v-model:items="positionOptions"
          label="Position"
          item-value="id"
          item-title="name"
          density="compact"
        />
        <KunTextField v-model="icon" label="Icon (vacío = sin icono)" density="compact" />
        <KunTextField v-model="iconSize" label="Icon size" density="compact" />
        <KunSelect
          v-model="color"
          v-model:items="colorOptions"
          label="Color"
          item-value="id"
          item-title="name"
          density="compact"
        />
        <KunSelect
          v-model="variant"
          v-model:items="variantOptions"
          label="Variant"
          item-value="id"
          item-title="name"
          density="compact"
        />
        <KunTextField v-model="titleClass" label="Title class" density="compact" />
        <KunTextField v-model="messageClass" label="Message class" density="compact" />
        <KunTextField v-model="transition" label="Transition" density="compact" />
        <KunTextField v-model="alertClass" label="Alert class" density="compact" />
        <KunTextField v-model="paddingContainer" label="Padding container" density="compact" />
        <KunTextField v-model="margin" label="Margin" density="compact" />
        <KunTextField v-model="persistentLabel" label="Persistent label" density="compact" />
        <KunTextField v-model="actionLabel" label="Action label (vacío = sin acción)" density="compact" />
        <KunTextField v-model="timeoutRaw" label="Timeout (ms)" density="compact" inputmode="decimal" />

        <KunSwitch v-model="closable" label="Closable" />
        <KunSwitch v-model="fullscreen" label="Fullscreen" />
        <KunSwitch v-model="persistent" label="Persistent" />
      </div>
    </div>
  </div>
</template>
