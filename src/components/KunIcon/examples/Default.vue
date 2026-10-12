<script setup lang="ts">
import { ref, computed } from 'vue'
import KunIcon from '../src/components/KunIcon.vue'
import { icons } from '../../../icons/index.js'
import KunSwitch from '../../KunSwitch/src/components/KunSwitch.vue'
import KunTextField from '../../KunTextField/src/components/KunTextField.vue'
import IconStar from '../../../icons/IconStar.vue'

// ------------------------------------------------------------------
// Icono seleccionado (grilla + texto libre: `$alias`, clase, SVG,
// componente). Vacío = usa el primero del set.
// ------------------------------------------------------------------
const iconKeys = ref(Object.keys(icons).sort())
const iconRaw = ref('$star')
const iconProp = computed(() => (iconRaw.value === '' ? '$star' : iconRaw.value))

function pickIcon(key: string): void {
  iconRaw.value = `$${key}`
}

// ------------------------------------------------------------------
// Controles del playground
// ------------------------------------------------------------------
const size = ref('text-4xl')
const color = ref('')
const cursor = ref('')
const contentClass = ref('')
const disabled = ref(false)

// Aliases custom: pisan el set bundleado (demo con `star`).
const customAliases = {
  star: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'><circle cx='12' cy='12' r='10'/></svg>",
}
const useCustomAliases = ref(false)
const aliasesProp = computed(() => (useCustomAliases.value ? customAliases : undefined))

const svgSample =
  "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'><path d='M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.2l7.1-.6z'/></svg>"

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

      <div class="flex items-center gap-4 rounded-lg bg-surface p-4">
        <KunIcon
          :icon="iconProp"
          :size="size"
          :color="color || undefined"
          :cursor="cursor || null"
          :content-class="contentClass || undefined"
          :disabled="disabled"
          :aliases="aliasesProp"
          @click="logEvent('click', iconProp)"
        />
        <div class="min-w-0 text-sm">
          <div class="font-medium">Demo interactiva</div>
          <p class="text-ui-muted text-xs">Clic en la grilla o escribí: `$alias`, clase CSS, SVG inline o componente.</p>
          <div class="font-mono text-xs mt-1 break-all">{{ iconProp }}</div>
        </div>
      </div>

      <div class="rounded-lg border border-ui p-3">
        <div class="text-ui-muted text-xs mb-2">Set bundleado (clic para usar) — {{ iconKeys.length }} iconos</div>
        <div class="grid grid-cols-6 sm:grid-cols-8 gap-1">
          <button
            v-for="key in iconKeys"
            :key="key"
            type="button"
            :title="`$${key}`"
            class="flex flex-col items-center gap-1 rounded p-2 hover:bg-ui-hover cursor-pointer"
            :class="iconProp === `$${key}` ? 'bg-ui-selection' : ''"
            @click="pickIcon(key)"
          >
            <KunIcon :icon="`$${key}`" size="text-xl" />
            <span class="text-[10px] text-ui-muted leading-none truncate max-w-full">{{ key }}</span>
          </button>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-4 rounded-lg bg-surface p-3 text-sm">
        <span class="text-ui-muted text-xs w-full">Otras formas (estáticas)</span>
        <span class="flex items-center gap-2"><KunIcon :icon="svgSample" size="text-xl" /> SVG inline</span>
        <span class="flex items-center gap-2"><KunIcon :icon="IconStar" size="text-xl" /> Componente</span>
        <span class="flex items-center gap-2"><KunIcon size="text-xl">★</KunIcon> Slot</span>
        <span class="flex items-center gap-2"><KunIcon icon="$alias-inexistente" size="text-xl" /> Alias roto → warn + placeholder</span>
      </div>

      <div class="rounded-lg bg-surface p-3 text-sm">
        <div class="text-ui-muted text-xs mb-1">Últimos eventos</div>
        <ul v-if="eventLog.length" class="space-y-1 font-mono text-xs">
          <li v-for="e in eventLog" :key="e.id">
            <span class="font-semibold">{{ e.name }}</span>
            <span v-if="e.detail" class="text-ui-muted"> — {{ e.detail }}</span>
          </li>
        </ul>
        <p v-else class="text-xs text-ui-muted">Hacé clic en el icono demo para ver eventos…</p>
      </div>
    </div>

    <!-- Panel de configuración (scroll propio: no arrastra la vista previa) -->
    <div class="space-y-4 rounded-xl border border-ui p-4 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto">
      <h3 class="text-sm font-semibold uppercase tracking-wide text-ui-muted">Configuración</h3>

      <div class="grid grid-cols-2 gap-3 [&>*]:min-w-0">
        <KunTextField v-model="iconRaw" label="Icon ($alias, clase, SVG)" density="compact" />
        <KunTextField v-model="size" label="Size" density="compact" />
        <KunTextField v-model="color" label="Color (vacío = default)" density="compact" />
        <KunTextField v-model="cursor" label="Cursor (vacío = auto)" density="compact" />
        <KunTextField v-model="contentClass" label="Content class" density="compact" />

        <KunSwitch v-model="disabled" label="Disabled" />
        <KunSwitch v-model="useCustomAliases" label="Aliases custom (star→círculo)" />
      </div>
    </div>
  </div>
</template>
