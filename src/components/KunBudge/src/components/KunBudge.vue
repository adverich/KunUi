<script>
export default {
    props: {
        text:{
            type: String,
            default: ''
        },
        bgColor: {
            type: String,
            default: 'bg-button',
        },

        textColor: {
            type: String,
            default: 'text-on-color',
        },
        textSize:{
            type: String,
            default: 'text-xs'
        },
        fontWeight:{
            type: String,
            default: 'font-medium'
        },
        rounded:{
            type: String,
            default: 'rounded-2xl'
        },
        cursor:{
            type: String,
            default: 'cursor-default'
        }
    },
};
</script>

<template>
    <div class="flex px-2.5 py-1.5" :class="[bgColor, textColor, textSize, fontWeight, rounded, cursor]">
        {{ text }}
    </div>
</template>