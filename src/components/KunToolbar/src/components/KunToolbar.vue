<template>
    <div class="h-10 flex flex-row items-center py-2 px-2" v-bind="$attrs">
        <KunToolbarTitle v-if="title" :title="title" />
        <slot :density="density"></slot>
    </div>
</template>

<script setup>
const props = defineProps({
    density: {
        type: String,
        default: ''
    },
    title: {
        type: String,
        default: ''
    },
})
</script>
