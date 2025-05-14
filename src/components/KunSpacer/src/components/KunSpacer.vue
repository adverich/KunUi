<script>
export default {
    props: {
        height: {
            type: [Number, String],
            default: '100%', // Valor por defecto de la altura en píxeles
        },
        width: {
            type: [Number, String],
            default: '100%', // Valor por defecto del ancho
        },
    },
};
</script>

<template>
    <div :style="{ height: height, width: width }"></div>
</template>