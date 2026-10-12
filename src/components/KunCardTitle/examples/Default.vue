<script setup lang="ts">
import { ref } from 'vue'
import KunCardTitle from '../src/components/KunCardTitle.vue'
import KunSwitch from '../../KunSwitch/src/components/KunSwitch.vue'
import KunSelect from '../../KunSelect/src/components/KunSelect.vue'
import KunTextField from '../../KunTextField/src/components/KunTextField.vue'

const title = ref('Título principal')
const titleSize = ref('text-lg')
const subtitle = ref('Subtítulo descriptivo')
const prepend = ref('')
const append = ref('')
const bgColor = ref('bg-transparent')
const textColor = ref('text-ui')
const height = ref('auto')
const width = ref('full')
const dense = ref(false)
const flat = ref(false)

const rounded = ref<boolean | 'sm' | 'md' | 'lg' | 'xl'>(false)
const roundedOptions = ref([
  { id: false, name: 'false' },
  { id: true, name: 'true' },
  { id: 'sm', name: 'sm' },
  { id: 'md', name: 'md' },
  { id: 'lg', name: 'lg' },
  { id: 'xl', name: 'xl' },
])
</script>

<template>
  <div class="p-4 grid gap-6 lg:grid-cols-2 lg:items-start">
    <!-- Vista previa (fija: siempre visible al scrollear opciones) -->
    <div class="space-y-3 min-w-0 lg:sticky lg:top-4">
      <h2 class="text-lg font-semibold">KunCardTitle</h2>

      <p class="text-xs uppercase tracking-wide text-ui-muted">Vía props</p>
      <KunCardTitle
        :title="title || null"
        :title-size="titleSize || null"
        :subtitle="subtitle || null"
        :prepend="prepend || undefined"
        :append="append || undefined"
        :bg-color="bgColor"
        :text-color="textColor"
        :dense="dense"
        :flat="flat"
        :rounded="rounded"
        :height="height"
        :width="width"
      />

      <p class="text-xs uppercase tracking-wide text-ui-muted">Vía slots</p>
      <KunCardTitle
        :title-size="titleSize || null"
        :prepend="prepend || undefined"
        :append="append || undefined"
        :bg-color="bgColor"
        :text-color="textColor"
        :dense="dense"
        :flat="flat"
        :rounded="rounded"
        :height="height"
        :width="width"
      >
        {{ title }}
        <template #subtitle>{{ subtitle }}</template>
      </KunCardTitle>
    </div>

    <!-- Panel de configuración (scroll propio) -->
    <div class="space-y-4 rounded-xl border border-ui p-4 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto">
      <h3 class="text-sm font-semibold uppercase tracking-wide text-ui-muted">Configuración</h3>

      <div class="grid grid-cols-2 gap-3 [&>*]:min-w-0">
        <KunTextField v-model="title" label="Title" density="compact" />
        <KunTextField v-model="titleSize" label="Title size (vacío = hereda)" density="compact" />
        <KunTextField v-model="subtitle" label="Subtitle" density="compact" />
        <KunTextField v-model="prepend" label="Prepend (vacío = oculto)" density="compact" />
        <KunTextField v-model="append" label="Append (vacío = oculto)" density="compact" />
        <KunTextField v-model="bgColor" label="Background color" density="compact" />
        <KunTextField v-model="textColor" label="Text color" density="compact" />
        <KunTextField v-model="height" label="Height" density="compact" />
        <KunTextField v-model="width" label="Width" density="compact" />
        <KunSelect
          v-model="rounded"
          v-model:items="roundedOptions"
          label="Rounded"
          item-value="id"
          item-title="name"
          density="compact"
        />
        <KunSwitch v-model="dense" label="Dense" />
        <KunSwitch v-model="flat" label="Flat" />
      </div>
    </div>
  </div>
</template>
