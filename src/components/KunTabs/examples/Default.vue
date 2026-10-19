<script setup lang="ts">
import { ref, computed } from 'vue'
import KunTabs from '../src/components/KunTabs.vue'
import KunTab from '../src/components/KunTab.vue'
import type { KunTabsAlignTabs, KunTabsDirection } from '../src/composables/kunTabsProps.js'
import KunSwitch from '../../KunSwitch/src/components/KunSwitch.vue'
import KunSelect from '../../KunSelect/src/components/KunSelect.vue'
import KunTextField from '../../KunTextField/src/components/KunTextField.vue'

// ------------------------------------------------------------------
// v-model: simple (string | number) o múltiple (array)
// ------------------------------------------------------------------
const multiple = ref(false)
const singleValue = ref<string | number>('manzana')
const multiValue = ref<Array<string | number>>(['manzana'])

// ------------------------------------------------------------------
// Tabs demo (datos genéricos: frutas)
// ------------------------------------------------------------------
const tabPrependIcon = ref('ri-apple-line')
const tabAppendIcon = ref('')
const disableBanana = ref(false)
const tabStacked = ref(false)

// ------------------------------------------------------------------
// Uniones cerradas -> KunSelect con refs tipadas
// ------------------------------------------------------------------
const alignTabs = ref<KunTabsAlignTabs>('start')
const alignTabsOptions = ref([
  { id: 'start', name: 'start' },
  { id: 'center', name: 'center' },
  { id: 'end', name: 'end' },
  { id: 'title', name: 'title' },
])

const direction = ref<KunTabsDirection>('horizontal')
const directionOptions = ref([
  { id: 'horizontal', name: 'horizontal' },
  { id: 'vertical', name: 'vertical' },
])

// ------------------------------------------------------------------
// Colores, clases e iconos de flechas (String: directo)
// ------------------------------------------------------------------
const sliderColor = ref('bg-primary')
const selectedClass = ref('text-primary font-medium')
const nextIcon = ref('ri-arrow-right-s-line')
const prevIcon = ref('ri-arrow-left-s-line')

// ------------------------------------------------------------------
// Altura ([String, Number]: crudo string + computed)
// ------------------------------------------------------------------
const heightRaw = ref('')
const heightProp = computed(() => {
  if (heightRaw.value === '') return undefined
  const n = Number(heightRaw.value)
  return Number.isNaN(n) ? heightRaw.value : n
})

// ------------------------------------------------------------------
// Booleanos -> KunSwitch (mandatory es [Boolean, String]: se usa boolean)
// ------------------------------------------------------------------
const grow = ref(false)
const centerActive = ref(false)
const hideSlider = ref(false)
const showArrows = ref(true)
const mandatory = ref(false)

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

function onUpdateModelValue(v: unknown): void {
  if (multiple.value) {
    multiValue.value = (Array.isArray(v) ? v : [v]) as Array<string | number>
  } else {
    singleValue.value = v as string | number
  }
  logEvent('update:modelValue', JSON.stringify(v))
}

const fruitDetail: Record<string, string> = {
  manzana: 'Manzana: crocante y dulce, ideal para comer fresca.',
  banana: 'Banana: fuente de potasio, perfecta para el desayuno.',
  cereza: 'Cereza: pequeña y jugosa, la favorita del verano.',
}
const activeDetail = computed(() => {
  const current = multiple.value ? multiValue.value : [singleValue.value]
  return current.map((v) => fruitDetail[String(v)] ?? String(v)).join(' · ')
})
</script>

<template>
  <div class="p-4 grid gap-6 lg:grid-cols-2 lg:items-start">
    <!-- Vista previa + v-model (fija: siempre visible al scrollear opciones) -->
    <div class="space-y-3 min-w-0 lg:sticky lg:top-4">
      <h2 class="text-lg font-semibold">KunTabs</h2>

      <KunTabs
        :model-value="multiple ? multiValue : singleValue"
        :align-tabs="alignTabs"
        :direction="direction"
        :slider-color="sliderColor"
        :selected-class="selectedClass"
        :grow="grow"
        :center-active="centerActive"
        :hide-slider="hideSlider"
        :show-arrows="showArrows"
        :next-icon="nextIcon"
        :prev-icon="prevIcon"
        :height="heightProp"
        :multiple="multiple"
        :mandatory="mandatory"
        @update:model-value="onUpdateModelValue"
      >
        <KunTab
          value="manzana"
          text="Manzana"
          :prepend-icon="tabPrependIcon || undefined"
          :append-icon="tabAppendIcon || undefined"
          :stacked="tabStacked"
        />
        <KunTab
          value="banana"
          text="Banana"
          :prepend-icon="tabPrependIcon || undefined"
          :append-icon="tabAppendIcon || undefined"
          :disabled="disableBanana"
          :stacked="tabStacked"
        />
        <KunTab
          value="cereza"
          text="Cereza"
          :prepend-icon="tabPrependIcon || undefined"
          :append-icon="tabAppendIcon || undefined"
          :stacked="tabStacked"
        />
      </KunTabs>

      <div class="rounded-lg bg-muted p-3 text-sm">
        <div class="text-muted text-xs mb-1">Contenido del tab activo</div>
        <p>{{ activeDetail }}</p>
      </div>

      <div class="rounded-lg bg-muted p-3 font-mono text-sm">
        <div class="text-muted text-xs mb-1">v-model en crudo</div>
        <div>{{ JSON.stringify(multiple ? multiValue : singleValue) }}</div>
      </div>

      <div class="rounded-lg bg-muted p-3 text-sm">
        <div class="text-muted text-xs mb-1">Últimos eventos</div>
        <ul v-if="eventLog.length" class="space-y-1 font-mono text-xs">
          <li v-for="e in eventLog" :key="e.id">
            <span class="font-semibold">{{ e.name }}</span>
            <span v-if="e.detail" class="text-muted"> — {{ e.detail }}</span>
          </li>
        </ul>
        <p v-else class="text-xs text-muted">Cambiá de tab para ver eventos…</p>
      </div>
    </div>

    <!-- Panel de configuración (scroll propio: no arrastra los tabs) -->
    <div class="space-y-4 rounded-lg border border-default p-4 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto">
      <h3 class="text-sm font-semibold uppercase tracking-wide text-muted">Configuración</h3>

      <div class="grid grid-cols-2 gap-3 [&>*]:min-w-0">
        <p class="col-span-2 pt-2 text-xs font-semibold uppercase tracking-wide text-muted">Barra</p>
        <KunSelect
          v-model="alignTabs"
          v-model:items="alignTabsOptions"
          label="Align tabs"
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
        <KunTextField v-model="sliderColor" label="Slider color" density="compact" />
        <KunTextField v-model="selectedClass" label="Selected class" density="compact" />
        <KunTextField v-model="heightRaw" label="Height (vacío = auto)" density="compact" inputmode="decimal" />
        <KunTextField v-model="nextIcon" label="Next icon" density="compact" />
        <KunTextField v-model="prevIcon" label="Prev icon" density="compact" />

        <p class="col-span-2 pt-2 text-xs font-semibold uppercase tracking-wide text-muted">Comportamiento</p>
        <KunSwitch v-model="grow" label="Grow" />
        <KunSwitch v-model="centerActive" label="Center active" />
        <KunSwitch v-model="hideSlider" label="Hide slider" />
        <KunSwitch v-model="showArrows" label="Show arrows" />
        <KunSwitch v-model="multiple" label="Multiple" />
        <KunSwitch v-model="mandatory" label="Mandatory" />

        <p class="col-span-2 pt-2 text-xs font-semibold uppercase tracking-wide text-muted">Tabs (hijos KunTab)</p>
        <KunTextField v-model="tabPrependIcon" label="Prepend icon (vacío = sin icono)" density="compact" />
        <KunTextField v-model="tabAppendIcon" label="Append icon (vacío = sin icono)" density="compact" />
        <KunSwitch v-model="disableBanana" label="Deshabilitar Banana" />
        <KunSwitch v-model="tabStacked" label="Stacked (icono sobre texto)" />
      </div>
    </div>
  </div>
</template>
