<template>
    <button type="button" class="flex justify-center align-center items-center" 
        :class="[width, buttonSize(size), textColor, fontWeight, bgColor, bgColorHover, bgColorFocus, focusRing, focusOutline, 
        focusRingColor, rounded, textAlign,
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2']"
        :disabled="disabled"
    > 
        <slot>
            {{ text }}
        </slot>
    </button>
</template>

<script setup>

const props = defineProps({
    size: {
        type: String,
        default: 'md'
    },
    width: {
        type: String,
        default: 'w-24'
    },
    textColor:{
        type: String,
        default: 'text-white'
    },
    text:{
        type: String,
        default: null
    },
    fontWeight:{
        type: String,
        default: 'font-medium'
    },
    bgColor:{
        type: String,
        default: 'bg-button'
    },
    bgColorHover: {
        type: String,
        default: 'hover:opacity-90'
    },
    bgColorFocus: {
        type: String,
        default: 'focus:opacity-100'
    },
    focusRing: {
        type: String,
        default: 'focus:ring-1'
    },
    focusOutline: {
        type: String,
        default: 'focus:outline-none'
    },
    focusRingColor: {
        type: String,
        default: 'focus:ring-blue-300'
    },
    rounded: {
        type: String,
        default: 'rounded-lg'
    },
    textAlign: {
        type: String,
        default: 'text-center'
    },
    disabled: {
        type: Boolean,
        default: false
    }
})

const xxs = 'px-1 py-1 text-xs';
const xs = 'px-2 py-2 text-xs';
const sm = 'px-1 py-1 text-sm';
const md = 'px-2 py-2 text-sm';
const lg = 'px-3 py-3 text-sm';
const xl = 'px-3 py-3 text-base';
const xxl = 'px-4 py-4 text-base';

const buttonSize = (size) => {
    switch (size) {
        case "xs":
            return xs;

        case "sm":
            return sm;

        case "md":
            return md;

        case "lg":
            return lg;

        case "xl":
            return xl;
    }
};
</script>