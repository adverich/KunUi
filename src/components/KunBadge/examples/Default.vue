<script setup lang="ts">
import { ref, computed } from 'vue'
import KunBadge from '../src/components/KunBadge.vue'
import KunBtn from '../../KunBtn/src/components/KunBtn.vue'
import KunSelect from '../../KunSelect/src/components/KunSelect.vue'
import KunSwitch from '../../KunSwitch/src/components/KunSwitch.vue'
import KunTextField from '../../KunTextField/src/components/KunTextField.vue'
import type { KunColor } from '../../../theme/kunVariants.js'
import { KUN_BADGE_POSITIONS } from '../src/composables/kunBadgeProps.js'

const textRaw = ref('3')
const color = ref<KunColor>('error')
const colorOptions = ref([
  { id: 'primary', name: 'primary' },
  { id: 'success', name: 'success' },
  { id: 'info', name: 'info' },
  { id: 'warning', name: 'warning' },
  { id: 'error', name: 'error' },
  { id: 'neutral', name: 'neutral' },
])
const dot = ref(false)
const visible = ref(true)
const shape = ref<'default' | 'pill' | 'circle' | 'square'>('default')
const shapeOptions = ref([
  { id: 'default', name: 'default (rounded-sm)' },
  { id: 'pill', name: 'pill (rounded-full)' },
  { id: 'circle', name: 'circle (1:1)' },
  { id: 'square', name: 'square (rounded-none)' },
])

const textSize = ref('text-xs')
const fontWeight = ref('font-bold')
const cursor = ref('cursor-default')

const position = ref<(typeof KUN_BADGE_POSITIONS)[number]>('top right')
const positionOptions = ref(KUN_BADGE_POSITIONS.map((id) => ({ id, name: id })))

const ejeXRaw = ref('0')
const ejeYRaw = ref('0')
const ejeXProp = computed<number | undefined>(() => (ejeXRaw.value === '' ? undefined : Number(ejeXRaw.value)))
const ejeYProp = computed<number | undefined>(() => (ejeYRaw.value === '' ? undefined : Number(ejeYRaw.value)))
</script>

<template>
  <div class="p-4 grid gap-6 lg:grid-cols-2 lg:items-start">
    <div class="space-y-3 min-w-0 lg:sticky lg:top-4">
      <h2 class="text-lg font-semibold">KunBadge</h2>
      <KunBadge
        :text="textRaw"
        :color="color"
        :dot="dot"
        :visible="visible"
        :rounded="shape === 'square' ? 'none' : shape === 'circle' ? 'full' : null"
        :pill="shape === 'pill'"
        :text-size="textSize"
        :font-weight="fontWeight"
        :cursor="cursor"
        :position="position"
        :eje-x="ejeXProp"
        :eje-y="ejeYProp"
      >
        <KunBtn color="neutral" variant="soft" icon="palette" square aria-label="Paleta" />
      </KunBadge>

      <div class="flex items-center gap-3 text-xs text-muted">
        <KunBadge text="1" rounded="full"><span class="inline-block size-8 rounded-md bg-muted" /></KunBadge>
        <KunBadge text="99" rounded="full"><span class="inline-block size-8 rounded-md bg-muted" /></KunBadge>
        <KunBadge text="100" rounded="full"><span class="inline-block size-8 rounded-md bg-muted" /></KunBadge>
        <span>1 / 99 / 100 (círculo 1:1, anclado a la esquina)</span>
      </div>
    </div>

    <div class="space-y-4 rounded-lg border border-default p-4 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto">
      <h3 class="text-sm font-semibold uppercase tracking-wide text-muted">Configuración</h3>
      <div class="grid grid-cols-2 gap-3 [&>*]:min-w-0">
        <KunTextField v-model="textRaw" label="Text" density="compact" />
        <KunSelect
          v-model="color"
          v-model:items="colorOptions"
          label="Color"
          item-value="id"
          item-title="name"
          density="compact"
        />
        <KunSwitch v-model="dot" label="Dot" />
        <KunSwitch v-model="visible" label="Visible" />
        <KunSelect
          v-model="shape"
          v-model:items="shapeOptions"
          label="Shape"
          item-value="id"
          item-title="name"
          density="compact"
        />
        <KunSelect
          v-model="position"
          v-model:items="positionOptions"
          label="Position"
          item-value="id"
          item-title="name"
          density="compact"
        />
        <KunTextField v-model="textSize" label="Text size" density="compact" />
        <KunTextField v-model="fontWeight" label="Font weight" density="compact" />
        <KunTextField v-model="cursor" label="Cursor" density="compact" />
        <KunTextField v-model="ejeXRaw" label="ejeX px (vacío = default)" density="compact" inputmode="numeric" />
        <KunTextField v-model="ejeYRaw" label="ejeY px (vacío = default)" density="compact" inputmode="numeric" />
      </div>
    </div>
  </div>
</template>
