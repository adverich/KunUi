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
            default: 'bg-appbar'
        },
        variant:{
            type: String,
            default: 'elevated'
        },
        height: {
            type: [Number, String],
            default: 'h-fit', // Valor por defecto de la altura en píxeles
        },
        width: {
            type: [Number, String],
            default: 'w-full', // Valor por defecto del ancho
        },
        classBase: {
            type: String,
            default: 'text-center rounded-t-lg'
        }
    },
};
</script>

<template>
    <slot name="default">
        <div :class="[classBase, variant, height, width, bgColor]">
            <div v-if="title" class="flex flex-row uppercase w-full py-2">
                <slot name="prepend-title" />
                <span class="w-full">
                    {{ title }}
                </span>
                <slot name="append-title" />
            </div>
            <span v-if="subtitle"> {{ subtitle }} </span>
            <span v-if="text"> {{ text }} </span>
        </div>
    </slot>
</template>