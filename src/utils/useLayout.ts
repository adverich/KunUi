import { ref, type Ref } from 'vue'

const appbarHeight: Ref<number> = ref(0)

export function setAppbarHeight(value: number): void {
    appbarHeight.value = value;
}

export function useAppbarHeight(): Ref<number> {
    return appbarHeight;
}
