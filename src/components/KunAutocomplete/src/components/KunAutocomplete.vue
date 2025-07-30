<template>
  <div class="w-full h-fit" ref="parentRef">
    <KunTextField v-model="search" :label="label" dirty :hide-details="hideDetails" :density="density" ref="textFieldRef"
      autocomplete="off" @update:modelValue="txtUpdated" @focusInput="txtFocused" @handleClick="toggleMenu" :rounded="menuModel ? 'rounded-t' : 'rounded'"
      @blur="textFieldBlur" @keyDown="textKeyDown"
      :placeholder="props.multiple && isArray(modelValue) && modelValue.length ? '' : placeholder"
      :error="!!internalError" :error-messages="internalError">

      <div v-if="isArray(modelValue)" class="flex flex-wrap gap-1">
        <template v-for="item in modelValue" :key="item.id ?? item.name">
          <KunChip size="small">
            <div class="flex items-center">
              {{ getItemText(item, itemTitle) }}
              <KunIcon color="error" :icon="icons.close" size="small" class="ml-1" @click="removeItem(item)" />
            </div>
          </KunChip>
        </template>
      </div>

      <template v-if="hasIcons" v-slot:append-inner>
        <KunIcon v-if="clearable && modelValue" @click="clearSelection" size="small" color="error" :icon="icons.close"
          class="mr-1 mt-1" />
        <KunIcon color="teal-darken-1" size="large" class="cursor-pointer"
          :icon="menuModel ? icons.menuUpOutline : icons.menuDownOutline" @click.stop="openMenu" />
        <KunIcon v-if="required" color="teal-darken-1" size="x-small" class="mb-4" :icon="icons.asterisk" />
      </template>

      <KunMenu transition="fade" @click:outside="lightReset" v-model="menuModel" activator="parent" :z-index="zIndex"
        :parent-ref="parentRef" location="bottom" origin="bottom left" @handleEscape="handleEscape"
        :close-on-content-click="closeOnSelect" width="w-full" :max-height="maxHeight" :hide-details="hideDetails"
      >
        <!-- <div v-if="hasCreateItem" class="sticky top-0 z-10 p-2 border-b">
          <KunBtn @click="createItem" :bgColor="btnCreateBg" :class="btnCreateClass" >
            {{ btnCreateText }}
          </KunBtn>
        </div> -->
        <KunList @click:select="getSelectedItem" ref="listRef" @keyDown="handleKeyList" :selectable="true">
          <KunInfiniteScroll :items="items" :search="search" :searchable-keys="props.searchableKeys" :virtual="false"
            :items-per-intersection="10" :enabled="menuModel" :item-height="48" v-slot="{ item, index, empty }">
            <template v-if="!empty && item">
              <KunListItem :value="item" :key="`kun-list-${index + 1}`" :id="`kun-item-${index + 1}`" :disabled="checkDisabled(item)" 
              :bg-items="bgItemListColor" :hover-bg="hoverItemListColor" :activeClass="selectedItemListColor"
              :density="density" :selectable="true">
                <KunListItemTitle class="text-wrap">
                  {{ itemToString(item, itemTitle ?? textArr, 'hasDefault') }}
                </KunListItemTitle>
                <KunListItemSubtitle :text="itemSubtitle ? itemToString(item, itemSubtitle) : ''" />
              </KunListItem>
            </template>
            <template v-else>
              <KunListItem disabled>
                <KunListItemTitle class="text-center w-full text-gray-500">
                  No hay elementos disponibles
                </KunListItemTitle>
              </KunListItem>
            </template>
          </KunInfiniteScroll>
        </KunList>
      </KunMenu>
    </KunTextField>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { icons } from '@/icons'
import { isNotEmpty, isArray } from '../../../../utils/utils.js'

import KunInfiniteScroll from '../../../KunInfiniteScroll/src/components/KunInfiniteScroll.vue';

import KunList from '../../../KunList/src/components/KunList.vue';
import KunListItem from '../../../KunListItem/src/components/KunListItem.vue';
import KunListItemTitle from '../../../KunListItemTitle/src/components/KunListItemTitle.vue';
import KunListItemSubtitle from '../../../KunListItemSubtitle/src/components/KunListItemSubtitle.vue';
import KunMenu from '../../../KunMenu/src/components/KunMenu.vue';

import { useAutocomplete } from '../composables/useAutocomplete';
import { KunAutocompleteProps } from '../composables/KunAutocompleteProps';
import KunTextField from '../../../KunTextField/src/components/KunTextField.vue'
import KunBtn from '../../../KunBtn/src/components/KunBtn.vue';
import KunChip from '../../../KunChip/src/components/KunChip.vue'
import KunIcon from '../../../KunIcon/src/components/KunIcon.vue'

const modelValue = defineModel({ default: null });
const items = defineModel('items', { default: [], type: Array, required: true });

const props = defineProps(KunAutocompleteProps);
const emits = defineEmits(["update:modelValue", "selectedItem", "createItem", "validation", "search"]);

const { textFieldRef, listRef, menuModel, search, selectedItem, removeItem, clearSelection, lightReset, openMenu, closeMenu, toggleMenu, onMenuKeydown,
  getSelectedItem, textArr, getItemText, isAlphanumeric,
  createItem, checkDisabled, itemToString, placeholder, 
} = useAutocomplete(props, emits, modelValue, items);

onMounted(() => {
  if (props.focusOnRender) textFieldRef.value.focus();
});

const parentRef = ref(null);

// Estado interno del error
const internalError = ref('');

// Método de validación
const validate = (value) => {
  for (const rule of props.rules) {
    const result = rule(value);
    if (result !== true) {
      internalError.value = result;
      emits('validation', false);
      return false;
    }
  }
  internalError.value = '';
  emits('validation', true);
  return true;
};

// Observa cambios en el valor del modelo para validar automáticamente
watch(() => modelValue.value, (newValue, oldValue) => {
  if (isNotEmpty(props.rules)) {
    validate(newValue);
  }
})

function handleEscape() {
  menuModel.value = false;
  textFieldRef.value.inputField?.focus();
}

function textKeyDown(e) {
  const key = e.key

  if (key === 'Tab' || key === 'Shift') {
    closeMenu();
    return;
  }

  if (isAlphanumeric(key) || key === "Backspace") {
    openMenu();
  }

  if (['ArrowUp', 'ArrowDown'].includes(key)) {
    e.preventDefault();
    if (!menuModel.value) openMenu();
    console.log('listRef.value', listRef.value);
    
    listRef.value?.focusWithKey?.(key);
  }
}

function txtUpdated(event) {
  emits('search', search);
}

function txtFocused() {
  validate(modelValue);
}


function handleKeyList(event) {
  onMenuKeydown(event);
}

function textFieldBlur() {
  // SE MANTIENE LA FUNCINOALIDAD TEMPORALMENTE POR SI SE NECESITA, SINO SERA ELIMINADO
}
</script>
