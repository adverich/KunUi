<script setup lang="ts">
import { ref, computed } from 'vue'
import KunSkeleton from '../src/components/KunSkeleton.vue'
import type { KunSkeletonVariant, KunSkeletonAnimation } from '../src/composables/kunSkeletonProps.js'
import KunSwitch from '../../KunSwitch/src/components/KunSwitch.vue'
import KunSelect from '../../KunSelect/src/components/KunSelect.vue'
import KunTextField from '../../KunTextField/src/components/KunTextField.vue'

const loading = ref(true)

const variant = ref<KunSkeletonVariant>('rect')
const variantOptions = ref([
  { id: 'rect', name: 'rect' },
  { id: 'circle', name: 'circle' },
  { id: 'text', name: 'text' },
])

const animation = ref<KunSkeletonAnimation>('shimmer')
const animationOptions = ref([
  { id: 'shimmer', name: 'shimmer' },
  { id: 'shimmer-vertical', name: 'shimmer-vertical' },
  { id: 'pulse', name: 'pulse' },
  { id: 'none', name: 'none' },
])

const width = ref('100%')
const height = ref('1rem')
const rounded = ref('md')
const durationRaw = ref('1500')
const durationProp = computed(() => (durationRaw.value === '' ? 1500 : Number(durationRaw.value)))
const colorFrom = ref('bg-ui-surface-subtle')
const colorTo = ref('bg-ui-hover')
</script>

<template>
  <div class="p-4 grid gap-6 lg:grid-cols-2 lg:items-start">
    <!-- Vista previa (fija: siempre visible al scrollear opciones) -->
    <div class="space-y-3 min-w-0 lg:sticky lg:top-4">
      <h2 class="text-lg font-semibold">KunSkeleton</h2>

      <div class="rounded-xl border border-ui p-3">
        <KunSkeleton
          :loading="loading"
          :variant="variant"
          :width="width || undefined"
          :height="height || undefined"
          :rounded="rounded || undefined"
          :animation="animation"
          :duration="durationProp"
          :color-from="colorFrom || undefined"
          :color-to="colorTo || undefined"
        >
          <div class="flex items-center gap-3">
            <div class="h-10 w-10 rounded-full bg-success/30" />
            <div>
              <p class="text-sm font-medium">Contenido real</p>
              <p class="text-xs text-ui-muted">Visible cuando loading=false</p>
            </div>
          </div>
        </KunSkeleton>
      </div>

      <p class="font-mono text-xs text-ui-muted">
        loading={{ loading }} variant={{ variant }} animation={{ animation }}
      </p>
    </div>

    <!-- Panel de configuración (scroll propio) -->
    <div class="space-y-4 rounded-xl border border-ui p-4 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto">
      <h3 class="text-sm font-semibold uppercase tracking-wide text-ui-muted">Configuración</h3>

      <div class="grid grid-cols-2 gap-3 [&>*]:min-w-0">
        <KunSwitch v-model="loading" label="Loading" />
        <div class="hidden sm:block" />
        <KunSelect
          v-model="variant"
          v-model:items="variantOptions"
          label="Variant"
          item-value="id"
          item-title="name"
          density="compact"
        />
        <KunSelect
          v-model="animation"
          v-model:items="animationOptions"
          label="Animation"
          item-value="id"
          item-title="name"
          density="compact"
        />
        <KunTextField v-model="width" label="Width (vacío = 100%)" density="compact" />
        <KunTextField v-model="height" label="Height (vacío = 1rem)" density="compact" />
        <KunTextField v-model="rounded" label="Rounded" density="compact" />
        <KunTextField v-model="durationRaw" label="Duration ms (vacío = 1500)" density="compact" inputmode="numeric" />
        <KunTextField v-model="colorFrom" label="Color from (vacío = default)" density="compact" />
        <KunTextField v-model="colorTo" label="Color to (vacío = default)" density="compact" />
      </div>
    </div>
  </div>
</template>
