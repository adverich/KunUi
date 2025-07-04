<template>
  <tbody :class="mergedTbodyClass">
    <template v-for="(item, index) in items" :key="itemKey(item, index)">
      <KunTableRow
        :item="item"
        :index="index"
        :headers="headers"
        :showExpand="showExpand"
        :showSelect="showSelect"
        :is-selected="isSelected(item)"
        :is-expanded="isExpanded(item)"
        :has-actions="hasActions"
        :loading="actionLoadingMap[item.id] || false"
        v-bind="$attrs"
        :customSlots="customSlots"
      >
        <template
          v-for="(_, name) in $slots"
          #[name]="slotProps"
        >
          <!-- <slot name="item.actions" :item="item" :index="index" :loading="loading" /> -->
          <slot :name="name" v-bind="{ ...slotProps, item, index, loading: actionLoadingMap?.[item.id] || false }" />
        </template>
      </KunTableRow>

      <!-- Fila expandida -->
      <tr v-if="isExpanded(item)">
        <td :colspan="fullColspan">
          <slot name="expand" :item="item" :index="index">
            <div class="text-center opacity-70 text-sm">No hay contenido expandido.</div>
          </slot>
        </td>
      </tr>
    </template>
  </tbody>
</template>

<script setup>
import { computed } from 'vue';
import KunTableRow from './KunTableRow.vue';

const props = defineProps({
  items: Array,
  tbodyClass: String,
  isExpanded: {
    type: Function,
    required: true,
  },
  isSelected: {
    type: Function,
    required: true,
  },
  itemKey: {
    type: Function,
    default: (_, index) => index,
  },
  headers: Array,
  showExpand: Boolean,
  showSelect: Boolean,
  hasActions: Boolean,
  loading: Boolean,
  actionLoadingMap: Object,
  customSlots: Object,
});

const baseTbodyClass = 'table-auto w-full text-sm text-left';
const mergedTbodyClass = [baseTbodyClass, props.tbodyClass];

// Total de columnas visibles (data + selección + expand)
const fullColspan = computed(() => {
  let total = props.headers?.length || 0;
  if (props.showSelect) total += 1;
  if (props.showExpand) total += 1;
  if (props.hasActions) total += 1;
  return total;
});
</script>
