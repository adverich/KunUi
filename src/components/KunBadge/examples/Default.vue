<script setup lang="ts">
import { ref } from 'vue'
import KunBadge from '../src/components/KunBadge.vue'
import KunBtn from '../../KunBtn/src/components/KunBtn.vue'
import KunSelect from '../../KunSelect/src/components/KunSelect.vue'
import KunSwitch from '../../KunSwitch/src/components/KunSwitch.vue'
import KunTextField from '../../KunTextField/src/components/KunTextField.vue'
import type { KunColor } from '../../../theme/kunVariants.js'

const textRaw = ref('3')
const color = ref<KunColor>('error')
const colorOptions = ref([
  { id: 'primary', name: 'primary' },
  { id: 'success', name: 'success' },
  { id: 'error', name: 'error' },
  { id: 'neutral', name: 'neutral' },
])
const dot = ref(false)
const visible = ref(true)
const shape = ref<'default' | 'pill' | 'square'>('default')
const shapeOptions = ref([
  { id: 'default', name: 'default (rounded-sm)' },
  { id: 'pill', name: 'pill (rounded-full)' },
  { id: 'square', name: 'square (rounded-none)' },
])
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
        :rounded="shape === 'square' ? 'none' : null"
        :pill="shape === 'pill'"
      >
        <KunBtn color="neutral" variant="soft" class="p-3">🔔</KunBtn>
      </KunBadge>
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
      </div>
    </div>
  </div>
</template>
