<script setup lang="ts">
import { ref } from 'vue'
import KunList from '../../KunList/src/components/KunList.vue'
import KunListGroup from '../src/components/KunListGroup.vue'
import KunListItem from '../../KunListItem/src/components/KunListItem.vue'
import KunSwitch from '../../KunSwitch/src/components/KunSwitch.vue'
import KunTextField from '../../KunTextField/src/components/KunTextField.vue'

// ------------------------------------------------------------------
// Controles del playground (grupo principal)
// ------------------------------------------------------------------
const open = ref(false)
const idRaw = ref('')
const title = ref('Equipo')
const expandIcon = ref('$menuUpOutline')
const collapseIcon = ref('$menuDownOutline')
const disabled = ref(false)

// Segundo grupo (siempre visible para mostrar el funcionamiento)
const openPermisos = ref(true)
</script>

<template>
  <div class="p-4 grid gap-6 lg:grid-cols-2 lg:items-start">
    <!-- Vista previa (fija: siempre visible al scrollear opciones) -->
    <div class="space-y-3 min-w-0 lg:sticky lg:top-4">
      <h2 class="text-lg font-semibold">KunListGroup</h2>

      <div class="rounded-lg bg-surface p-3">
        <KunList selectable selection-mode="multiple">
          <!-- Grupo principal (configurable desde el panel) -->
          <KunListGroup
            :model-value="open"
            :id="idRaw || null"
            :title="title"
            :expand-icon="expandIcon || undefined"
            :collapse-icon="collapseIcon || undefined"
            :disabled="disabled"
            @update:model-value="open = $event"
          >
            <KunListItem value="admin" title="Admin" subtitle="Acceso total" prepend-icon="$accountOutline" selectable />
            <KunListItem value="editor" title="Editor" subtitle="Edita contenido" prepend-icon="$pencil" selectable />
            <KunListItem value="lector" title="Lector" subtitle="Solo lectura" prepend-icon="$eyeOutline" selectable />
          </KunListGroup>

          <!-- Segundo grupo: permisos con iconos de append -->
          <KunListGroup
            v-model="openPermisos"
            title="Permisos"
          >
            <KunListItem value="leer" title="Leer" prepend-icon="$eyeOutline" append-icon="$check" selectable />
            <KunListItem value="escribir" title="Escribir" prepend-icon="$pencil" append-icon="$check" selectable />
            <KunListItem value="borrar" title="Borrar" prepend-icon="$trashOutline" append-icon="$close" selectable />
          </KunListGroup>

          <!-- Ítem suelto fuera de grupos -->
          <KunListItem value="ayuda" title="Ayuda" subtitle="Centro de soporte" prepend-icon="$info" />
        </KunList>
      </div>

      <div class="rounded-lg bg-surface p-3 font-mono text-sm">
        <div class="text-ui-muted text-xs mb-1">model-value en crudo</div>
        <div>Equipo: {{ JSON.stringify(open) }} · Permisos: {{ JSON.stringify(openPermisos) }}</div>
      </div>
    </div>

    <!-- Panel de configuración (scroll propio) -->
    <div class="space-y-4 rounded-xl border border-ui p-4 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto">
      <h3 class="text-sm font-semibold uppercase tracking-wide text-ui-muted">Configuración</h3>

      <div class="grid grid-cols-2 gap-3 [&>*]:min-w-0">
        <KunSwitch v-model="open" label="Equipo abierto" :disabled="disabled" />
        <KunSwitch v-model="openPermisos" label="Permisos abierto" />
        <KunSwitch v-model="disabled" label="Disabled (Equipo)" />
        <KunTextField v-model="idRaw" label="Id (vacío = auto)" density="compact" />
        <KunTextField v-model="title" label="Title" density="compact" />
        <KunTextField v-model="expandIcon" label="Expand icon" density="compact" />
        <KunTextField v-model="collapseIcon" label="Collapse icon" density="compact" />
      </div>
    </div>
  </div>
</template>
