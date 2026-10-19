<script setup lang="ts">
import { ref, watch } from 'vue'
import KunList from '../src/components/KunList.vue'
import KunListItem from '../../KunListItem/src/components/KunListItem.vue'
import type { KunListSelectionMode } from '../src/composables/kunListProps.js'
import KunSelect from '../../KunSelect/src/components/KunSelect.vue'
import KunSwitch from '../../KunSwitch/src/components/KunSwitch.vue'
import KunTextField from '../../KunTextField/src/components/KunTextField.vue'

// ------------------------------------------------------------------
// Selección (v-model:selected, espejo de defineModel('selected'))
// ------------------------------------------------------------------
const selected = ref<unknown>([])

// ------------------------------------------------------------------
// Controles del playground
// ------------------------------------------------------------------
const nav = ref(true)
const sub = ref(false)
const dense = ref(false)
const selectable = ref(true)

const selectionMode = ref<KunListSelectionMode>('multiple')
const selectionModeOptions = ref([
  { id: 'single', name: 'single' },
  { id: 'multiple', name: 'multiple' },
])

watch(selectionMode, (mode) => {
  selected.value = mode === 'multiple' ? [] : null
})

const fontSize = ref('text-base')
</script>

<template>
  <div class="p-4 grid gap-6 lg:grid-cols-2 lg:items-start">
    <!-- Vista previa (fija: siempre visible al scrollear opciones) -->
    <div class="space-y-3 min-w-0 lg:sticky lg:top-4">
      <h2 class="text-lg font-semibold">KunList</h2>

      <KunList
        v-model:selected="selected"
        :nav="nav"
        :sub="sub"
        :dense="dense"
        :selectable="selectable"
        :selection-mode="selectionMode"
        :font-size="fontSize"
      >
        <KunListItem value="ada" title="Ada Lovelace" subtitle="Ingeniera" selectable />
        <KunListItem value="grace" title="Grace Hopper" subtitle="Almirante" selectable />
        <KunListItem value="alan" title="Alan Turing" subtitle="Matemático" selectable />
        <KunListItem value="dijkstra" title="Edsger Dijkstra" subtitle="Informático" selectable />
      </KunList>

      <div class="rounded-lg bg-muted p-3 font-mono text-sm">
        <div class="text-muted text-xs mb-1">v-model:selected en crudo</div>
        <div>{{ JSON.stringify(selected) }}</div>
      </div>
    </div>

    <!-- Panel de configuración (scroll propio) -->
    <div class="space-y-4 rounded-lg border border-default p-4 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto">
      <h3 class="text-sm font-semibold uppercase tracking-wide text-muted">Configuración</h3>

      <div class="grid grid-cols-2 gap-3 [&>*]:min-w-0">
        <KunSwitch v-model="nav" label="Nav" />
        <KunSwitch v-model="sub" label="Sub" />
        <KunSwitch v-model="dense" label="Dense" />
        <KunSwitch v-model="selectable" label="Selectable" />
        <KunSelect
          v-model="selectionMode"
          v-model:items="selectionModeOptions"
          label="Selection mode"
          item-value="id"
          item-title="name"
          density="compact"
          class="col-span-2"
        />
        <KunTextField v-model="fontSize" label="Font size" density="compact" />
      </div>
    </div>
  </div>
</template>
