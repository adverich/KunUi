<template>
    <button 
        type="button" 
        class="flex justify-center items-center transition-all duration-200"
        :class="[customClass, disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2']"
        :aria-label="ariaLabel"
        :disabled="disabled"
    >
        <slot>{{ text }}</slot>
    </button>
</template>

<script setup>
const props = defineProps({
    text: {
        type: String,
        default: null
    },
    class: {
        type: String,
        default: 'px-4 py-2 text-sm font-medium bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:ring-blue-300'
    },
    ariaLabel: {
        type: String,
        default: null
    },
    disabled: {
        type: Boolean,
        default: false
    }
});

// Combina las clases personalizadas
const customClass = computed(() => props.class);
</script>