<script>
export default {
    props: {
        title:{
            type: String,
        },
        subtitle:{
            type: String,
        },
        text:{
            type: String,
        },

        bgColor:{
            type: String,
            default: 'bg-surface'
        },
        rounded:{
            type: [String | Number | Boolean],
            default: undefined
        },
        variant:{
            type: String,
            default: 'elevated'
        },
        height: {
            type: [Number, String],
            default: 'h-full', // Valor por defecto de la altura en píxeles
        },
        width: {
            type: [Number, String],
            default: 'w-full', // Valor por defecto del ancho
        },

        to:{
            type: String,
            default: undefined
        }
    },
};
</script>

<template>
    <div class="flex flex-col" :class="[rounded, variant, height, width, bgColor]" :to="to">
        <slot name="default" />
    </div>
</template>