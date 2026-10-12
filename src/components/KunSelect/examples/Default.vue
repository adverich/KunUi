<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import KunSelect from '../src/components/KunSelect.vue'
import type { KunTextFieldDensity } from '../../KunTextField/src/composables/KunTextFieldProps.js'
import type { KunMenuOrigin } from '../../KunMenu/src/composables/kunMenuProps.js'
import KunSwitch from '../../KunSwitch/src/components/KunSwitch.vue'
import KunTextField from '../../KunTextField/src/components/KunTextField.vue'

// ------------------------------------------------------------------
// v-model principal: se muestra en crudo debajo del campo.
// Con `multiple` el valor es un array; con `returnObject` objetos.
// `any` intencional: el modelo del componente es `defineModel<any>`.
// ------------------------------------------------------------------
const model = ref<any>(2)

const fruitItems = ref([
  { id: 1, name: 'Manzana', category: 'Pomácea' },
  { id: 2, name: 'Banana', category: 'Tropical' },
  { id: 3, name: 'Naranja', category: 'Cítrico' },
  { id: 4, name: 'Frutilla', category: 'Baya' },
  { id: 5, name: 'Kiwi', category: 'Tropical', disabled: true },
  { id: 6, name: 'Mango', category: 'Tropical' },
])

// ------------------------------------------------------------------
// Controles del playground
// ------------------------------------------------------------------
const label = ref('Fruta')
const itemValue = ref('id')
const itemTitle = ref('name')
const itemText = ref('')
const itemSubtitle = ref('category')

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

const placeholder = ref('')
const placeholderText = ref('Seleccionar')
const textNoItems = ref('No hay elementos')

const maxHeightRaw = ref('')
const maxHeightProp = computed(() => {
  if (maxHeightRaw.value === '') return undefined
  const n = Number(maxHeightRaw.value)
  return Number.isNaN(n) ? maxHeightRaw.value : n
})

const zIndex = ref('z-250')
const btnCreateClass = ref('w-full')
const btnCreateBg = ref('bg-success')
const btnCreateText = ref('Crear item')
const iconColor = ref('text-ui-primary')
const requiredIconColor = ref('text-ui-primary')
const emptyTextClass = ref('text-ui-muted')
const bgMenuColor = ref('bg-menu')
const bgItemListColor = ref('bg-transparent')
const selectedItemListColor = ref('bg-ui-selection text-ui-selection')
const hoverItemListColor = ref('hover:bg-ui-selection-hover')

const multiple = ref(false)
const returnObject = ref(false)
const focusOnRender = ref(false)
const focusOnSelect = ref(false)
const clearable = ref(true)
const clearOnSelect = ref(false)
const closeOnSelect = ref(true)
const hasCreateItem = ref(false)
const required = ref(false)
const disabled = ref(false)
const readonly = ref(false)
const hideDetails = ref(true)
const hasIcons = ref(true)

// Al alternar `multiple` se resetea el modelo al shape correcto.
watch(multiple, (v) => {
  if (v) {
    model.value = model.value === null || model.value === undefined || model.value === ''
      ? []
      : Array.isArray(model.value) ? model.value : [model.value]
  } else {
    model.value = Array.isArray(model.value) ? (model.value[0] ?? null) : model.value
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
  let text = ''
  try {
    text = typeof detail === 'object' && detail !== null ? JSON.stringify(detail) : String(detail ?? '')
  } catch {
    text = String(detail ?? '')
  }
  eventLog.value.unshift({ id: eventSeq, name, detail: text })
  if (eventLog.value.length > 8) eventLog.value.pop()
}
</script>

<template>
  <div class="p-4 grid gap-6 lg:grid-cols-2 lg:items-start">
    <!-- Vista previa + v-model (fija: siempre visible al scrollear opciones) -->
    <div class="space-y-3 min-w-0 lg:sticky lg:top-4">
      <h2 class="text-lg font-semibold">KunSelect</h2>

      <KunSelect
        v-model="model"
        v-model:items="fruitItems"
        :label="label"
        :item-value="itemValue"
        :item-title="itemTitle"
        :item-text="itemText"
        :item-subtitle="itemSubtitle"
        :return-object="returnObject"
        :focus-on-render="focusOnRender"
        :focus-on-select="focusOnSelect"
        :clearable="clearable"
        :clear-on-select="clearOnSelect"
        :close-on-select="closeOnSelect"
        :menu-origin="menuOrigin"
        :placeholder="placeholder"
        :placeholder-text="placeholderText"
        :text-no-items="textNoItems"
        :has-create-item="hasCreateItem"
        :btn-create-class="btnCreateClass"
        :btn-create-bg="btnCreateBg"
        :btn-create-text="btnCreateText"
        :multiple="multiple"
        :required="required"
        :disabled="disabled"
        :readonly="readonly"
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
        @selected-item="logEvent('selectedItem', $event)"
        @create-item="logEvent('createItem', '')"
        @cleared="logEvent('cleared', '')"
        @validation="logEvent('validation', $event)"
        @key-down="logEvent('keyDown', $event)"
      />

      <div class="rounded-lg bg-surface p-3 font-mono text-sm">
        <div class="text-ui-muted text-xs mb-1">v-model en crudo</div>
        <div>{{ JSON.stringify(model) }} <span class="text-ui-muted">({{ Array.isArray(model) ? 'array' : typeof model }})</span></div>
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
        <KunTextField v-model="itemValue" label="Item value" density="compact" />
        <KunTextField v-model="itemTitle" label="Item title" density="compact" />
        <KunTextField v-model="itemText" label="Item text (alias)" density="compact" />
        <KunTextField v-model="itemSubtitle" label="Item subtitle" density="compact" />
        <KunTextField v-model="placeholder" label="Placeholder" density="compact" />
        <KunTextField v-model="placeholderText" label="Placeholder text" density="compact" />
        <KunTextField v-model="textNoItems" label="Text no items" density="compact" />
        <KunTextField v-model="maxHeightRaw" label="Max height (vacío = auto)" density="compact" />
        <KunTextField v-model="zIndex" label="Z index" density="compact" />
        <KunTextField v-model="btnCreateText" label="Btn create text" density="compact" />
        <KunTextField v-model="btnCreateBg" label="Btn create bg" density="compact" />
        <KunTextField v-model="btnCreateClass" label="Btn create class" density="compact" />
        <KunTextField v-model="iconColor" label="Icon color" density="compact" />
        <KunTextField v-model="requiredIconColor" label="Required icon color" density="compact" />
        <KunTextField v-model="emptyTextClass" label="Empty text class" density="compact" />
        <KunTextField v-model="bgMenuColor" label="Bg menu color" density="compact" />
        <KunTextField v-model="bgItemListColor" label="Bg item list color" density="compact" />
        <KunTextField v-model="selectedItemListColor" label="Selected item color" density="compact" />
        <KunTextField v-model="hoverItemListColor" label="Hover item color" density="compact" />

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

        <KunSwitch v-model="multiple" label="Multiple" />
        <KunSwitch v-model="returnObject" label="Return object" />
        <KunSwitch v-model="clearable" label="Clearable" />
        <KunSwitch v-model="clearOnSelect" label="Clear on select" />
        <KunSwitch v-model="closeOnSelect" label="Close on select" />
        <KunSwitch v-model="focusOnRender" label="Focus on render" />
        <KunSwitch v-model="focusOnSelect" label="Focus on select" />
        <KunSwitch v-model="hasCreateItem" label="Has create item" />
        <KunSwitch v-model="required" label="Required" />
        <KunSwitch v-model="hasIcons" label="Has icons" />
        <KunSwitch v-model="hideDetails" label="Sin details" />
        <KunSwitch v-model="disabled" label="Disabled" />
        <KunSwitch v-model="readonly" label="Readonly" />
      </div>
    </div>
  </div>
</template>
