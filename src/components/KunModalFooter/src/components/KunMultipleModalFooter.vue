<template>
    <div :class="containerClasses">
        <KunModalFooter
            v-for="msg in useMessages"
            :key="msg.id"
            v-model="msg.modelValue"
            :message="msg.text"
            :color="msg.color"
            :id="msg.id"
            :width="width"
            :height="height"
            :isFixed="false"
            @removeMessage="removeMessage"
        />
    </div>
  </template>

<script setup>
import { watch, computed } from "vue";
import KunModalFooter from "./KunModalFooter.vue";
import { useKunModalFooter } from "../composables/useKunModalFooter";
const { useMessages, useAddMessage } = useKunModalFooter();

const props = defineProps({
messages: {
    type: Array,
    default: () => [],
},
position: {
    type: String,
    default: "bottom-right",
},
stackDirection: {
    type: String,
    default: "bottom-to-top", // bottom-to-top, top-to-bottom
},
width: {
    type: String,
    default: "300px",
},
height: {
    type: String,
    default: "auto",
},
});
const emit = defineEmits(["update:messages", "removeMessage"]);

// Observa cambios externos en los mensajes
watch(() => props.messages, (newMessages) => {
    newMessages.forEach(msg => {
        useAddMessage(msg.text, msg.id, msg.color, 5000,
          (id) => {
            emitUpdatedMessages(id); // <-- callback para actualizar padre
          }
        );
    });
}, { deep: true });

function emitUpdatedMessages(id) {
    useMessages.value = useMessages.value.filter(msg => msg.id !== id);
    emit("update:messages", useMessages.value.map(msg => ({
        id: msg.id,
        text: msg.text,
        color: msg.color,
    })));
}

// Elimina un mensaje
function removeMessage(id) {
    const index = useMessages.value.findIndex((msg) => msg.id === id);
    if (index !== -1) {
        useMessages.value.splice(index, 1);
        // Emitir nuevo array limpio
        emit("update:messages", useMessages.value.map(msg => ({
            id: msg.id,
            text: msg.text,
            color: msg.color,
        })));
    }
}

// Clases dinámicas para el contenedor
const containerClasses = computed(() => {
const positions = {
    "bottom-left": "bottom-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-center": "bottom-4 left-1/2 transform -translate-x-1/2",
    "top-left": "top-4 left-4",
    "top-right": "top-4 right-4",
    "top-center": "top-4 left-1/2 transform -translate-x-1/2",
};

const direction = props.stackDirection === "bottom-to-top" ? "flex-col-reverse" : "flex-col";

return [
    "fixed z-[9999]", // Posicionamiento fijo y z-index alto
    positions[props.position] || "bottom-4 right-4", // Posición predeterminada
    "flex", // Contenedor flexbox
    direction, // Dirección del apilamiento
    "gap-3", // Espacio entre los mensajes
];
});
</script>