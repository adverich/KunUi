<template>
  <div class="p-4 max-w-md">
    <h2 class="text-lg font-semibold mb-2">Lista con Subheaders:</h2>

    <ul class="space-y-2 bg-white dark:bg-gray-800 rounded-md shadow-sm p-2">
      <KunListSubheader text="Usuarios" />

      <KunListItem>Juan Pérez</KunListItem>
      <KunListItem>Ana Gómez</KunListItem>

      <KunListSubheader text="Configuraciones" class="text-blue-600 dark:text-blue-400" />

      <KunListItem>Perfil</KunListItem>
      <KunListItem>Notificaciones</KunListItem>
    </ul>
  </div>
</template>

<script setup>
import KunListSubheader from '../src/components/KunListSubheader.vue'
import KunListItem from '../../../../KunListItem/src/components/KunListItem.vue'
</script>