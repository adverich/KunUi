<script setup>
import { reactive, ref } from 'vue';
import KunTableServerSide from '../src/components/KunTableServerSide.vue';

const loading = ref(false);
const selected = ref([]);
const search = ref('');

const query = reactive({
  page: 1,
  per_page: 10,
  sortBy: [{ key: 'name', order: 'asc' }],
});

const headers = [
  { key: 'id', value: 'id', label: 'ID', sortable: true },
  { key: 'name', value: 'name', label: 'Nombre', sortable: true },
  { key: 'price', value: 'price', label: 'Precio', sortable: true, headerAlign: 'right' },
];

const result = ref({
  data: [
    { id: 1, name: 'Producto A', price: 1000 },
    { id: 2, name: 'Producto B', price: 2500 },
  ],
  current_page: 1,
  last_page: 3,
  per_page: 10,
  total: 24,
  from: 1,
  to: 2,
});

function handleQuery(nextQuery) {
  console.log('Query server-side:', nextQuery);
}
</script>

<template>
  <div class="p-4">
    <KunTableServerSide
      :result="result"
      :headers="headers"
      :loading="loading"
      searchable
      v-model:selectedItems="selected"
      :search="search"
      :page="query.page"
      :items-per-page="query.per_page"
      :sort-by="query.sortBy"
      @update:search="search = $event"
      @update:query="handleQuery"
    />
  </div>
</template>
