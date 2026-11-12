<script setup lang="ts">
import { ref, computed } from 'vue'
import KunDrawer from '../src/components/KunDrawer.vue'
import KunBtn from '../../KunBtn/src/components/KunBtn.vue'
import KunSwitch from '../../KunSwitch/src/components/KunSwitch.vue'
import KunSelect from '../../KunSelect/src/components/KunSelect.vue'
import KunTextField from '../../KunTextField/src/components/KunTextField.vue'

// ------------------------------------------------------------------
// NOTA: '../src/composables/kunDrawerProps.js' no exporta tipos unión
// (solo el objeto `kunDrawerProps`), por eso se define el alias local.
// ------------------------------------------------------------------
type KunDrawerLocation = 'start' | 'end' | 'top' | 'bottom' | 'left' | 'right'

// ------------------------------------------------------------------
// Estado del drawer (v-model)
// ------------------------------------------------------------------
const open = ref(false)

// ------------------------------------------------------------------
// Controles del playground
// ------------------------------------------------------------------
const location = ref<KunDrawerLocation>('start')
const locationOptions = ref([
  { id: 'start', name: 'start' },
  { id: 'end', name: 'end' },
  { id: 'top', name: 'top' },
  { id: 'bottom', name: 'bottom' },
  { id: 'left', name: 'left (alias de start)' },
  { id: 'right', name: 'right (alias de end)' },
])

const scrim = ref<boolean | string>(true)
const scrimOptions = ref([
  { id: true, name: 'true (con overlay)' },
  { id: false, name: 'false (sin overlay)' },
])

const width = ref('w-[256px]')
const railWidth = ref('w-[56px]')
const tag = ref('nav')
const swipeTransition = ref('transition-transform duration-300 ease-in-out')
const scrimTransition = ref('opacity 200ms ease')
const animationEasing = ref('ease-in-out')

// Opcionales sin default → '' = ausente (undefined, nunca null)
const imageRaw = ref('')
const imageProp = computed<string | undefined>(() => (imageRaw.value === '' ? undefined : imageRaw.value))
const elevationRaw = ref('')
const elevationProp = computed<string | undefined>(() => (elevationRaw.value === '' ? undefined : elevationRaw.value))
const border = ref(false)
const rounded = ref(false)

const temporary = ref(false)
const absolute = ref(false)
const permanent = ref(false)
const persistent = ref(false)
const rail = ref(false)
const floating = ref(false)
const fullHeight = ref(false)
const scrollable = ref(true)
const swipeable = ref(false)

// Numéricos con default → raw string + computed ('' = default vía undefined)
const swipeThresholdRaw = ref('50')
const swipeThresholdProp = computed<number | undefined>(() => (swipeThresholdRaw.value === '' ? undefined : Number(swipeThresholdRaw.value)))
const swipeEdgeSizeRaw = ref('30')
const swipeEdgeSizeProp = computed<number | undefined>(() => (swipeEdgeSizeRaw.value === '' ? undefined : Number(swipeEdgeSizeRaw.value)))
const swipeHandleSizeRaw = ref('24')
const swipeHandleSizeProp = computed<number | undefined>(() => (swipeHandleSizeRaw.value === '' ? undefined : Number(swipeHandleSizeRaw.value)))
const swipeMinVelocityRaw = ref('0.35')
const swipeMinVelocityProp = computed<number | undefined>(() => (swipeMinVelocityRaw.value === '' ? undefined : Number(swipeMinVelocityRaw.value)))
const animationDurationRaw = ref('300')
const animationDurationProp = computed<number | undefined>(() => (animationDurationRaw.value === '' ? undefined : Number(animationDurationRaw.value)))
const peekSizeRaw = ref('0')
const peekSizeProp = computed<number | undefined>(() => (peekSizeRaw.value === '' ? undefined : Number(peekSizeRaw.value)))

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

function onUpdateModelValue(value: boolean): void {
  logEvent(value ? 'open' : 'close', `update:modelValue → ${value}`)
}
</script>

<template>
  <div class="p-4 grid gap-6 lg:grid-cols-2 lg:items-start">
    <!-- Vista previa (fija: siempre visible al scrollear opciones) -->
    <div class="space-y-3 min-w-0 lg:sticky lg:top-4">
      <h2 class="text-lg font-semibold">KunDrawer</h2>

      <KunBtn @click="open = true">
        Abrir
      </KunBtn>

      <KunDrawer
        v-model="open"
        :location="location"
        :temporary="temporary"
        :width="width"
        :scrim="scrim"
        :absolute="absolute"
        :permanent="permanent"
        :persistent="persistent"
        :rail="rail"
        :rail-width="railWidth"
        :elevation="elevationProp"
        :floating="floating"
        :image="imageProp"
        :border="border"
        :rounded="rounded"
        :tag="tag"
        :full-height="fullHeight"
        :scrollable="scrollable"
        :swipeable="swipeable"
        :swipe-threshold="swipeThresholdProp"
        :swipe-edge-size="swipeEdgeSizeProp"
        :swipe-transition="swipeTransition"
        :swipe-handle-size="swipeHandleSizeProp"
        :swipe-min-velocity="swipeMinVelocityProp"
        :scrim-transition="scrimTransition"
        :animation-duration="animationDurationProp"
        :animation-easing="animationEasing"
        :peek-size="peekSizeProp"
        @update:model-value="onUpdateModelValue"
        @swipe-start="logEvent('swipe-start', JSON.stringify($event))"
        @swipe-move="logEvent('swipe-move', JSON.stringify($event))"
        @swipe-end="logEvent('swipe-end', JSON.stringify($event))"
      >
        <template #prepend>
          <div class="flex items-center justify-between p-4">
            <span class="font-semibold">Navegación</span>
            <KunBtn variant="subtle" @click="open = false">
              Cerrar
            </KunBtn>
          </div>
        </template>

        <nav class="space-y-1 p-4 pt-0">
          <a href="#" class="block rounded-lg px-3 py-2 text-sm hover:bg-muted" @click.prevent="logEvent('nav', 'Inicio')">
            Inicio
          </a>
          <a href="#" class="block rounded-lg px-3 py-2 text-sm hover:bg-muted" @click.prevent="logEvent('nav', 'Componentes')">
            Componentes
          </a>
          <a href="#" class="block rounded-lg px-3 py-2 text-sm hover:bg-muted" @click.prevent="logEvent('nav', 'Guías')">
            Guías
          </a>
        </nav>

        <template #append>
          <div class="p-4 text-xs text-muted">
            Contenido genérico del slot append.
          </div>
        </template>
      </KunDrawer>

      <div class="rounded-lg bg-muted p-3 text-sm">
        <div class="text-muted text-xs mb-1">Últimos eventos</div>
        <ul v-if="eventLog.length" class="space-y-1 font-mono text-xs">
          <li v-for="e in eventLog" :key="e.id">
            <span class="font-semibold">{{ e.name }}</span>
            <span v-if="e.detail" class="text-muted"> — {{ e.detail }}</span>
          </li>
        </ul>
        <p v-else class="text-xs text-muted">Abrí el drawer para ver eventos…</p>
      </div>
    </div>

    <!-- Panel de configuración (scroll propio: no arrastra el drawer) -->
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
          v-model="scrim"
          v-model:items="scrimOptions"
          label="Scrim"
          item-value="id"
          item-title="name"
          density="compact"
        />

        <KunTextField v-model="width" label="Width" density="compact" />
        <KunTextField v-model="railWidth" label="Rail width" density="compact" />
        <KunTextField v-model="tag" label="Tag" density="compact" />
        <KunTextField v-model="imageRaw" label="Image (vacío = sin imagen)" density="compact" />
        <KunTextField v-model="elevationRaw" label="Elevation (vacío = ninguna)" density="compact" />
        <KunSwitch v-model="border" label="Border" />
        <KunSwitch v-model="rounded" label="Rounded lateral" />

        <KunTextField v-model="swipeTransition" label="Swipe transition" density="compact" />
        <KunTextField v-model="scrimTransition" label="Scrim transition" density="compact" />
        <KunTextField v-model="animationEasing" label="Animation easing" density="compact" />

        <KunTextField v-model="swipeThresholdRaw" label="Swipe threshold (vacío = default)" density="compact" inputmode="decimal" />
        <KunTextField v-model="swipeEdgeSizeRaw" label="Swipe edge size (vacío = default)" density="compact" inputmode="decimal" />
        <KunTextField v-model="swipeHandleSizeRaw" label="Swipe handle size (vacío = default)" density="compact" inputmode="decimal" />
        <KunTextField v-model="swipeMinVelocityRaw" label="Swipe min velocity (vacío = default)" density="compact" inputmode="decimal" />
        <KunTextField v-model="animationDurationRaw" label="Animation duration (vacío = default)" density="compact" inputmode="decimal" />
        <KunTextField v-model="peekSizeRaw" label="Peek size (vacío = default)" density="compact" inputmode="decimal" />

        <KunSwitch v-model="temporary" label="Temporary" />
        <KunSwitch v-model="absolute" label="Absolute" />
        <KunSwitch v-model="permanent" label="Permanent" />
        <KunSwitch v-model="persistent" label="Persistent" />
        <KunSwitch v-model="rail" label="Rail" />
        <KunSwitch v-model="floating" label="Floating" />
        <KunSwitch v-model="fullHeight" label="Full height" />
        <KunSwitch v-model="scrollable" label="Scrollable" />
        <KunSwitch v-model="swipeable" label="Swipeable" />
      </div>
    </div>
  </div>
</template>
