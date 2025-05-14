<template>
  <div v-if="menuModel" class="fixed opacity-10 w-svw inset-0 h-svh" @click="menuModel = false" />
  <div class="relative">
    <KunTextField v-model="search" ref="textFieldRef" :placeholder="(isArray(selectedItem) && selectedItem.length) ? '' : placeholder"
      @keyup.down="focusOnMenu" @clickInput="openMenu" @pressEsc="closeMenu" 
      @change="console.log('change')" @focusInput="focusOnMenu" 
    >
    <!-- <div v-if="isArray(selectedItem)" class="d-flex justify-center align-center">
      <template v-for="item in selectedItem">
        <KunBudge size="small" class="ml-1">
          <div class="d-flex justify-center align-center">
            {{ item[itemTitle] }}
            <KunIcon color="error" icon="close" size="small" class="ml-1" @click="removeItem(item)" />
          </div>
        </KunBudge>
      </template>
    </div> -->

      <template v-if="hasIcons" v-slot:append-inner>
        <KunIcon v-if="clearable && selectedItem" @click="clearSelection" size="text-xl" color="text-error" icon="close"
        class="mr-1" :class="isNotEmpty(selectedItem) ? 'cursor-pointer' : 'cursor-default'" :disabled="!isNotEmpty(selectedItem)" />

        <KunIcon color="text-accent-button" size="text-xl" class="cursor-pointer" :icon="menuModel ? 'menuUp' : 'menuDown'"
        @click="menuModel = !menuModel" />

        <KunIcon v-if="required" color="text-red-900" size="text-lg" class="mb-3" icon="asterisk"/>
      </template>
    </KunTextField>

    <div v-show="menuModel" class="absolute h-fit left-0 w-full z-50 bg-surface 
    rounded-b border border-field-border-focus ring-1 focus:ring-field-ring-focus" 
    :close-on-content-click="isCloseOnSelect" :max-height="maxHeight">
      <KunVirtualScroller :items="items" :search="search" searchBy="name" :maxHeight="250">

        <template v-slot:topButton v-if="hasCreateItem">
          <div class="w-full px-2 py-1">
            <KunBtn @click="createItem" class="w-full rounded-md bg-accent-button" size="xs">Crear item</KunBtn>
          </div>
        </template>

        <template v-slot:default="{ item, itemKey }">
          <KunListItem :item="item" :itemKey="itemKey" title="name" cursor="cursor-pointer" @select="selectItem"/>
        </template>
      </KunVirtualScroller>
    </div>
  </div>

  <!-- 
      <KunList @update:selected="getSelectedItem" ref="listRef">
        <KunListItem v-for="(item, index) in filteredItems" :key="index" :value="item" :disabled="checkDisabled(item)"
          :class="isItemSelected(item) ? selectedColor : bgItemListColor" :density="density" 
          :title="itemToString(item, textArr, 'hasDefault')">
          <VListItemTitle class="text-wrap">
            {{ itemToString(item, textArr, 'hasDefault') }}
          </VListItemTitle>
          <div class="text-wrap" v-text="itemSubtitle ? itemToString(item, itemSubtitle) : ''" />
        </KunListItem>
      </KunList>
   -->
</template>

<script setup>
import { defineEmits, defineProps } from 'vue';
import inputProps from '../composables/KunAutocompleteProps';
import { useAutocomplete } from '../composables/useAutocomplete';
const props = defineProps(inputProps);
const key = ref(0);

const modelValue = defineModel({ default: null });
const items = defineModel('items', { default: [], type: Array });

const emits = defineEmits(["createItem"]);

const { selectedItem, textFieldRef, listRef, menuModel, search, 
  isCloseOnSelect, isClearOnSelect, 
  setSelectedItemValue, placeholder, filteredItems, textArr, itemToString, getSelectedItem, 
  openMenu, closeMenu, focusOnMenu, createItem, removeItem, clearSelection
} = useAutocomplete(props, emits, modelValue, items);

watchEffect(() => {
  if (isObject(modelValue.value) && !isNotEmpty(modelValue.value)) selectedItem.value = {};
  if (isArray(modelValue.value) && !isNotEmpty(modelValue.value)) selectedItem.value = [];
  if (modelValue.value === null) selectedItem.value = null;

  setSelectedItemValue();
});

function selectItem(item){
  search.value = '';
  modelValue.value = item;
  closeMenu();
}
</script>

<!-- @import '../assets/styles/VueAutocompleteKun.scss'; -->
<style scoped>
::-webkit-scrollbar-track {
  border-radius: 0px 0px 10px 0px;
}
</style>
