<template>
    <div
        v-if="modelValue"
        :class="[
            isFixed ? 'fixed' : '',
            'z-[9999] rounded-md shadow-lg p-2 transition-all duration-300',
            widthClass,
            heightClass,
            colorClass
        ]"
        v-bind="$attrs"
    >
        <div class="flex items-center justify-between">
            <p class="text-sm font-medium">{{ message }}</p>
            <button
                type="button"
                class="ml-2 inline-flex rounded-md p-1 hover:bg-opacity-75 focus:outline-none"
                @click="closeMessage"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fill-rule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clip-rule="evenodd"
                    />
                </svg>
            </button>
        </div>
    </div>
</template>

<script setup>
import { computed } from "vue";
const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true,
    },
    id: {
        type: Number,
    },
    message: {
        type: String,
        default: "Mensaje predeterminado",
    },
    color: {
        type: String,
        default: "green", // Valores posibles: blue, green, red, yellow, gray
    },
    width: {
        type: String,
        default: "300px", // Ancho personalizable
    },
    height: {
        type: String,
        default: "auto", // Altura personalizable
    },
    isFixed: {
        type: Boolean,
        default: false, // Por defecto, no es fijo
    },
});
const emit = defineEmits(["update:modelValue", "removeMessage"]);

function closeMessage() {
    emit("removeMessage", props.message.id);
    emit("update:modelValue", false);
}

// Clase para el ancho
const widthClass = computed(() => {
  return props.width ? `w-[${props.width}]` : "max-w-[300px]"; // Ancho máximo predeterminado
});

// Clase para la altura
const heightClass = computed(() => {
    return props.height === "auto" ? "" : `h-[${props.height}]`;
});

// Clase para el color
const colorClass = computed(() => {
    const colors = {
        blue: "bg-blue-300 dark:bg-blue-700",
        green: "bg-green-300 dark:bg-green-700",
        red: "bg-red-300 dark:bg-red-700",
        yellow: "bg-yellow-300 dark:bg-yellow-700",
        gray: "bg-gray-300 dark:bg-gray-700",
        orange: "bg-amber-300 dark:bg-amber-700",
    };
    return colors[props.color] || "bg-blue-700";
});
</script>