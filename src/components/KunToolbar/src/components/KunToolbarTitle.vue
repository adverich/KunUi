<template>
    <p class="text-xl w-fit text-nowrap">
        {{ title }} 
    </p>
</template>

<script setup>
const props = defineProps({
    title: {
        type: String,
        default: ''
    },
})
</script>
