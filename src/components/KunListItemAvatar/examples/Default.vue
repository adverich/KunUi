<script setup lang="ts">
import { ref, computed } from 'vue'
import KunListItemAvatar from '../src/components/KunListItemAvatar.vue'
import type { KunListItemAvatarSize } from '../src/composables/kunListItemAvatarProps.js'
import KunSelect from '../../KunSelect/src/components/KunSelect.vue'
import KunTextField from '../../KunTextField/src/components/KunTextField.vue'

// ------------------------------------------------------------------
// Controles del playground
// ------------------------------------------------------------------
const text = ref('AB')

const size = ref<KunListItemAvatarSize>('md')
const sizeOptions = ref([
  { id: 'sm', name: 'sm' },
  { id: 'md', name: 'md' },
  { id: 'lg', name: 'lg' },
])

const roundedRaw = ref('__circle')
const roundedOptions = ref([
  { id: '__circle', name: 'circular (null)' },
  { id: 'none', name: 'none' },
])
const roundedProp = computed<'full' | 'none' | null>(() =>
  roundedRaw.value === 'none' ? 'none' : null,
)
const fontWeight = ref('font-medium')
</script>

<template>
  <div class="p-4 grid gap-6 lg:grid-cols-2 lg:items-start">
    <!-- Vista previa (fija: siempre visible al scrollear opciones) -->
    <div class="space-y-3 min-w-0 lg:sticky lg:top-4">
      <h2 class="text-lg font-semibold">KunListItemAvatar</h2>

      <div class="flex items-center gap-3 rounded-lg bg-muted p-3">
        <KunListItemAvatar
          :text="text || null"
          :size="size"
          :rounded="roundedProp"
          :font-weight="fontWeight"
        />
        <div class="min-w-0">
          <p class="truncate font-medium">Ada Lovelace</p>
          <p class="truncate text-sm text-muted">Ingeniera de software</p>
        </div>
      </div>

      <div class="flex items-center gap-3 rounded-lg bg-muted p-3">
        <KunListItemAvatar text="SM" size="sm" :rounded="roundedProp" />
        <KunListItemAvatar text="MD" size="md" :rounded="roundedProp" />
        <KunListItemAvatar text="LG" size="lg" :rounded="roundedProp" />
      </div>
    </div>

    <!-- Panel de configuración (scroll propio) -->
    <div class="space-y-4 rounded-lg border border-default p-4 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto">
      <h3 class="text-sm font-semibold uppercase tracking-wide text-muted">Configuración</h3>

      <div class="grid grid-cols-2 gap-3 [&>*]:min-w-0">
        <KunTextField v-model="text" label="Text (vacío = sin texto)" density="compact" />
        <KunSelect
          v-model="size"
          v-model:items="sizeOptions"
          label="Size"
          item-value="id"
          item-title="name"
          density="compact"
        />
        <KunSelect
          v-model="roundedRaw"
          v-model:items="roundedOptions"
          label="Rounded"
          item-value="id"
          item-title="name"
          density="compact"
        />
        <KunTextField v-model="fontWeight" label="Font weight" density="compact" />
      </div>
    </div>
  </div>
</template>
