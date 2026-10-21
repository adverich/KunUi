<script setup lang="ts">
import { ref, computed, watch, h } from 'vue'
import KunIcon from '../src/components/KunIcon.vue'
import { kunIconAliases } from '../../../icons/index.js'
import { kunConfig } from '../../../config/kunConfig.js'
import { KUN_SIZE_ORDER } from '../../../theme/kunSizes.js'
import KunSwitch from '../../KunSwitch/src/components/KunSwitch.vue'
import KunTextField from '../../KunTextField/src/components/KunTextField.vue'

// ------------------------------------------------------------------
// Icono seleccionado (grilla de alias + texto libre: `$alias`, clase,
// SVG, componente o nombre Iconify). Vacío = usa el primero del set.
// ------------------------------------------------------------------
const aliasKeys = ref(Object.keys(kunIconAliases).sort())
const iconRaw = ref('$star')
const iconProp = computed(() => (iconRaw.value === '' ? '$star' : iconRaw.value))

function pickIcon(key: string): void {
  iconRaw.value = `$${key}`
}

// ------------------------------------------------------------------
// Controles del playground
// ------------------------------------------------------------------
const size = ref('size-9')
const colorClass = ref('')
const cursor = ref('')
const contentClass = ref('')
const disabled = ref(false)

// Aliases custom por instancia: pisan el mapa global (demo con `star`).
const customAliases = {
  star: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'><circle cx='12' cy='12' r='10'/></svg>",
}
const useCustomAliases = ref(false)
const aliasesProp = computed(() => (useCustomAliases.value ? customAliases : undefined))

// Override global vía `kunConfig.icons` (demo: `star` → `lucide:heart`).
const overrideStar = ref(false)
watch(overrideStar, (on) => {
  kunConfig.setIcons({ star: on ? 'lucide:heart' : kunIconAliases.star })
})

const svgSample =
  "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'><path d='M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.2l7.1-.6z'/></svg>"

// Componente demo (para `:is`).
const DemoComponent = {
  render: () =>
    h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'currentColor' }, [
      h('circle', { cx: '12', cy: '12', r: '10' }),
    ]),
}

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
    <!-- Vista previa + grilla (fija: siempre visible al scrollear opciones) -->
    <div class="space-y-3 min-w-0 lg:sticky lg:top-4">
      <h2 class="text-lg font-semibold">KunIcon</h2>

      <div class="flex items-center gap-4 rounded-lg bg-muted p-4">
        <KunIcon
          :icon="iconProp"
          :size="size"
          :class="colorClass || undefined"
          :cursor="cursor || null"
          :content-class="contentClass || undefined"
          :disabled="disabled"
          :aliases="aliasesProp"
          @click="logEvent('click', iconProp)"
        />
        <div class="min-w-0 text-sm">
          <div class="font-medium">Demo interactiva</div>
          <p class="text-muted text-xs">Clic en la grilla o escribí: `$alias`, clase CSS, SVG inline, componente o nombre Iconify (`i-mdi-home`, `lucide:rocket`).</p>
          <div class="font-mono text-xs mt-1 break-all">{{ iconProp }}</div>
        </div>
      </div>

      <div class="rounded-lg border border-default p-3">
        <div class="text-muted text-xs mb-2">Alias de la librería (clic para usar) — {{ aliasKeys.length }}</div>
        <div class="grid grid-cols-6 sm:grid-cols-8 gap-1">
          <button
            v-for="key in aliasKeys"
            :key="key"
            type="button"
            :title="`$${key} → ${kunIconAliases[key]}`"
            class="flex flex-col items-center gap-1 rounded-md p-2 hover:bg-accented cursor-pointer"
            :class="iconProp === `$${key}` ? 'bg-accented' : ''"
            @click="pickIcon(key)"
          >
            <KunIcon :icon="`$${key}`" size="size-5" />
            <span class="text-[10px] text-muted leading-none truncate max-w-full">{{ key }}</span>
          </button>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-4 rounded-lg bg-muted p-3 text-sm">
        <span class="text-muted text-xs w-full">Otras formas (estáticas)</span>
        <span class="flex items-center gap-2"><KunIcon :icon="svgSample" size="size-5" /> SVG inline</span>
        <span class="flex items-center gap-2"><KunIcon :icon="DemoComponent" size="size-5" /> Componente</span>
        <span class="flex items-center gap-2"><KunIcon size="size-5">★</KunIcon> Slot</span>
        <span class="flex items-center gap-2"><KunIcon icon="$alias-inexistente" size="size-5" /> Alias roto → warn + fallback</span>
        <span class="flex items-center gap-2"><KunIcon icon="i-mdi-home" size="size-5" /> Iconify (<code>i-mdi-home</code>)</span>
        <span class="flex items-center gap-2"><KunIcon icon="lucide:rocket" size="size-5" /> Iconify (<code>lucide:rocket</code>)</span>
        <span class="flex items-center gap-2 text-error"><KunIcon size="size-5">●</KunIcon> Hereda color (<code>class="text-error"</code>)</span>
      </div>

      <div class="rounded-lg border border-default p-3">
        <div class="text-muted text-xs mb-2">Escala nominal (mismo size = mismo px)</div>
        <div class="flex flex-wrap items-end gap-3">
          <div v-for="s in KUN_SIZE_ORDER" :key="s" class="flex flex-col items-center gap-1">
            <KunIcon icon="$star" :size="s" />
            <span class="text-[10px] text-muted">{{ s }}</span>
          </div>
        </div>
      </div>

      <div class="rounded-lg bg-muted p-3 text-sm">
        <div class="text-muted text-xs mb-1">Últimos eventos</div>
        <ul v-if="eventLog.length" class="space-y-1 font-mono text-xs">
          <li v-for="e in eventLog" :key="e.id">
            <span class="font-semibold">{{ e.name }}</span>
            <span v-if="e.detail" class="text-muted"> — {{ e.detail }}</span>
          </li>
        </ul>
        <p v-else class="text-xs text-muted">Hacé clic en el icono demo para ver eventos…</p>
      </div>
    </div>

    <!-- Panel de configuración (scroll propio: no arrastra la vista previa) -->
    <div class="space-y-4 rounded-lg border border-default p-4 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto">
      <h3 class="text-sm font-semibold uppercase tracking-wide text-muted">Configuración</h3>

      <div class="grid grid-cols-2 gap-3 [&>*]:min-w-0">
        <KunTextField v-model="iconRaw" label="Icon ($alias, clase, SVG, Iconify)" density="compact" />
        <KunTextField v-model="size" label="Size (xxs…xxl, size-9, px)" density="compact" />
        <KunTextField v-model="colorClass" label="Class (text-error …)" density="compact" />
        <KunTextField v-model="cursor" label="Cursor (vacío = auto)" density="compact" />
        <KunTextField v-model="contentClass" label="Content class" density="compact" />

        <KunSwitch v-model="disabled" label="Disabled" />
        <KunSwitch v-model="useCustomAliases" label="Aliases custom (star→círculo)" />
        <KunSwitch v-model="overrideStar" label="Override global (star→lucide:heart)" />
      </div>
    </div>
  </div>
</template>
