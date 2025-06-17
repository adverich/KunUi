import { ref } from "vue";

export function useKunModalFooter() {
    const useMessages = ref([]);

    function useAddMessage(text, baseId, color = "blue", duration = 5000, onRemove) {
        if (useMessages.value.some((i) => i.id === baseId)) return;

        const id = baseId ?? Date.now();
        const newMessage = { id, text, color, modelValue: true };
        useMessages.value.push(newMessage);

        setTimeout(() => {
            removeMessage(id);
            if (onRemove) onRemove(id); // <-- ACA llamamos callback
        }, duration);
    }

    function removeMessage(id) {
        useMessages.value = useMessages.value.filter((msg) => msg.id !== id);
    }

    return { useMessages, useAddMessage };
}
