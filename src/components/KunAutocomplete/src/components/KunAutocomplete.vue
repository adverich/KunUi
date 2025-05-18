<template>
  <KunTextField v-model="search" :label="label" dirty :hide-details="hideDetails" :density="density" @keydown="openMenu"
    @keyup.down="focusOnMenu" ref="textFieldRef" autocomplete="off" width="100%"
    :placeholder="(isArray(selectedItem) && selectedItem.length) ? '' : placeholder" :error="!!internalError"
    @focus="validate(modelValue);" :error-messages="internalError">
    <div v-if="isArray(selectedItem)" class="d-flex justify-center align-center">
      <template v-for="item in selectedItem">
        <KunChip size="small" class="ml-1">
          <div class="d-flex justify-center align-center">
            {{ getItemText(item, itemTitle) }}
            <KunIcon color="error" icon="$mdiClose" size="small" class="ml-1" @click="removeItem(item)" />
          </div>
        </KunChip>
      </template>
    </div>

    <template v-if="hasIcons" v-slot:append-inner>
      <KunIcon v-if="clearable && selectedItem" @click="clearSelection" size="small" color="error" icon="$mdiClose"
        class="mr-1 mt-1" />

      <KunIcon color="teal-darken-1" size="large" class="cursor-pointer">
        {{ listRef ? "$mdiMenuUpOutline" : "$mdiMenuDownOutline" }}
      </KunIcon>

      <KunIcon v-if="required" color="teal-darken-1" size="x-small" class="mb-4">
        $mdiAsterisk
      </KunIcon>
    </template>

    <VMenu @click:outside="lightReset()" v-model="menuModel" activator="parent" @keydown="onMenuKeydown"
      :close-on-content-click="isCloseOnSelect" :max-height="maxHeight">
      <VList @update:selected="getSelectedItem" @click:select="lightReset()" ref="listRef" @mouseover="activeIntersect">
        <VListItem v-if="hasCreateItem">
          <VBtn @click="createItem" class="w-100" color="success">
            Crear item
          </VBtn>
        </VListItem>
        <VListItem v-for="(item, index) in filteredItems" :key="item.id?.toString() ?? item.name" :value="item"
          :disabled="checkDisabled(item)" :class="isItemSelected(item) ? selectedColor : bgItemListColor"
          :density="density" :id="item.id?.toString() ?? item.name">
          <VListItemTitle class="text-wrap">
            {{ itemToString(item, textArr, 'hasDefault') }}
          </VListItemTitle>
          <VListItemSubtitle class="text-wrap" v-text="itemSubtitle ? itemToString(item, itemSubtitle) : ''" />
        </VListItem>
        <div ref="intersectRef" />
      </VList>
    </VMenu>
  </KunTextField>
</template>

<script setup>
import { watchEffect } from 'vue';
import { isArray } from '../utils/helpers';
import { useAutocomplete } from '../composables/useAutocomplete'; // Asegúrate de que la ruta sea correcta
import { useIntersect } from '../composables/useIntersect';
import { KunAutocompleteProps } from '../composables/KunAutocompleteProps';
import KunTextField from '../../../KunTextField/src/components/KunTextField.vue'
import KunChip from '../../../KunChip/src/components/KunChip.vue'
import KunIcon from '../../../KunIcon/src/components/KunIcon.vue'

const modelValue = defineModel({ default: null });
const items = defineModel('items', { default: [], type: Array, required: true });
const itemsPerIntersection = defineModel('itemsPerIntersection', { default: 20, type: Number });

const props = defineProps(KunAutocompleteProps);
const emits = defineEmits(["createItem", "validation"]);
const intersectRef = ref(null);

const { selectedItem, textFieldRef, listRef, menuModel, search, removeItem, clearSelection, lightReset, openMenu, focusOnMenu, onMenuKeydown,
  setSelectedItemValue, getSelectedItem, textArr, getItemText,
  createItem, checkDisabled, filteredItems, itemToString, placeholder, isCloseOnSelect, isClearOnSelect,
  handleIntersect, intersectObserved } = useAutocomplete(props, emits, modelValue, items, itemsPerIntersection);

const { observe, stopObserver } = useIntersect(() => handleIntersect(), `0px 0px 200px 0px`, intersectObserved, menuModel, intersectRef);

function activeIntersect() {
  if (!intersectObserved.value) {
    observe();
  }
}

onMounted(() => props.focusOnRender ? textFieldRef.value.focus() : '');
onUnmounted(() => stopObserver());

watchEffect(() => {
  if (isObject(modelValue.value) && !isNotEmpty(modelValue.value)) selectedItem.value = {};
  if (isArray(modelValue.value) && !isNotEmpty(modelValue.value)) selectedItem.value = [];
  if (modelValue.value === null) selectedItem.value = null;

  setSelectedItemValue();
});

function isItemSelected(item) {
  if (modelValue.value === null || modelValue.value === undefined) return false;
  if (!props.multiple) return placeholder.value === item[props.itemTitle];
  return modelValue.value.find((i) => i[props.itemValue] === item[props.itemValue]);
}

// Estado interno del error
const internalError = ref('');
// Método de validación
const validate = (value) => {
  for (const rule of props.rules) {
    const result = rule(value);
    if (result !== true) {
      internalError.value = result;
      emits('validation', false); // Notificar que no es válido
      return false;
    }
  }
  internalError.value = '';
  emits('validation', true); // Notificar que es válido
  return true;
};

// Observa cambios en el valor del modelo para validar automáticamente
watch(() => modelValue.value, (newValue, oldValue) => {
  if (isNotEmpty(props.rules)) {
    validate(newValue);
  }
})
</script>
