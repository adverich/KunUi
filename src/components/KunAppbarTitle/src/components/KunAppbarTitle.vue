<template>
  <div class="flex items-center min-w-0 truncate" :class="[textSize, fontWeight]" v-bind="$attrs">
    <img v-if="titleImage" :src="titleImage" alt="Logo" class="object-contain" :class="titleImageSize" />
    <span v-else>{{ title }}</span>
  </div>
</template>

<script setup>
import { kunAppbarTitleProps } from '../composables/kunAppbarTitleProps'

const props = defineProps(kunAppbarTitleProps)
</script>
