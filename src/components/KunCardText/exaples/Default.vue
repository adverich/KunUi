<template>
    <div class="p-4 space-y-4">
        <h3>Ejemplo básico de KunCardText</h3>

        <KunCardText text="Este es un texto estándar dentro de una tarjeta." color="text-gray-800" class="mb-2" />

        <h3>Ejemplo con slot personalizado</h3>

        <KunCardText class="text-blue-700">
            Este contenido se pasa a través del slot por defecto.
        </KunCardText>
    </div>
</template>

<script setup>
import KunCardText from '../src/KunCardText.vue'
</script>