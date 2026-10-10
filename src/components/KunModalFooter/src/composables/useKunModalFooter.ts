import { ref, type Ref } from "vue";

export interface ModalMessage {
    id: number | string;
    text: string;
    color: string;
    modelValue: boolean;
}

export function useKunModalFooter() {
    const useMessages: Ref<ModalMessage[]> = ref([]);

    function useAddMessage(
        text: string,
        baseId: number | string | null | undefined,
        color = "blue",
        duration = 5000,
        onRemove?: (id: number | string) => void,
    ): void {
        if (useMessages.value.some((i: ModalMessage) => i.id === baseId)) return;

        const id = baseId ?? Date.now();
        const newMessage: ModalMessage = { id, text, color, modelValue: true };
        useMessages.value.push(newMessage);

        setTimeout(() => {
            removeMessage(id);
            if (onRemove) onRemove(id); // <-- ACA llamamos callback
        }, duration);
    }

    function removeMessage(id: number | string): void {
        useMessages.value = useMessages.value.filter((msg: ModalMessage) => msg.id !== id);
    }

    return { useMessages, useAddMessage };
}
