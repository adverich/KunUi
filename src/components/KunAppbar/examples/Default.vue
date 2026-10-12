<script setup lang="ts">
import { ref, computed } from 'vue'
import KunAppbar from '../src/components/KunAppbar.vue'
import type { KunAppbarTitlePosition, KunAppbarDensity, KunAppbarElevation, KunAppbarTransition } from '../src/composables/kunAppbarProps.js'
import KunSwitch from '../../KunSwitch/src/components/KunSwitch.vue'
import KunSelect from '../../KunSelect/src/components/KunSelect.vue'
import KunTextField from '../../KunTextField/src/components/KunTextField.vue'

// ------------------------------------------------------------------
// Título
// ------------------------------------------------------------------
const title = ref('Mi aplicación')
const titleImage = ref('')
const titleSize = ref('text-base')
const titleWeight = ref('font-medium')
const titlePosition = ref<KunAppbarTitlePosition>('center')
const titlePositionOptions = ref([
  { id: 'left', name: 'left' },
  { id: 'center', name: 'center' },
  { id: 'right', name: 'right' },
])

// ------------------------------------------------------------------
// Apariencia
// ------------------------------------------------------------------
const bgColor = ref('bg-surface')
const density = ref<KunAppbarDensity>('default')
const densityOptions = ref([
  { id: 'default', name: 'default (64px)' },
  { id: 'comfortable', name: 'comfortable (56px)' },
  { id: 'compact', name: 'compact (48px)' },
])
const height = ref('')
const elevation = ref<KunAppbarElevation>('md')
const elevationOptions = ref([
  { id: 'sm', name: 'sm' },
  { id: 'md', name: 'md' },
  { id: 'lg', name: 'lg' },
  { id: 'xl', name: 'xl' },
  { id: '2xl', name: '2xl' },
  { id: 'none', name: 'none' },
])
const bordered = ref(false)
const borderColor = ref('border-b border-ui')

// ------------------------------------------------------------------
// Botón drawer
// ------------------------------------------------------------------
const showDrawerButton = ref(true)
const buttonClass = ref('px-2')
const buttonBg = ref('bg-button-disabled opacity-75')

// ------------------------------------------------------------------
// Secciones / posición
// ------------------------------------------------------------------
const leftSectionClass = ref('flex items-center gap-2')
const rightSectionClass = ref('flex items-center gap-2 justify-end ml-auto')
const zIndex = ref('z-1000')
const fixed = ref(false)
const sticky = ref(false)
const glass = ref(false)

// ------------------------------------------------------------------
// Comportamiento
// ------------------------------------------------------------------
const autoHideOnScroll = ref(false)
const responsiveCollapse = ref(false)
const collapseBreakpointRaw = ref('768')
const collapseBreakpointProp = computed(() =>
  collapseBreakpointRaw.value === '' ? undefined : Number(collapseBreakpointRaw.value),
)
const transition = ref<KunAppbarTransition>('fade-slide')
const transitionOptions = ref([
  { id: 'fade-slide', name: 'fade-slide' },
  { id: 'fade', name: 'fade' },
  { id: 'scale', name: 'scale' },
])
const animationClass = ref('')

// ------------------------------------------------------------------
// Slots demo (no son props del componente)
// ------------------------------------------------------------------
const showPrepend = ref(true)
const useTitleSlot = ref(false)
const showActions = ref(true)
const useAppbarButtonSlot = ref(false)

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
    <!-- Vista previa (fija: siempre visible al scrollear opciones) -->
    <div class="space-y-3 min-w-0 lg:sticky lg:top-4">
      <h2 class="text-lg font-semibold">KunAppbar</h2>

      <div class="overflow-hidden rounded-xl border border-ui">
        <KunAppbar
          :title="title || undefined"
          :title-image="titleImage || undefined"
          :title-size="titleSize"
          :title-weight="titleWeight"
          :title-position="titlePosition"
          :bg-color="bgColor"
          :density="density"
          :height="height || undefined"
          :elevation="elevation"
          :bordered="bordered"
          :border-color="borderColor"
          :show-drawer-button="showDrawerButton"
          :button-class="buttonClass"
          :button-bg="buttonBg"
          :left-section-class="leftSectionClass"
          :right-section-class="rightSectionClass"
          :z-index="zIndex"
          :fixed="fixed"
          :sticky="sticky"
          :glass="glass"
          :auto-hide-on-scroll="autoHideOnScroll"
          :responsive-collapse="responsiveCollapse"
          :collapse-breakpoint="collapseBreakpointProp"
          :transition="transition"
          :animation-class="animationClass"
          @toggle-drawer="logEvent('toggle-drawer', 'click')"
        >
          <template v-if="useAppbarButtonSlot" #appbarButton>
            <button type="button" class="rounded bg-field-background px-2 py-1 text-sm" @click="logEvent('toggle-drawer', 'slot #appbarButton')">☰ menú</button>
          </template>

          <template v-if="showPrepend" #prepend>
            <nav class="hidden items-center gap-3 text-sm sm:flex">
              <span class="font-medium">Inicio</span>
              <span class="text-ui-muted">Docs</span>
              <span class="text-ui-muted">Blog</span>
            </nav>
          </template>

          <template v-if="useTitleSlot" #title>
            <span class="font-bold italic">Título custom (slot #title)</span>
          </template>

          <template v-if="showActions" #actions>
            <button type="button" class="rounded bg-field-background px-2 py-1 text-xs">Buscar</button>
            <span class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-field-background text-xs">AD</span>
          </template>
        </KunAppbar>
      </div>

      <p class="text-xs text-ui-muted">
        El botón ☰ emite <code>toggle-drawer</code>. El slot <code>#appbarButton</code> reemplaza ese botón.
        <code>fixed</code>/<code>sticky</code> y <code>autoHideOnScroll</code> solo se aprecian en página con scroll.
      </p>

      <div class="rounded-lg bg-surface p-3 font-mono text-sm">
        <div class="text-ui-muted text-xs mb-1">props en crudo</div>
        <div>{{ JSON.stringify(title || null) }} · {{ titlePosition }} · {{ density }} · {{ elevation }} · {{ transition }}</div>
      </div>

      <div class="rounded-lg bg-surface p-3 text-sm">
        <div class="text-ui-muted text-xs mb-1">Últimos eventos</div>
        <ul v-if="eventLog.length" class="space-y-1 font-mono text-xs">
          <li v-for="e in eventLog" :key="e.id">
            <span class="font-semibold">{{ e.name }}</span>
            <span v-if="e.detail" class="text-ui-muted"> — {{ e.detail }}</span>
          </li>
        </ul>
        <p v-else class="text-xs text-ui-muted">Pulsá el botón del drawer para ver eventos…</p>
      </div>
    </div>

    <!-- Panel de configuración (scroll propio) -->
    <div class="space-y-4 rounded-xl border border-ui p-4 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto">
      <h3 class="text-sm font-semibold uppercase tracking-wide text-ui-muted">Configuración</h3>

      <div class="grid grid-cols-2 gap-3 [&>*]:min-w-0">
        <p class="col-span-2 pt-2 text-xs font-semibold uppercase tracking-wide text-ui-muted">Título</p>
        <KunTextField v-model="title" label="Title (vacío = sin título)" density="compact" />
        <KunTextField v-model="titleImage" label="Title image URL (vacío = texto)" density="compact" />
        <KunTextField v-model="titleSize" label="Title size" density="compact" />
        <KunTextField v-model="titleWeight" label="Title weight" density="compact" />
        <KunSelect
          v-model="titlePosition"
          v-model:items="titlePositionOptions"
          label="Title position"
          item-value="id"
          item-title="name"
          density="compact"
        />

        <p class="col-span-2 pt-2 text-xs font-semibold uppercase tracking-wide text-ui-muted">Apariencia</p>
        <KunTextField v-model="bgColor" label="Bg color" density="compact" />
        <KunSelect
          v-model="density"
          v-model:items="densityOptions"
          label="Density"
          item-value="id"
          item-title="name"
          density="compact"
        />
        <KunTextField v-model="height" label="Height clase (vacío = por densidad)" density="compact" />
        <KunSelect
          v-model="elevation"
          v-model:items="elevationOptions"
          label="Elevation"
          item-value="id"
          item-title="name"
          density="compact"
        />
        <KunSwitch v-model="bordered" label="Bordered" />
        <KunTextField v-model="borderColor" label="Border color" density="compact" />

        <p class="col-span-2 pt-2 text-xs font-semibold uppercase tracking-wide text-ui-muted">Botón drawer</p>
        <KunSwitch v-model="showDrawerButton" label="Show drawer button" />
        <KunTextField v-model="buttonClass" label="Button class" density="compact" />
        <KunTextField v-model="buttonBg" label="Button bg" density="compact" class="col-span-2" />

        <p class="col-span-2 pt-2 text-xs font-semibold uppercase tracking-wide text-ui-muted">Secciones / posición</p>
        <KunTextField v-model="leftSectionClass" label="Left section class" density="compact" class="col-span-2" />
        <KunTextField v-model="rightSectionClass" label="Right section class" density="compact" class="col-span-2" />
        <KunTextField v-model="zIndex" label="Z index" density="compact" />
        <KunSwitch v-model="fixed" label="Fixed" />
        <KunSwitch v-model="sticky" label="Sticky" />
        <KunSwitch v-model="glass" label="Glass" />

        <p class="col-span-2 pt-2 text-xs font-semibold uppercase tracking-wide text-ui-muted">Comportamiento</p>
        <KunSwitch v-model="autoHideOnScroll" label="Auto hide on scroll" />
        <KunSwitch v-model="responsiveCollapse" label="Responsive collapse" />
        <KunTextField v-model="collapseBreakpointRaw" label="Collapse breakpoint px (vacío = 768)" density="compact" inputmode="decimal" />
        <KunSelect
          v-model="transition"
          v-model:items="transitionOptions"
          label="Transition"
          item-value="id"
          item-title="name"
          density="compact"
        />
        <KunTextField v-model="animationClass" label="Animation class" density="compact" class="col-span-2" />

        <p class="col-span-2 pt-2 text-xs font-semibold uppercase tracking-wide text-ui-muted">Slots demo</p>
        <KunSwitch v-model="showPrepend" label="#prepend (nav)" />
        <KunSwitch v-model="useTitleSlot" label="#title (reemplaza prop)" />
        <KunSwitch v-model="showActions" label="#actions" />
        <KunSwitch v-model="useAppbarButtonSlot" label="#appbarButton (reemplaza botón)" />
      </div>
    </div>
  </div>
</template>
