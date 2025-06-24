import { ref } from 'vue'

const appbarHeight = ref(0)

export function setAppbarHeight(value) {
    appbarHeight.value = value;
}

export function useAppbarHeight() {
    return appbarHeight;;
}
