<template>
  <div class="p-6 space-y-6">
    <h2 class="text-2xl font-bold">Ejemplo básico de KunCard</h2>

    <KunCard
      title="Título del Card"
      subtitle="Subtítulo opcional"
      text="Este es el contenido principal del KunCard. Puede incluir texto, componentes o slots personalizados."
      :to="'/KunList'"
      bgColor="bg-white"
      textColor="text-gray-800"
      outlined
      outlineColor="border-gray-300"
      rounded="md"
      elevation="md"
    >
      <template #actions>
        <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Acción
        </button>
      </template>
    </KunCard>
  </div>
</template>

<script setup>
import KunCard from '../src/components/KunCard.vue';
</script>
