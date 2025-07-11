<template>
    <div class="p-4 space-y-4">
        <h3>Ejemplo básico de KunCardTitle</h3>

        <KunCardTitle title="Título Principal" subtitle="Este es un subtítulo descriptivo" bg-color="bg-blue-100"
            text-color="text-blue-900" rounded="md" :prepend="'$mdi-account-circle'" :append="'$mdi-dots-vertical'" />

        <h3>Ejemplo con slot personalizado</h3>

        <KunCardTitle bg-color="bg-green-100" rounded dense>
            <strong>Contenido customizado</strong> desde el slot
            <template #prepend>
                <KunIcon icon="$mdi-information" />
            </template>
        </KunCardTitle>
    </div>
</template>

<script setup>
import KunCardTitle from '../src/components/KunCardTitle.vue'
</script>