<template>
    <div class="p-4 space-y-6">
        <h3>Ejemplo básico de KunCardItem</h3>

        <KunCardItem dense class="bg-gray-100 rounded-lg">
            <KunCardTitle title="Título Principal" subtitle="Subtítulo descriptivo" />
        </KunCardItem>

        <h3>Ejemplo con múltiples elementos</h3>

        <KunCardItem gap="gap-2">
            <KunCardTitle title="Título con más detalles" />
            <KunCardSubtitle subtitle="Este es un subtítulo adicional." />
            <KunCardText text="Aquí va el contenido textual dentro del item." />
        </KunCardItem>
    </div>
</template>

<script setup>
import KunCardItem from '../src/KunCardItem.vue'
import KunCardTitle from '../../../KunCardTitle/src/KunCardTitle.vue'
import KunCardSubtitle from '../../../KunCardSubtitle/src/KunCardSubtitle.vue'
import KunCardText from '../../../KunCardText/src/KunCardText.vue'
</script>