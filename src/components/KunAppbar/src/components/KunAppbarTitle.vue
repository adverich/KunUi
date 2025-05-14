<template>
    <div class="min-w-max flex flex-row items-center" :class="textSize, fontWeight">
        {{ title }}
    </div>
</template>

<script setup>
const props = defineProps({
    title: {
        type: String,
        default: ''
    },
    textSize:{
        type: String,
        default: 'text-sm'
    },
    fontWeight:{
        type: String,
        default: 'font-medium'
    }
})

// font-mono
// font-sans
// font-serif

</script>
