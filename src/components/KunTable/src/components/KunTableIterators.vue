<template>
  <div class="h-full w-full flex flex-col bg-blue-800">
    <template v-for="(item, index) in items" :key="itemKey(item, index)">
      <KunTableIterator
        :item="item"
        :index="index"
        :headers="headers"
        :show-expand="showExpand"
        :show-select="showSelect"
        :is-expanded="isExpanded(item)"
        :is-selected="isSelected(item)"
        :has-actions="hasActions"
        :loading="actionLoadingMap?.[item.id] || false"
        @toggle-expand="emits('toggle-expand', item)"
        @toggle-select="emits('toggle-select', item)"
        @row-click="emits('row-click', $event)"
        v-bind="$attrs"
        :customSlots="customSlots"
      >
        <template v-for="(_, name) in $slots" #[name]="slotProps">
          <slot :name="name" v-bind="{ ...slotProps, item, index, loading: actionLoadingMap?.[item.id] || false }" />
        </template>
      </KunTableIterator>

      <div v-if="isExpanded(item)" class="px-4 pb-2">
        <slot name="expand" :item="item" :index="index">
          <div class="text-center text-sm opacity-70">No hay contenido expandido.</div>
        </slot>
      </div>
    </template>
  </div>
</template>

<script setup>
import KunTableIterator from './KunTableIterator.vue';

const props = defineProps({
  items: Array,
  headers: Array,
  isExpanded: Function,
  isSelected: Function,
  showExpand: Boolean,
  showSelect: Boolean,
  hasActions: Boolean,
  actionLoadingMap: Object,
  itemKey: {
    type: Function,
    default: (_, index) => index,
  },
  customSlots: Object,
});

const emits = defineEmits(['toggle-expand', 'toggle-select', 'row-click']);
</script>
