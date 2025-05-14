<template>
    <div class="h-svh top-0 left-0 bg-grey-900 w-full overflow-y-auto opacity-90" style="position:fixed; z-index: 2500;">
        <div class="rounded-lg px-16 py-14">
            <div class="flex justify-center py-4">
                <div class="rounded-full bg-red-200 p-6">
                    <KunIcon icon="exclamation" size="text-9xl"/>
                </div>
            </div>

            <div class="text-center flex flex-col justify-center items-center bg-red-500 rounded-lg p-4">
                <div v-if="title" class="my-4 text-center text-3xl font-semibold"> {{ title }} </div>
                <div class="text-xl font-normal"> {{ message }} </div>
            </div>

        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    title:{
        type: String,
        default: 'Congratulation !!'
    },
    message:{
        type: String,
        default: 'Your order have been taken and is being attended to'
    }
})

const emits = defineEmits(['update:modelValue']);

</script>