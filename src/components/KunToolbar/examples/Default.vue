<script setup lang="ts">
import { ref, computed } from 'vue'
import KunToolbar from '../src/components/KunToolbar.vue'
import type { KunToolbarTitlePosition, KunToolbarDensity } from '../src/composables/kunToolbarProps.js'
import KunSwitch from '../../KunSwitch/src/components/KunSwitch.vue'
import KunSelect from '../../KunSelect/src/components/KunSelect.vue'
import KunTextField from '../../KunTextField/src/components/KunTextField.vue'

// ------------------------------------------------------------------
// Título
// ------------------------------------------------------------------
const title = ref('Panel principal')
const titlePosition = ref<KunToolbarTitlePosition>('left')
const titlePositionOptions = ref([
  { id: 'left', name: 'left' },
  { id: 'center', name: 'center' },
  { id: 'right', name: 'right' },
])
const titleMaxWidth = ref('max-w-3/4')

// ------------------------------------------------------------------
// Estilo
// ------------------------------------------------------------------
const bgColor = ref('bg-surface')
const density = ref<KunToolbarDensity>('default')
const densityOptions = ref([
  { id: 'default', name: 'default (64px)' },
  { id: 'prominent', name: 'prominent (96px)' },
  { id: 'comfortable', name: 'comfortable (56px)' },
  { id: 'compact', name: 'compact (48px)' },
])
const elevationRaw = ref('')
const elevationProp = computed(() => (elevationRaw.value === '' ? undefined : elevationRaw.value))
const heightRaw = ref('')
const heightProp = computed<string | number | undefined>(() => {
  if (heightRaw.value === '') return undefined
  const n = Number(heightRaw.value)
  return Number.isNaN(n) ? heightRaw.value : n
})
const roundedRaw = ref('')
const roundedProp = computed<string | boolean | undefined>(() => {
  if (roundedRaw.value === '') return undefined
  if (roundedRaw.value === 'true') return true
  if (roundedRaw.value === 'false') return false
  return roundedRaw.value
})
const tag = ref('header')
const theme = ref('')
const tile = ref(false)
const flat = ref(false)
const floating = ref(false)
const absolute = ref(false)

// ------------------------------------------------------------------
// Borde
// ------------------------------------------------------------------
const bordered = ref(false)
const borderColor = ref('')

// ------------------------------------------------------------------
// Extensión / colapso
// ------------------------------------------------------------------
const extended = ref(true)
const collapse = ref(false)
const extensionHeightRaw = ref('48')
const extensionHeightProp = computed<string | number | undefined>(() => {
  if (extensionHeightRaw.value === '') return undefined
  const n = Number(extensionHeightRaw.value)
  return Number.isNaN(n) ? extensionHeightRaw.value : n
})

// ------------------------------------------------------------------
// Imagen de fondo (sin slot #image renderiza un <img> fallback)
// ------------------------------------------------------------------
const image = ref('')

// ------------------------------------------------------------------
// Secciones
// ------------------------------------------------------------------
const leftSectionClass = ref('flex items-center gap-x-2')
const rightSectionClass = ref('flex items-center gap-x-2 justify-end')

// ------------------------------------------------------------------
// Slots demo (no son props del componente)
// ------------------------------------------------------------------
const showPrepend = ref(true)
const useTitleSlot = ref(false)
const showDefault = ref(true)
const showItems = ref(true)
const showAppend = ref(true)
const showExtension = ref(true)
const useImageSlot = ref(false)
</script>

<template>
  <div class="p-4 grid gap-6 lg:grid-cols-2 lg:items-start">
    <!-- Vista previa (fija: siempre visible al scrollear opciones) -->
    <div class="space-y-3 min-w-0 lg:sticky lg:top-4">
      <h2 class="text-lg font-semibold">KunToolbar</h2>

      <div class="overflow-hidden rounded-xl border border-ui">
        <KunToolbar
          :title="title || undefined"
          :title-position="titlePosition"
          :title-max-width="titleMaxWidth"
          :bg-color="bgColor || undefined"
          :density="density"
          :elevation="elevationProp"
          :height="heightProp"
          :rounded="roundedProp"
          :tag="tag"
          :theme="theme || undefined"
          :tile="tile"
          :flat="flat"
          :floating="floating"
          :absolute="absolute"
          :bordered="bordered"
          :border-color="borderColor || undefined"
          :extended="extended"
          :collapse="collapse"
          :extension-height="extensionHeightProp"
          :image="image || undefined"
          :left-section-class="leftSectionClass"
          :right-section-class="rightSectionClass"
        >
          <template v-if="showPrepend" #prepend>
            <span class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-field-background text-sm">☰</span>
          </template>

          <template v-if="useTitleSlot" #title>
            <span class="font-bold italic">Título custom (slot #title)</span>
          </template>

          <template v-if="showDefault">
            <nav class="hidden items-center gap-1 text-sm text-ui-muted md:flex">
              <span>Inicio</span>
              <span>/</span>
              <span class="text-ui">Panel</span>
            </nav>
          </template>

          <template v-if="showItems" #items>
            <button type="button" class="rounded bg-field-background px-2 py-1 text-xs">Nuevo</button>
            <button type="button" class="rounded bg-field-background px-2 py-1 text-xs">Filtros</button>
          </template>

          <template v-if="showAppend" #append>
            <button type="button" class="rounded bg-primary px-2 py-1 text-xs text-white">Guardar</button>
            <span class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-field-background text-xs">AD</span>
          </template>

          <template v-if="useImageSlot" #image>
            <div class="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/40 to-transparent" aria-hidden="true" />
          </template>

          <template v-if="showExtension" #extension>
            <div class="flex items-center gap-4 px-2 pb-2 text-sm">
              <span class="border-b-2 border-primary font-medium">Resumen</span>
              <span class="text-ui-muted">Actividad</span>
              <span class="text-ui-muted">Ajustes</span>
            </div>
          </template>
        </KunToolbar>
      </div>

      <p class="text-xs text-ui-muted">
        Nota: con la prop <code>image</code> y sin slot <code>#image</code>, el toolbar renderiza un
        <code>&lt;img&gt;</code> fallback a sangre completa. La fila de extensión es visible si
        (<code>extended</code> o slot <code>#extension</code>) y no <code>collapse</code>.
      </p>

      <div class="rounded-lg bg-surface p-3 font-mono text-sm">
        <div class="text-ui-muted text-xs mb-1">props en crudo</div>
        <div>{{ JSON.stringify(title || null) }} · {{ titlePosition }} · {{ density }} · ext={{ extensionHeightProp }}</div>
      </div>
    </div>

    <!-- Panel de configuración (scroll propio) -->
    <div class="space-y-4 rounded-xl border border-ui p-4 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto">
      <h3 class="text-sm font-semibold uppercase tracking-wide text-ui-muted">Configuración</h3>

      <div class="grid grid-cols-2 gap-3 [&>*]:min-w-0">
        <p class="col-span-2 pt-2 text-xs font-semibold uppercase tracking-wide text-ui-muted">Título</p>
        <KunTextField v-model="title" label="Title (vacío = sin título)" density="compact" />
        <KunSelect
          v-model="titlePosition"
          v-model:items="titlePositionOptions"
          label="Title position"
          item-value="id"
          item-title="name"
          density="compact"
        />
        <KunTextField v-model="titleMaxWidth" label="Title max width" density="compact" class="col-span-2" />

        <p class="col-span-2 pt-2 text-xs font-semibold uppercase tracking-wide text-ui-muted">Estilo</p>
        <KunTextField v-model="bgColor" label="Bg color (vacío = transparent)" density="compact" />
        <KunSelect
          v-model="density"
          v-model:items="densityOptions"
          label="Density"
          item-value="id"
          item-title="name"
          density="compact"
        />
        <KunTextField v-model="elevationRaw" label="Elevation (vacío = sin clase)" density="compact" />
        <KunTextField v-model="heightRaw" label="Height (vacío = por densidad)" density="compact" inputmode="decimal" />
        <KunTextField v-model="roundedRaw" label="Rounded (true/false/clase, vacío = nada)" density="compact" />
        <KunTextField v-model="tag" label="Tag" density="compact" />
        <KunTextField v-model="theme" label="Theme (vacío = sin hook theme-*)" density="compact" class="col-span-2" />
        <KunSwitch v-model="tile" label="Tile (sin redondeo)" />
        <KunSwitch v-model="flat" label="Flat (sin sombra)" />
        <KunSwitch v-model="floating" label="Floating" />
        <KunSwitch v-model="absolute" label="Absolute" />

        <p class="col-span-2 pt-2 text-xs font-semibold uppercase tracking-wide text-ui-muted">Borde</p>
        <KunSwitch v-model="bordered" label="Bordered" />
        <KunTextField v-model="borderColor" label="Border color (vacío = sin clase)" density="compact" />

        <p class="col-span-2 pt-2 text-xs font-semibold uppercase tracking-wide text-ui-muted">Extensión</p>
        <KunSwitch v-model="extended" label="Extended" />
        <KunSwitch v-model="collapse" label="Collapse (solo extensión)" />
        <KunTextField v-model="extensionHeightRaw" label="Extension height px (vacío = 48)" density="compact" inputmode="decimal" />

        <p class="col-span-2 pt-2 text-xs font-semibold uppercase tracking-wide text-ui-muted">Imagen</p>
        <KunTextField v-model="image" label="Image URL (vacío = sin imagen)" density="compact" class="col-span-2" />

        <p class="col-span-2 pt-2 text-xs font-semibold uppercase tracking-wide text-ui-muted">Secciones</p>
        <KunTextField v-model="leftSectionClass" label="Left section class" density="compact" class="col-span-2" />
        <KunTextField v-model="rightSectionClass" label="Right section class" density="compact" class="col-span-2" />

        <p class="col-span-2 pt-2 text-xs font-semibold uppercase tracking-wide text-ui-muted">Slots demo</p>
        <KunSwitch v-model="showPrepend" label="#prepend" />
        <KunSwitch v-model="useTitleSlot" label="#title (reemplaza prop)" />
        <KunSwitch v-model="showDefault" label="default (centro)" />
        <KunSwitch v-model="showItems" label="#items" />
        <KunSwitch v-model="showAppend" label="#append" />
        <KunSwitch v-model="showExtension" label="#extension" />
        <KunSwitch v-model="useImageSlot" label="#image (reemplaza fallback)" />
      </div>
    </div>
  </div>
</template>
