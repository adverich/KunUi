<template>
    <div class="flex py-1 px-2 h-14 items-center" :class="[bgColor]">
        <!-- Espacio a la izquierda -->
        <div class="flex-1">
            <div class="flex items-center">
                <slot name="appbarButton"></slot>
                <slot name="prepend"></slot>
            </div>
        </div>

            <!-- Contenido del slot principal -->
            <!-- <slot></slot> -->

        <!-- Título centrado -->
        <KunAppbarTitle v-if="title" :title="title" />

        <!-- Espacio a la derecha -->
        <div class="flex-1">
            <div class="w-full flex justify-end">
                <slot name="append"></slot>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    density: {
        type: String,
        default: ''
    },
    bgColor: {
        type: String,
        default: 'bg-appbar'
    },
    title: {
        type: String,
        default: ''
    },
})
</script>
