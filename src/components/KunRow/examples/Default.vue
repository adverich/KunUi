<script setup lang="ts">
import { ref, computed } from 'vue'
import KunRow from '../src/components/KunRow.vue'
import KunCol from '../../KunCol/src/components/KunCol.vue'
import KunSelect from '../../KunSelect/src/components/KunSelect.vue'
import KunSwitch from '../../KunSwitch/src/components/KunSwitch.vue'
import KunTextField from '../../KunTextField/src/components/KunTextField.vue'

// KunRow.vue declara estos tipos inline en su defineProps (no los exporta)
type KunRowAlign = 'start' | 'center' | 'end' | 'stretch'
type KunRowJustify = 'start' | 'center' | 'end' | 'space-between' | 'space-around'

const align = ref<KunRowAlign>('center')
const alignOptions = ref([
  { id: 'start', name: 'start' },
  { id: 'center', name: 'center' },
  { id: 'end', name: 'end' },
  { id: 'stretch', name: 'stretch' },
])

const justify = ref<KunRowJustify>('space-around')
const justifyOptions = ref([
  { id: 'start', name: 'start' },
  { id: 'center', name: 'center' },
  { id: 'end', name: 'end' },
  { id: 'space-between', name: 'space-between' },
  { id: 'space-around', name: 'space-around' },
])

const noGutters = ref(false)
const dense = ref(true)
const colsRaw = ref('')
const colsProp = computed(() => (colsRaw.value === '' ? undefined : Number(colsRaw.value)))
</script>

<template>
  <div class="p-4 grid gap-6 lg:grid-cols-2 lg:items-start">
    <!-- Vista previa (fija: siempre visible al scrollear opciones) -->
    <div class="space-y-3 min-w-0 lg:sticky lg:top-4">
      <h2 class="text-lg font-semibold">KunRow</h2>

      <div class="rounded-xl border border-ui p-3">
        <KunRow :align="align" :justify="justify" :no-gutters="noGutters" :dense="dense" :cols="colsProp">
          <KunCol :cols="3">
            <div class="flex h-10 items-center justify-center rounded bg-primary/20 border border-primary text-sm font-medium">A</div>
          </KunCol>
          <KunCol :cols="3">
            <div class="flex h-20 items-center justify-center rounded bg-success/20 border border-success text-sm font-medium">B</div>
          </KunCol>
          <KunCol :cols="3">
            <div class="flex h-14 items-center justify-center rounded bg-warning/20 border border-warning text-sm font-medium">C</div>
          </KunCol>
        </KunRow>
      </div>

      <p class="font-mono text-xs text-ui-muted">
        align={{ align }} justify={{ justify }} cols={{ colsRaw || '12' }}
      </p>
    </div>

    <!-- Panel de configuración (scroll propio) -->
    <div class="space-y-4 rounded-xl border border-ui p-4 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto">
      <h3 class="text-sm font-semibold uppercase tracking-wide text-ui-muted">Configuración</h3>

      <div class="grid grid-cols-2 gap-3 [&>*]:min-w-0">
        <KunSelect
          v-model="align"
          v-model:items="alignOptions"
          label="Align"
          item-value="id"
          item-title="name"
          density="compact"
        />
        <KunSelect
          v-model="justify"
          v-model:items="justifyOptions"
          label="Justify"
          item-value="id"
          item-title="name"
          density="compact"
        />
        <KunTextField v-model="colsRaw" label="Cols (vacío = 12)" density="compact" inputmode="numeric" />
        <div class="contents">
          <KunSwitch v-model="noGutters" label="No gutters" />
          <KunSwitch v-model="dense" label="Dense" />
        </div>

        <p class="col-span-2 text-xs text-ui-muted">
          Las celdas usan 9 de 12 columnas (para que justify se note) con alturas distintas (para que align se note).
        </p>
      </div>
    </div>
  </div>
</template>
