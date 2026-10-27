<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import KunList from '../src/components/KunList.vue'
import KunListItem from '../../KunListItem/src/components/KunListItem.vue'
import type { KunListSelectionMode } from '../src/composables/kunListProps.js'
import { KUN_COLORS, KUN_VARIANTS, type KunColor, type KunVariant } from '../../../theme/kunVariants.js'
import KunSelect from '../../KunSelect/src/components/KunSelect.vue'
import KunSwitch from '../../KunSwitch/src/components/KunSwitch.vue'
import KunTextField from '../../KunTextField/src/components/KunTextField.vue'

// ------------------------------------------------------------------
// Selección (v-model:selected, espejo de defineModel('selected'))
// ------------------------------------------------------------------
const selected = ref<unknown>([])

// ------------------------------------------------------------------
// Controles de la lista (se aplican a TODOS los items por igual)
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

// Color semántico del contenedor ('' = default del tema)
const colorRaw = ref('')
const colorOptions = ref([{ id: '', name: '(default del tema)' }, ...KUN_COLORS.map(c => ({ id: c, name: c }))])
const listColor = computed<KunColor | null>(() => (colorRaw.value === '' ? null : (colorRaw.value as KunColor)))

// Variante del contenedor ('' = default del tema)
const variantRaw = ref('')
const variantOptions = ref([{ id: '', name: '(default del tema)' }, ...KUN_VARIANTS.map(v => ({ id: v, name: v }))])
const listVariant = computed<KunVariant | null>(() => (variantRaw.value === '' ? null : (variantRaw.value as KunVariant)))

// Clase Tailwind libre de fondo (gana sobre color/variant)
const bgRaw = ref('')
const listBg = computed(() => (bgRaw.value.trim() === '' ? undefined : bgRaw.value))

// Overrides de los items ('' = heredan de la lista)
const itemColorRaw = ref('')
const itemColorOptions = ref([{ id: '', name: '(heredar de la lista)' }, ...KUN_COLORS.map(c => ({ id: c, name: c }))])
const itemColor = computed<KunColor | null | undefined>(() => (itemColorRaw.value === '' ? undefined : (itemColorRaw.value as KunColor)))

const itemVariantRaw = ref('')
const itemVariantOptions = ref([{ id: '', name: '(default: ghost)' }, ...KUN_VARIANTS.map(v => ({ id: v, name: v }))])
const itemVariant = computed(() => (itemVariantRaw.value === '' ? undefined : (itemVariantRaw.value as KunVariant)))
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
        :color="listColor"
        :variant="listVariant"
        :bg="listBg"
      >
        <!-- Los 3 items comparten exactamente las mismas propiedades:
             reaccionan en vivo a hover, selección,.disabled, etc. -->
        <KunListItem
          v-for="person in ['ada', 'grace', 'alan']"
          :key="person"
          :value="person"
          title="Elemento demo"
          subtitle="Subtítulo demo"
          :selectable="selectable"
          :color="itemColor"
          :variant="itemVariant"
        />
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
        <p class="col-span-2 pt-2 text-xs font-semibold uppercase tracking-wide text-muted">Contenedor</p>
        <KunSelect
          v-model="colorRaw"
          v-model:items="colorOptions"
          label="Color"
          item-value="id"
          item-title="name"
          density="compact"
        />
        <KunSelect
          v-model="variantRaw"
          v-model:items="variantOptions"
          label="Variant"
          item-value="id"
          item-title="name"
          density="compact"
        />
        <KunTextField
          v-model="bgRaw"
          label="BG libre (clase Tailwind)"
          density="compact"
          class="col-span-2"
          placeholder="bg-sky-900/60"
        />

        <p class="col-span-2 pt-2 text-xs font-semibold uppercase tracking-wide text-muted">Items (se aplican a los 3)</p>
        <KunSelect
          v-model="itemColorRaw"
          v-model:items="itemColorOptions"
          label="Color del item"
          item-value="id"
          item-title="name"
          density="compact"
        />
        <KunSelect
          v-model="itemVariantRaw"
          v-model:items="itemVariantOptions"
          label="Variant del item"
          item-value="id"
          item-title="name"
          density="compact"
        />

        <p class="col-span-2 pt-2 text-xs font-semibold uppercase tracking-wide text-muted">Estado</p>
        <KunSwitch v-model="nav" label="Nav" />
        <KunSwitch v-model="sub" label="Sub" />
        <KunSwitch v-model="dense" label="Dense" />
        <KunSwitch v-model="selectable" label="Selectable" />
      </div>
    </div>
  </div>
</template>
