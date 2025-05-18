<template>
  <div class="p-4 max-w-md">
    <KunList v-model:selected-values="selected" selectable="multiple" nav>
      <KunListItem value="1">Elemento 1</KunListItem>
      <KunListItem value="2">Elemento 2</KunListItem>
      <KunListItem value="3">Elemento 3</KunListItem>
    </KunList>

    <pre class="mt-4">{{ selected }}</pre>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import KunList from '../src/components/KunList.vue'
import KunListItem from '../../../../KunListItem/src/components/KunListItem.vue'

const selected = ref([])
</script>