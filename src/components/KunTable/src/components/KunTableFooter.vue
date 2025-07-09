<script setup>
import { computed } from 'vue';

const props = defineProps({
  itemsLength: Number,
  itemsPerPage: [Number, String],
  currentPage: Number,
  pageOptions: {
    type: Array,
    default: () => [5, 10, 25, 50, 100],
  },
});

const emit = defineEmits(['update:page', 'update:itemsPerPage']);

const totalPages = computed(() => {
  return Math.ceil(props.itemsLength / props.itemsPerPage);
});

const start = computed(() => {
  return props.itemsLength === 0 ? 0 : (props.currentPage - 1) * props.itemsPerPage + 1;
});

const end = computed(() => {
  const rawEnd = props.currentPage * props.itemsPerPage;
  return rawEnd > props.itemsLength ? props.itemsLength : rawEnd;
});

const prev = () => {
  if (props.currentPage > 1) emit('update:page', props.currentPage - 1);
};

const next = () => {
  if (props.currentPage < totalPages.value) emit('update:page', props.currentPage + 1);
};
</script>

<template>
  <div class="flex items-center justify-between p-2 text-sm border-t border-slate-300 dark:border-slate-700  bg-slate-50 dark:bg-slate-900">
    <div class="text-balck dark:text-white">
      Mostrando {{ start }} - {{ end }} de {{ itemsLength }}
    </div>

    <div class="flex items-center gap-2">
      <select
        class="border rounded px-2 py-1 text-sm text-slate-700 dark:text-slate-300"
        :value="itemsPerPage"
        @change="emit('update:itemsPerPage', +$event.target.value)"
      >
        <option
          class="bg-slate-200 dark:bg-slate-800"
          v-for="option in pageOptions"
          :key="option"
          :value="option"
        >
          {{ option }} por página
        </option>
      </select>

      <button
        class="px-2 py-1 border rounded text-slate-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-gray-800 disabled:opacity-50"
        :disabled="currentPage <= 1"
        @click="prev"
      >
        ←
      </button>

      <span class="text-slate-700 dark:text-slate-300">
        Página {{ currentPage }} de {{ totalPages }}
      </span>

      <button
        class="px-2 py-1 border rounded text-slate-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-gray-800 disabled:opacity-50"
        :disabled="currentPage >= totalPages"
        @click="next"
      >
        →
      </button>
    </div>
  </div>
</template>

<style scoped>
body {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}
</style>