<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import KunAutocomplete from '../src/components/KunAutocomplete.vue'
import type { KunTextFieldDensity } from '../../KunTextField/src/composables/KunTextFieldProps.js'
import type { KunMenuOrigin } from '../../KunMenu/src/composables/kunMenuProps.js'
import KunSwitch from '../../KunSwitch/src/components/KunSwitch.vue'
import KunSelect from '../../KunSelect/src/components/KunSelect.vue'
import KunTextField from '../../KunTextField/src/components/KunTextField.vue'

// ------------------------------------------------------------------
// Ítems demo genéricos (países con subtítulo de región)
// ------------------------------------------------------------------
const demoItems = ref<unknown[]>([
  { id: 1, name: 'Argentina', region: 'América del Sur' },
  { id: 2, name: 'Brasil', region: 'América del Sur' },
  { id: 3, name: 'Chile', region: 'América del Sur' },
  { id: 4, name: 'México', region: 'América del Norte' },
  { id: 5, name: 'España', region: 'Europa' },
  { id: 6, name: 'Francia', region: 'Europa' },
  { id: 7, name: 'Japón', region: 'Asia' },
  { id: 8, name: 'Manzana', region: 'Frutas' },
  { id: 9, name: 'Pera', region: 'Frutas' },
  { id: 10, name: 'Banana', region: 'Frutas' },
])

// ------------------------------------------------------------------
// v-model principal: single (primitivo u objeto) vs multiple (array).
// Se alterna con el switch `multiple`; al cambiar de modo (o de
// `returnObject`) se resetea para no mezclar tipos.
// ------------------------------------------------------------------
const multiple = ref(false)
const returnObject = ref(false)
const singleModel = ref<unknown>(null)
const multipleModel = ref<unknown[]>([])

const modelProxy = computed({
  get: (): unknown => (multiple.value ? multipleModel.value : singleModel.value),
  set: (v: unknown) => {
    if (multiple.value) {
      multipleModel.value = Array.isArray(v) ? (v as unknown[]) : []
    } else {
      singleModel.value = v as unknown
    }
  },
})

watch([multiple, returnObject], () => {
  singleModel.value = null
  multipleModel.value = []
})

// ------------------------------------------------------------------
// Controles del playground — uniones cerradas (KunSelect)
// ------------------------------------------------------------------
const density = ref<KunTextFieldDensity>('default')
const densityOptions = ref([
  { id: 'default', name: 'default' },
  { id: 'comfortable', name: 'comfortable' },
  { id: 'compact', name: 'compact' },
])

const menuOrigin = ref<KunMenuOrigin>('bottom left')
const menuOriginOptions = ref([
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

// ------------------------------------------------------------------
// Controles del playground — booleanos (KunSwitch)
// ------------------------------------------------------------------
const clearable = ref(true)
const clearOnSelect = ref(false)
const clearSearchOnSelect = ref(true)
const clearOnNotFound = ref(true)
const closeOnSelect = ref(true)
const focusOnRender = ref(false)
const focusOnSelect = ref(false)
const hasCreateItem = ref(false)
const startEmtpy = ref(false)
const required = ref(false)
const disabled = ref(false)
const hideDetails = ref(true)
const hasIcons = ref(true)

// ------------------------------------------------------------------
// Controles del playground — strings / números (KunTextField)
// ------------------------------------------------------------------
const label = ref('País')
const itemValue = ref('id')
const itemTitle = ref('name')
const itemSubtitle = ref('region')
const searchableKeysRaw = ref('name')
const searchableKeysProp = computed(() =>
  searchableKeysRaw.value
    .split(',')
    .map((k) => k.trim())
    .filter((k) => k.length > 0),
)
const placeholderText = ref('Seleccionar')
const textNoItems = ref('No hay elementos')
const btnCreateText = ref('Crear item')
const btnCreateBg = ref('bg-success')
const btnCreateClass = ref('w-full')
const maxHeightRaw = ref('')
const maxHeightProp = computed<string | number | undefined>(() => {
  const raw = maxHeightRaw.value.trim()
  if (raw === '') return undefined
  const asNumber = Number(raw)
  return raw !== '' && !Number.isNaN(asNumber) && String(asNumber) === raw ? asNumber : raw
})
const zIndex = ref('z-250')
const iconColor = ref('text-ui-primary')
const requiredIconColor = ref('text-ui-primary')
const emptyTextClass = ref('text-ui-muted')
const bgMenuColor = ref('bg-menu')
const bgItemListColor = ref('bg-transparent')
const selectedItemListColor = ref('bg-ui-selection text-ui-selection')
const hoverItemListColor = ref('hover:bg-ui-selection-hover')

// NOTA: no se exponen `itemText` (alias de `itemTitle`), `startEmtpy` y
// `attach` (reservadas sin efecto), `height` (en desuso) ni
// `textFieldProps` / `rules` (objetos complejos, no editables en texto).

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

function safeStringify(v: unknown): string {
  try {
    if (typeof v === 'string') return v
    if (v === null || v === undefined) return ''
    return JSON.stringify(v) ?? String(v)
  } catch {
    return String(v)
  }
}

function logEvent(name: string, detail: unknown): void {
  eventSeq += 1
  const text = safeStringify(detail).slice(0, 160)
  eventLog.value.unshift({ id: eventSeq, name, detail: text })
  if (eventLog.value.length > 8) eventLog.value.pop()
}
</script>

<template>
  <div class="p-4 grid gap-6 lg:grid-cols-2 lg:items-start">
    <!-- Vista previa + v-model (fija: siempre visible al scrollear opciones) -->
    <div class="space-y-3 min-w-0 lg:sticky lg:top-4">
      <h2 class="text-lg font-semibold">KunAutocomplete</h2>

      <KunAutocomplete
        v-model="modelProxy"
        v-model:items="demoItems"
        :label="label"
        :item-value="itemValue"
        :item-title="itemTitle"
        :item-subtitle="itemSubtitle"
        :return-object="returnObject"
        :searchable-keys="searchableKeysProp"
        :focus-on-render="focusOnRender"
        :focus-on-select="focusOnSelect"
        :clearable="clearable"
        :clear-on-select="clearOnSelect"
        :clear-search-on-select="clearSearchOnSelect"
        :clear-on-not-found="clearOnNotFound"
        :close-on-select="closeOnSelect"
        :menu-origin="menuOrigin"
        :placeholder-text="placeholderText"
        :text-no-items="textNoItems"
        :has-create-item="hasCreateItem"
        :start-emtpy="startEmtpy"
        :btn-create-class="btnCreateClass"
        :btn-create-bg="btnCreateBg"
        :btn-create-text="btnCreateText"
        :multiple="multiple"
        :required="required"
        :disabled="disabled"
        :max-height="maxHeightProp"
        :density="density"
        :z-index="zIndex"
        :hide-details="hideDetails"
        :has-icons="hasIcons"
        :icon-color="iconColor"
        :required-icon-color="requiredIconColor"
        :empty-text-class="emptyTextClass"
        :bg-menu-color="bgMenuColor"
        :bg-item-list-color="bgItemListColor"
        :selected-item-list-color="selectedItemListColor"
        :hover-item-list-color="hoverItemListColor"
        @selectedItem="logEvent('selectedItem', $event)"
        @cleared="logEvent('cleared', 'selección limpiada')"
        @createItem="logEvent('createItem', $event)"
        @validation="logEvent('validation', $event)"
        @search="logEvent('search', $event)"
        @keyDown="logEvent('keyDown', $event)"
        @keyDownEnter="logEvent('keyDownEnter', ($event as KeyboardEvent).key)"
        @notFound="logEvent('notFound', $event)"
      />

      <div class="rounded-lg bg-surface p-3 font-mono text-sm">
        <div class="text-ui-muted text-xs mb-1">v-model en crudo</div>
        <div class="break-all">{{ safeStringify(modelProxy) || 'null' }}</div>
        <div class="text-ui-muted text-xs mt-1">
          modo: {{ multiple ? 'múltiple (array)' : 'simple' }} · {{ returnObject ? 'return-object' : 'por valor' }}
        </div>
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
        <KunTextField v-model="placeholderText" label="Placeholder" density="compact" />
        <KunTextField v-model="textNoItems" label="Texto sin ítems" density="compact" />
        <KunTextField v-model="itemValue" label="Item value" density="compact" />
        <KunTextField v-model="itemTitle" label="Item title" density="compact" />
        <KunTextField v-model="itemSubtitle" label="Item subtitle" density="compact" />
        <KunTextField v-model="searchableKeysRaw" label="Searchable keys (csv)" density="compact" />
        <KunTextField v-model="maxHeightRaw" label="Max height (vacío = auto)" density="compact" inputmode="numeric" />

        <KunSelect
          v-model="density"
          v-model:items="densityOptions"
          label="Density"
          item-value="id"
          item-title="name"
          density="compact"
        />
        <KunSelect
          v-model="menuOrigin"
          v-model:items="menuOriginOptions"
          label="Menu origin"
          item-value="id"
          item-title="name"
          density="compact"
        />

        <KunTextField v-model="zIndex" label="Z index" density="compact" />
        <KunTextField v-model="iconColor" label="Icon color" density="compact" />
        <KunTextField v-model="requiredIconColor" label="Required icon color" density="compact" />
        <KunTextField v-model="emptyTextClass" label="Empty text class" density="compact" />
        <KunTextField v-model="bgMenuColor" label="Bg menu color" density="compact" />
        <KunTextField v-model="bgItemListColor" label="Bg item color" density="compact" />
        <KunTextField v-model="selectedItemListColor" label="Selected item class" density="compact" />
        <KunTextField v-model="hoverItemListColor" label="Hover item class" density="compact" />

        <KunTextField v-model="btnCreateText" label="Btn crear: texto" density="compact" />
        <KunTextField v-model="btnCreateBg" label="Btn crear: bg" density="compact" />
        <KunTextField v-model="btnCreateClass" label="Btn crear: clase" density="compact" />

        <KunSwitch v-model="multiple" label="Múltiple" />
        <KunSwitch v-model="returnObject" label="Return object" />
        <KunSwitch v-model="clearable" label="Clearable" />
        <KunSwitch v-model="clearOnSelect" label="Clear on select" />
        <KunSwitch v-model="clearSearchOnSelect" label="Clear search on select" />
        <KunSwitch v-model="clearOnNotFound" label="Clear on not found" />
        <KunSwitch v-model="closeOnSelect" label="Close on select" />
        <KunSwitch v-model="focusOnRender" label="Focus on render" />
        <KunSwitch v-model="focusOnSelect" label="Focus on select" />
        <KunSwitch v-model="hasCreateItem" label="Botón crear" />
        <KunSwitch v-model="required" label="Required" />
        <KunSwitch v-model="disabled" label="Disabled" />
        <KunSwitch v-model="hideDetails" label="Sin details" />
        <KunSwitch v-model="hasIcons" label="Con iconos" />
      </div>
    </div>
  </div>
</template>
