<script setup lang="ts">
import { ref, computed } from 'vue'
import KunMenu from '../src/components/KunMenu.vue'
import type { KunMenuLocation, KunMenuOrigin, KunMenuTransition } from '../src/composables/kunMenuProps.js'
import KunBtn from '../../KunBtn/src/components/KunBtn.vue'
import KunSwitch from '../../KunSwitch/src/components/KunSwitch.vue'
import KunSelect from '../../KunSelect/src/components/KunSelect.vue'
import KunTextField from '../../KunTextField/src/components/KunTextField.vue'

// ------------------------------------------------------------------
// v-model principal: apertura del menú
// ------------------------------------------------------------------
const open = ref(false)

// ------------------------------------------------------------------
// Controles del playground: uniones tipadas
// ------------------------------------------------------------------
const location = ref<KunMenuLocation>('bottom')
const locationOptions = ref([
  { id: 'top', name: 'top' },
  { id: 'bottom', name: 'bottom' },
  { id: 'left', name: 'left' },
  { id: 'right', name: 'right' },
])

const origin = ref<KunMenuOrigin>('auto')
const originOptions = ref([
  { id: 'auto', name: 'auto' },
  { id: 'top left', name: 'top left' },
  { id: 'top center', name: 'top center' },
  { id: 'top right', name: 'top right' },
  { id: 'bottom left', name: 'bottom left' },
  { id: 'bottom center', name: 'bottom center' },
  { id: 'bottom right', name: 'bottom right' },
  { id: 'left top', name: 'left top' },
  { id: 'left center', name: 'left center' },
  { id: 'left bottom', name: 'left bottom' },
  { id: 'right top', name: 'right top' },
  { id: 'right center', name: 'right center' },
  { id: 'right bottom', name: 'right bottom' },
])

const transition = ref<KunMenuTransition>('fade-scale')
const transitionOptions = ref([
  { id: 'fade', name: 'fade' },
  { id: 'fade-scale', name: 'fade-scale' },
  { id: 'slide-down', name: 'slide-down' },
  { id: 'slide-up', name: 'slide-up' },
  { id: 'slide-left', name: 'slide-left' },
  { id: 'slide-right', name: 'slide-right' },
  { id: 'none', name: 'none' },
])

// ------------------------------------------------------------------
// Controles del playground: strings directos
// ------------------------------------------------------------------
const label = ref('Menú contextual')

// ------------------------------------------------------------------
// Controles del playground: strings opcionales (vacío = undefined)
// ------------------------------------------------------------------
const widthRaw = ref('w-fit')
const minWidthRaw = ref('')
const maxWidthRaw = ref('')
const minHeightRaw = ref('')
const heightRaw = ref('')
const maxHeightRaw = ref('')
const offsetRaw = ref('')
const widthProp = computed(() => (widthRaw.value === '' ? undefined : widthRaw.value))
const minWidthProp = computed(() => (minWidthRaw.value === '' ? undefined : minWidthRaw.value))
const maxWidthProp = computed(() => (maxWidthRaw.value === '' ? undefined : maxWidthRaw.value))
const minHeightProp = computed(() => (minHeightRaw.value === '' ? undefined : minHeightRaw.value))
const heightProp = computed(() => (heightRaw.value === '' ? undefined : heightRaw.value))
const maxHeightProp = computed(() => (maxHeightRaw.value === '' ? undefined : maxHeightRaw.value))
const offsetProp = computed(() => (offsetRaw.value === '' ? undefined : offsetRaw.value))

// attach: Boolean | String | Object (Teleport). Vacío = undefined (body);
// 'true' = true (sin Teleport, inline); otro texto = selector.
const attachRaw = ref('')
const attachProp = computed<boolean | string | undefined>(() => {
  if (attachRaw.value === '') return undefined
  if (attachRaw.value === 'true') return true
  return attachRaw.value
})

const openDelayRaw = ref('100')
const closeDelayRaw = ref('100')
const openDelayProp = computed(() => (openDelayRaw.value === '' ? undefined : Number(openDelayRaw.value)))
const closeDelayProp = computed(() => (closeDelayRaw.value === '' ? undefined : Number(closeDelayRaw.value)))

// ------------------------------------------------------------------
// Controles del playground: booleanos
// ------------------------------------------------------------------
const openOnClick = ref(true)
const openOnHover = ref(false)
const openOnFocus = ref(false)
const closeOnContentClick = ref(true)
const closeOnBack = ref(true)
const contained = ref(false)
const disabled = ref(false)
const eager = ref(false)
const persistent = ref(false)
const hideDetails = ref(true)
const anchor = ref(true)

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

function handleSelect(item: string): void {
  logEvent('select', item)
  open.value = false
}
</script>

<template>
  <div class="p-4 grid gap-6 lg:grid-cols-2 lg:items-start">
    <!-- Vista previa + v-model (fija: siempre visible al scrollear opciones) -->
    <div class="space-y-3 min-w-0 lg:sticky lg:top-4">
      <h2 class="text-lg font-semibold">KunMenu</h2>

      <KunMenu
        v-model="open"
        :location="location"
        :origin="origin"
        :transition="transition"
        :label="label"
        :width="widthProp"
        :min-width="minWidthProp"
        :max-width="maxWidthProp"
        :min-height="minHeightProp"
        :height="heightProp"
        :max-height="maxHeightProp"
        :offset="offsetProp"
        :attach="attachProp"
        :open-delay="openDelayProp"
        :close-delay="closeDelayProp"
        :open-on-click="openOnClick"
        :open-on-hover="openOnHover"
        :open-on-focus="openOnFocus"
        :close-on-content-click="closeOnContentClick"
        :close-on-back="closeOnBack"
        :contained="contained"
        :disabled="disabled"
        :eager="eager"
        :persistent="persistent"
        :hide-details="hideDetails"
        :anchor="anchor"
        @update:model-value="logEvent($event ? 'open' : 'close', $event)"
        @click:outside="logEvent('click:outside', 'click fuera')"
        @handle-escape="logEvent('handleEscape', 'Escape')"
      >
        <template #activator>
          <KunBtn :disabled="disabled">Abrir menú</KunBtn>
        </template>

        <div class="py-1 min-w-44">
          <button type="button" class="w-full text-left px-4 py-2 text-sm hover:bg-muted" @click="handleSelect('Opción 1')">Opción 1</button>
          <button type="button" class="w-full text-left px-4 py-2 text-sm hover:bg-muted" @click="handleSelect('Opción 2')">Opción 2</button>
          <button type="button" class="w-full text-left px-4 py-2 text-sm hover:bg-muted" @click="handleSelect('Opción 3')">Opción 3</button>
          <button type="button" class="w-full text-left px-4 py-2 text-sm hover:bg-muted" @click="handleSelect('Opción 4')">Opción 4</button>
        </div>
      </KunMenu>

      <div class="rounded-lg bg-muted p-3 font-mono text-sm">
        <div class="text-muted text-xs mb-1">v-model en crudo</div>
        <div>{{ JSON.stringify(open) }} <span class="text-muted">({{ typeof open }})</span></div>
      </div>

      <div class="rounded-lg bg-muted p-3 text-sm">
        <div class="text-muted text-xs mb-1">Últimos eventos</div>
        <ul v-if="eventLog.length" class="space-y-1 font-mono text-xs">
          <li v-for="e in eventLog" :key="e.id">
            <span class="font-semibold">{{ e.name }}</span>
            <span v-if="e.detail" class="text-muted"> — {{ e.detail }}</span>
          </li>
        </ul>
        <p v-else class="text-xs text-muted">Interactuá con el menú para ver eventos…</p>
      </div>
    </div>

    <!-- Panel de configuración (scroll propio: no arrastra el demo) -->
    <div class="space-y-4 rounded-lg border border-default p-4 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto">
      <h3 class="text-sm font-semibold uppercase tracking-wide text-muted">Configuración</h3>

      <div class="grid grid-cols-2 gap-3 [&>*]:min-w-0">
        <KunSelect
          v-model="location"
          v-model:items="locationOptions"
          label="Location"
          item-value="id"
          item-title="name"
          density="compact"
        />
        <KunSelect
          v-model="origin"
          v-model:items="originOptions"
          label="Origin"
          item-value="id"
          item-title="name"
          density="compact"
        />
        <KunSelect
          v-model="transition"
          v-model:items="transitionOptions"
          label="Transition"
          item-value="id"
          item-title="name"
          density="compact"
        />
        <KunTextField v-model="label" label="Label" density="compact" />

        <KunTextField v-model="widthRaw" label="Width (vacío = default)" density="compact" />
        <KunTextField v-model="minWidthRaw" label="Min width (vacío = sin límite)" density="compact" />
        <KunTextField v-model="maxWidthRaw" label="Max width (vacío = sin límite)" density="compact" />
        <KunTextField v-model="minHeightRaw" label="Min height (vacío = sin límite)" density="compact" />
        <KunTextField v-model="heightRaw" label="Height (vacío = auto)" density="compact" />
        <KunTextField v-model="maxHeightRaw" label="Max height (vacío = auto)" density="compact" />
        <KunTextField v-model="offsetRaw" label="Offset (vacío = 0)" density="compact" />
        <KunTextField v-model="attachRaw" label="Attach (vacío = body, 'true' = inline)" density="compact" />
        <KunTextField v-model="openDelayRaw" label="Open delay (ms)" density="compact" inputmode="numeric" />
        <KunTextField v-model="closeDelayRaw" label="Close delay (ms)" density="compact" inputmode="numeric" />

        <KunSwitch v-model="open" label="Abierto (v-model)" />
        <KunSwitch v-model="openOnClick" label="Open on click" />
        <KunSwitch v-model="openOnHover" label="Open on hover" />
        <KunSwitch v-model="openOnFocus" label="Open on focus" />
        <KunSwitch v-model="closeOnContentClick" label="Close on content click" />
        <KunSwitch v-model="closeOnBack" label="Close on back" />
        <KunSwitch v-model="contained" label="Contained" />
        <KunSwitch v-model="disabled" label="Disabled" />
        <KunSwitch v-model="eager" label="Eager" />
        <KunSwitch v-model="persistent" label="Persistent" />
        <KunSwitch v-model="hideDetails" label="Sin details" />
        <KunSwitch v-model="anchor" label="Anchor positioning (nativo si soportado)" />
      </div>
    </div>
  </div>
</template>
