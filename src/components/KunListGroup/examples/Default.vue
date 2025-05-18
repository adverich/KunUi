<template>
  <div class="p-4 max-w-md">
    <h2 class="text-lg font-semibold mb-2">Grupos de Lista:</h2>

    <ul class="space-y-2">
      <KunListGroup title="Usuarios">
        <template #activator>
          <span>Usuarios del sistema</span>
        </template>
        <KunListItem>Admin</KunListItem>
        <KunListItem>Editor</KunListItem>
        <KunListItem>Lector</KunListItem>
      </KunListGroup>

      <KunListGroup title="Configuración" open>
        <KunListItem>Perfil</KunListItem>
        <KunListItem>Notificaciones</KunListItem>
      </KunListGroup>
    </ul>
  </div>
</template>

<script setup>
import KunListGroup from '../src/components/KunListGroup.vue'
import KunListItem from '../../../../KunListItem/src/components/KunListItem.vue'
</script>