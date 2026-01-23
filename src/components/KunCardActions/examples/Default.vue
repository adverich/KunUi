<template>
    <div class="p-4 space-y-4">
        <h3>Ejemplo básico de KunCardActions</h3>

        <KunCardActions justify="justify-between" align="items-center" class="bg-gray-100 rounded-lg">
            <KunBtn text="Cancelar" variant="outline" color="text-red-600" />
            <KunBtn text="Guardar" color="bg-blue-600 text-white" />
        </KunCardActions>

        <h3>Ejemplo con wrap y acciones múltiples</h3>

        <KunCardActions gap="gap-3" wrap dense class="bg-gray-50">
            <KunBtn text="Editar" icon="$mdi-pencil" size="sm" />
            <KunBtn text="Eliminar" icon="$mdi-delete" size="sm" />
            <KunBtn text="Compartir" icon="$mdi-share" size="sm" />
        </KunCardActions>
    </div>
</template>

<script setup>
import KunCardActions from '../src/components/KunCardActions.vue'
import KunBtn from '../../KunBtn/src/components/KunBtn.vue'
</script>