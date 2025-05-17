<template>
    <div class="p-4 space-y-4">
        <h3>Ejemplo básico de KunCardSubtitle</h3>

        <KunCardSubtitle subtitle="Este es un subtítulo estándar" color="text-blue-600" class="mb-2" />

        <h3>Ejemplo con slot personalizado</h3>

        <KunCardSubtitle class="text-green-700">
            Subtítulo renderizado desde el slot.
        </KunCardSubtitle>
    </div>
</template>

<script setup>
import KunCardSubtitle from '../src/KunCardSubtitle.vue'
</script>