<script setup>
import { onMounted, onBeforeUnmount, computed, ref, watch } from 'vue'

const props = defineProps({
  itemsLength: { type: Number, default: 0 },
  itemsPerPage: { type: [Number, String], default: 10 },
  currentPage: { type: Number, default: 1 },
  pageOptions: { type: Array, default: () => [5,10,25,50,100] },
})

const emit = defineEmits(['update:page', 'update:itemsPerPage'])

const totalPages = computed(() => {
  const ipp = Number(props.itemsPerPage) || 1
  return props.itemsLength === 0 ? 0 : Math.ceil(props.itemsLength / ipp)
})

const start = computed(() => {
  return props.itemsLength === 0 ? 0 : (props.currentPage - 1) * Number(props.itemsPerPage) + 1
})

const end = computed(() => {
  const raw = props.currentPage * Number(props.itemsPerPage)
  return raw > props.itemsLength ? props.itemsLength : raw
})

const prev = () => {
  if (props.currentPage > 1) emit('update:page', props.currentPage - 1)
}
const next = () => {
  if (props.currentPage < totalPages.value) emit('update:page', props.currentPage + 1)
}

const detailsRef = ref(null);
const ippDetailsRef = ref(null);

const pagesToShow = computed(() => {
  const tp = totalPages.value
  if (tp === 0) return []
  if (tp <= 100) return Array.from({ length: tp }, (_, i) => i + 1)

  const cp = props.currentPage
  const from = Math.max(1, cp - 3)
  const to = Math.min(tp, cp + 3)
  const arr = []
  if (from > 1) {
    arr.push(1)
    if (from > 2) arr.push('start-ellipsis')
  }
  for (let n = from; n <= to; n++) arr.push(n)
  if (to < tp) {
    if (to < tp - 1) arr.push('end-ellipsis')
    arr.push(tp)
  }
  return arr
})

function goToPage(n) {
  const page = Math.min(Math.max(1, Number(n)), totalPages.value || 1)
  emit('update:page', page)
  if (detailsRef.value) detailsRef.value.open = false
}

function onItemsPerPageSelect(v) {
  emit('update:itemsPerPage', v)
  emit('update:page', 1) // opcional, para resetear a página 1
  ippDetailsRef.value?.removeAttribute("open")
}

function handleClickOutsideIpp(e) {
  if (ippDetailsRef.value && !ippDetailsRef.value.contains(e.target)) {
    ippDetailsRef.value.removeAttribute("open")
  }
}

function handleClickOutside(e) {
  if (detailsRef.value && !detailsRef.value.contains(e.target)) {
    detailsRef.value.removeAttribute("open");
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  document.addEventListener("click", handleClickOutsideIpp)

});
onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
  document.removeEventListener("click", handleClickOutsideIpp)
});

watch(() => totalPages.value, (newVal, oldVal) => {
  if (props.currentPage > newVal && newVal > 0) {
    emit('update:page', newVal);
  } else if (newVal === 0) {
    emit('update:page', 1);
  }
});
</script>

<template>
  <div class="flex items-center justify-between p-2 text-sm border-t border-slate-300 dark:border-slate-700 bg-surface-dark">
    <div>
      Mostrando {{ start }} - {{ end }} de {{ itemsLength }}
    </div>

    <div class="flex items-center gap-2">
      <!-- itemsPerPage -->
      <details ref="ippDetailsRef" class="relative inline-block">
        <summary
          class="px-3 py-1 border rounded cursor-pointer text-slate-800 dark:text-slate-200 select-none"
          aria-haspopup="listbox"
        >
          {{ itemsPerPage }} por página
        </summary>

        <div
          class="absolute bottom-full right-0 min-w-full max-h-56 overflow-y-auto 
          bg-menu border rounded shadow z-20 p-1"
        >
          <div class="flex flex-col gap-1">
            <button
              v-for="opt in pageOptions"
              :key="opt"
              class="text-center px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 w-full cursor-pointer"
              :class="{'font-semibold bg-slate-100 dark:bg-slate-700': opt === Number(itemsPerPage)}"
              @click="onItemsPerPageSelect(opt)"
            >
              {{ opt }} items
            </button>
          </div>
        </div>
      </details>

      <!-- prev -->
      <button
        class="px-2 py-1 border rounded text-slate-800 dark:text-slate-200 hover:bg-button-hover disabled:opacity-50"
        :disabled="currentPage <= 1"
        @click="prev"
      >←</button>

      <!-- Página selector: usa <details> para desplegar lista de páginas -->
      <details ref="detailsRef" class="relative inline-block">
        <summary
          class="px-3 py-1 border rounded cursor-pointer text-slate-800 dark:text-slate-200 select-none"
          aria-haspopup="listbox"
        >
          Página {{ currentPage }} de {{ totalPages }}
        </summary>

        <div
          class="absolute bottom-full right-0 min-w-full max-h-56 overflow-y-auto 
          bg-menu border rounded shadow z-20 p-1"
        >
          <div class="flex flex-col gap-1">
            <template v-for="p in pagesToShow" :key="String(p)">
              <div
                v-if="p === 'start-ellipsis' || p === 'end-ellipsis'"
                class="px-2 py-1 text-center text-slate-500"
              >
                …
              </div>
              <button
                v-else
                class="text-center px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 w-full cursor-pointer"
                :class="{'font-semibold bg-dark:bg-slate-700': p === currentPage}"
                @click="goToPage(p)"
              >
                Página {{ p }} 
              </button>
            </template>
          </div>
        </div>
      </details>

      <!-- next -->
      <button
        class="px-2 py-1 border rounded text-slate-700 dark:text-slate-300 hover:bg-button-hover disabled:opacity-50"
        :disabled="currentPage >= totalPages || totalPages === 0"
        @click="next"
      >→</button>
    </div>
  </div>
</template>

<style scoped>
/* evita select accidental text selection del summary */
summary { list-style: none; }
summary::-webkit-details-marker { display: none; }
</style>
