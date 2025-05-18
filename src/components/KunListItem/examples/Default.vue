<template>
  <div class="p-4 max-w-md">
    <h2 class="text-lg font-semibold mb-2">Lista básica:</h2>
    <ul class="space-y-1">
      <KunListItem>Elemento 1</KunListItem>
      <KunListItem active active-class="bg-green-100 text-green-600">Elemento activo</KunListItem>
      <KunListItem disabled>Elemento deshabilitado</KunListItem>
    </ul>
  </div>
</template>

<script setup>
import KunListItem from '../src/components/KunListItem.vue'
</script>