<script setup lang="ts">
import { computed, ref } from 'vue'
import KunTooltip from '../src/components/KunTooltip.vue'
import type { TooltipLocation } from '../src/composables/useTooltipPosition.js'
import KunBtn from '../../KunBtn/src/components/KunBtn.vue'
import KunSwitch from '../../KunSwitch/src/components/KunSwitch.vue'
import KunSelect from '../../KunSelect/src/components/KunSelect.vue'
import KunTextField from '../../KunTextField/src/components/KunTextField.vue'

type TooltipOpenOn = 'hover' | 'click' | 'focus'

// ------------------------------------------------------------------
// Controles del playground
// ------------------------------------------------------------------
const text = ref('Tooltip de ejemplo')

const location = ref<TooltipLocation>('top')
const locationOptions = ref([
  { id: 'top', name: 'top (arriba)' },
  { id: 'bottom', name: 'bottom (abajo)' },
  { id: 'left', name: 'left (izquierda)' },
  { id: 'right', name: 'right (derecha)' },
])

const openOn = ref<TooltipOpenOn>('hover')
const openOnOptions = ref([
  { id: 'hover', name: 'hover' },
  { id: 'click', name: 'click' },
  { id: 'focus', name: 'focus' },
])

const transition = ref('fade')

const delayRaw = ref('0')
const closeDelayRaw = ref('100')
const delayProp = computed(() => (delayRaw.value === '' ? 0 : Number(delayRaw.value)))
const closeDelayProp = computed(() => (closeDelayRaw.value === '' ? 100 : Number(closeDelayRaw.value)))

const textColor = ref('text-ui')
const bgColor = ref('bg-surface-dark')
const rounded = ref('rounded')
const textSize = ref('text-sm')

const distXRaw = ref('0')
const distYRaw = ref('8')
const distProp = computed(() => ({ x: Number(distXRaw.value || 0), y: Number(distYRaw.value || 0) }))

const flip = ref(true)
const disabled = ref(false)

const hint = computed(() =>
  openOn.value === 'click'
    ? 'Hacé clic en el botón para mostrar el tooltip…'
    : openOn.value === 'focus'
      ? 'Enfocá el botón con Tab para mostrar el tooltip…'
      : 'Pasá el cursor sobre el botón para mostrar el tooltip…',
)
</script>

<template>
  <div class="p-4 grid gap-6 lg:grid-cols-2 lg:items-start">
    <!-- Vista previa (fija: siempre visible al scrollear opciones) -->
    <div class="space-y-3 min-w-0 lg:sticky lg:top-4">
      <h2 class="text-lg font-semibold">KunTooltip</h2>

      <div class="flex items-center justify-center rounded-lg bg-surface p-10">
        <KunTooltip
          :text="text"
          :location="location"
          :open-on="openOn"
          :transition="transition"
          :delay="delayProp"
          :close-delay="closeDelayProp"
          :text-color="textColor"
          :bg-color="bgColor"
          :rounded="rounded"
          :text-size="textSize"
          :dist="distProp"
          :flip="flip"
          :disabled="disabled"
        >
          <template #activator="{ props }">
            <KunBtn v-bind="props">Activador</KunBtn>
          </template>
        </KunTooltip>
      </div>

      <p class="text-xs text-ui-muted">{{ hint }}</p>
    </div>

    <!-- Panel de configuración (scroll propio: no arrastra el demo) -->
    <div class="space-y-4 rounded-xl border border-ui p-4 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto">
      <h3 class="text-sm font-semibold uppercase tracking-wide text-ui-muted">Configuración</h3>

      <div class="grid grid-cols-2 gap-3 [&>*]:min-w-0">
        <KunTextField v-model="text" label="Text" density="compact" />
        <KunTextField v-model="transition" label="Transition" density="compact" />

        <KunSelect
          v-model="location"
          v-model:items="locationOptions"
          label="Location"
          item-value="id"
          item-title="name"
          density="compact"
        />
        <KunSelect
          v-model="openOn"
          v-model:items="openOnOptions"
          label="Open on"
          item-value="id"
          item-title="name"
          density="compact"
        />

        <KunTextField v-model="delayRaw" label="Delay (ms)" density="compact" inputmode="numeric" />
        <KunTextField v-model="closeDelayRaw" label="Close delay (ms)" density="compact" inputmode="numeric" />

        <KunTextField v-model="textColor" label="Text color" density="compact" />
        <KunTextField v-model="bgColor" label="Bg color" density="compact" />
        <KunTextField v-model="rounded" label="Rounded" density="compact" />
        <KunTextField v-model="textSize" label="Text size" density="compact" />

        <KunTextField v-model="distXRaw" label="Dist X" density="compact" inputmode="numeric" />
        <KunTextField v-model="distYRaw" label="Dist Y" density="compact" inputmode="numeric" />

        <KunSwitch v-model="flip" label="Flip" />
        <KunSwitch v-model="disabled" label="Disabled" />
      </div>
    </div>
  </div>
</template>
