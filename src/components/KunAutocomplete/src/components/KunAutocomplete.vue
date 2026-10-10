<template>
  <div class="w-full h-fit" ref="parentRef">
    <KunTextField v-model="search" v-bind="textFieldProps" :label="label" :disabled="disabled" dirty :hide-details="hideDetails" :density="density" ref="textFieldRef"
      autocomplete="off" @update:modelValue="txtUpdated" @focusInput="txtFocused" @handleClick="toggleMenu" :rounded="menuModel ? 'rounded-t' : 'rounded'"
      @blur="textFieldBlur" @keyDown="textKeyDown" @keyDown.enter.prevent="handleEnter"
      :placeholder="props.multiple && isArray(modelValue) && (modelValue as unknown[]).length ? '' : placeholder"
      :error="!!internalError" :error-messages="internalError"
    >
      <template #prepend-input-content>
        <div
          v-if="isArray(modelValue) && isNotEmpty(modelValue)"
          ref="chipsWrapRef"
          class="flex min-w-0 max-w-full flex-nowrap items-center gap-1 overflow-hidden"
          @click="!disabled && toggleMenu()"
        >
          <template v-for="(item, idx) in (modelValue as unknown[])" :key="typeof item === 'object' && item !== null ? ((item as any).id ?? (item as any).name ?? idx) : ((item as string) ?? idx)">
            <KunChip v-show="idx < visibleCount" :data-chip="idx" size="small" variant="pill" class="shrink-0">
              <div class="flex items-center">
                {{ getArrayText(item) }}
                <KunIcon
                  color="error"
                  :icon="icons.close"
                  size="small"
                  class="ml-1"
                  @click.stop="removeItem(item)"
                />
              </div>
            </KunChip>
          </template>
          <KunChip
            v-if="hiddenCount > 0"
            size="small"
            variant="pill"
            class="shrink-0"
            :title="hiddenNames"
          >
            +{{ hiddenCount }} ...
          </KunChip>
        </div>
      </template>

      <template v-if="hasIcons" v-slot:append-inner>
        <KunIcon v-if="clearable && modelValue" @click="clearSelection" size="small" color="error" :icon="icons.close"
          class="mr-1 mt-1" />
        <KunIcon :color="iconColor" size="large" class="cursor-pointer"
          :icon="menuModel ? icons.menuUpOutline : icons.menuDownOutline" @click.stop="openMenu" />
        <KunIcon v-if="required" :color="requiredIconColor" size="x-small" class="mb-4" :icon="icons.asterisk" />
      </template>

      <KunMenu transition="fade" @click:outside="lightReset" v-model="menuModel" activator="parent" :z-index="zIndex"
        :parent-ref="(parentRef as any)" :origin="menuOrigin" @handleEscape="handleEscape" :bgColor="bgMenuColor"
        :close-on-content-click="props.multiple ? false : closeOnSelect" width="w-full" :max-height="maxHeight" :hide-details="hideDetails"
      >
        <div v-if="hasCreateItem" class="sticky top-0 z-10 p-2 border-b bg-select-background">
          <KunBtn @click="createItem" :bgColor="btnCreateBg" :class="btnCreateClass" >
            {{ btnCreateText }}
          </KunBtn>
        </div>
        <KunList @click:select="getSelectedItem" ref="listRef" @keyDown="handleKeyList" :selectable="false">
          <KunInfiniteScroll :items="items" :search="search" :searchable-keys="props.searchableKeys" :virtual="false"
            :items-per-intersection="10" :enabled="menuModel" :item-height="48" v-slot="sp">
            <template v-if="!(sp as any).empty && ((sp as any).item !== undefined && (sp as any).item !== null)">
              <KunListItem :value="(sp as any).item" :key="`kun-list-${(sp as any).index + 1}`" :id="`kun-item-${(sp as any).index + 1}`" :disabled="checkDisabled((sp as any).item)"
              :bg-items="bgItemListColor" :hover-bg="hoverItemListColor" :activeClass="selectedItemListColor"
              :density="density" :selectable="true" :active="isItemSelected((sp as any).item)" rounded="none">
                <KunListItemTitle class="text-wrap">
                  {{ itemToString((sp as any).item, itemTitle ?? textArr, 'hasDefault') }}
                </KunListItemTitle>
                <KunListItemSubtitle :text="itemSubtitle ? itemToString((sp as any).item, itemSubtitle) : ''" />
              </KunListItem>
            </template>
            <template v-else>
          <KunListItem disabled>
                <KunListItemTitle :class="['text-center w-full', emptyTextClass]">
                  {{ textNoItems }}
                </KunListItemTitle>
              </KunListItem>
            </template>
          </KunInfiniteScroll>
        </KunList>
      </KunMenu>
    </KunTextField>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick, type Ref } from 'vue';
import { icons } from '@/icons'
import { isNotEmpty, isArray } from '../../../../utils/utils.js'

import KunInfiniteScroll from '../../../KunInfiniteScroll/src/components/KunInfiniteScroll.vue';

import KunList from '../../../KunList/src/components/KunList.vue';
import KunListItem from '../../../KunListItem/src/components/KunListItem.vue';
import KunListItemTitle from '../../../KunListItemTitle/src/components/KunListItemTitle.vue';
import KunListItemSubtitle from '../../../KunListItemSubtitle/src/components/KunListItemSubtitle.vue';
import KunMenu from '../../../KunMenu/src/components/KunMenu.vue';

import { useAutocomplete, type AutocompleteEmitEvent } from '../composables/useAutocomplete.js';
import { KunAutocompleteProps } from '../composables/KunAutocompleteProps.js';
import KunTextField from '../../../KunTextField/src/components/KunTextField.vue'
import KunBtn from '../../../KunBtn/src/components/KunBtn.vue';
import KunChip from '../../../KunChip/src/components/KunChip.vue'
import KunIcon from '../../../KunIcon/src/components/KunIcon.vue'

// any intencional: los tipos de Vue exigen default no-null para T=unknown;
// el modelo acepta cualquier cosa (objeto, array, primitivo, null).
const modelValue = defineModel<any>({ default: null });
const items = defineModel<unknown[]>('items', { default: (() => []) as () => unknown[], required: true });

const props = defineProps(KunAutocompleteProps);
const emits = defineEmits<{
  (event: AutocompleteEmitEvent, value?: unknown): void;
  (event: 'validation', value: boolean): void;
  (event: 'search', value: unknown): void;
  (event: 'keyDown' | 'keyDownEnter' | 'notFound', value: unknown): void;
}>();

const { textFieldRef, listRef, menuModel, search, selectedItem, removeItem, clearSelection, lightReset, openMenu, closeMenu, toggleMenu, onMenuKeydown, focusListWithKey,
  getSelectedItem, textArr, getArrayText, isAlphanumeric, checkIfValueExist, extractValueKey,
  createItem, checkDisabled, itemToString, placeholder,
} = useAutocomplete(props, emits, modelValue, items);

function isItemSelected(item: unknown): boolean {
  try {
    if (props.multiple) return checkIfValueExist(item);
    const mv = modelValue.value;
    if (mv === null || mv === undefined || mv === '') return false;
    return extractValueKey(item) === extractValueKey(mv);
  } catch {
    return false;
  }
}

// Truncado de chips: muestra los que entran y el resto como "+N ...". Nunca scroll horizontal.
const chipsWrapRef: Ref<HTMLElement | null> = ref(null);
const visibleCount = ref(9999);
const totalSelected = computed(() => (isArray(modelValue.value) ? (modelValue.value as unknown[]).length : 0));
const hiddenCount = computed(() => Math.max(0, totalSelected.value - visibleCount.value));
const hiddenNames = computed(() => {
  if (!hiddenCount.value) return '';
  try {
    return (modelValue.value as unknown[]).slice(visibleCount.value).map((v: unknown) => getArrayText(v)).join(', ');
  } catch {
    return '';
  }
});

let overflowToken = 0;
async function updateOverflow() {
  const my = ++overflowToken;
  await nextTick();
  if (my !== overflowToken) return;
  const el = chipsWrapRef.value;
  if (!el || !totalSelected.value) return;
  // Medición directa del navegador: se muestra todo y se oculta de a un chip
  // hasta que no haya desborde. El contador "+N ..." ya renderizado cuenta
  // solo en el cálculo, sin reservas estimadas. Tolerancia de 2px por redondeo
  // de subpíxeles para no truncar un chip por 1px.
  const TOL = 2;
  const fits = () => el.scrollWidth <= el.clientWidth + TOL;
  let n = totalSelected.value;
  visibleCount.value = n;
  await nextTick();
  if (my !== overflowToken) return;
  // Si aún no hay layout (diálogo cerrado, tab oculta), no recortar: ya habrá
  // ResizeObserver al mostrarse.
  if (!el.clientWidth) return;
  let guard = totalSelected.value + 2;
  while (guard-- > 0) {
    const cur = chipsWrapRef.value;
    if (!cur) return;
    if (cur.scrollWidth <= cur.clientWidth + TOL) break;
    if (n <= 0) break;
    n--;
    visibleCount.value = n;
    await nextTick();
    if (my !== overflowToken) return;
  }
}

watch(() => modelValue.value, () => updateOverflow(), { deep: true });

let ro: ResizeObserver | null = null;
onMounted(() => {
  if (props.focusOnRender) textFieldRef.value?.focus?.();
  updateOverflow();
  ro = new ResizeObserver(() => updateOverflow());
  if (parentRef.value) ro.observe(parentRef.value);
});

onBeforeUnmount(() => {
  overflowToken++;
  ro?.disconnect();
});

const parentRef: Ref<HTMLElement | null> = ref(null);

// Estado interno del error
const internalError = ref('');

// Método de validación
const validate = (value: unknown): boolean => {
  for (const rule of (props.rules as ((v: unknown) => unknown)[] | undefined) || []) {
    const result = (rule as (v: unknown) => unknown)(value);
    if (result !== true) {
      internalError.value = result as string;
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

watch(() => props.disabled, (disabled) => {
  if (disabled) {
    closeMenu();
  }
})

function handleEscape(): void {
  menuModel.value = false;
  textFieldRef.value?.inputField?.focus();
}

function textKeyDown(e: KeyboardEvent): void {
  if (props.disabled) return;

  const key = e.key

  if (key === 'Tab' || key === 'Shift' || key === 'Escape') {
    closeMenu();
    emits('keyDown', key);
    return;
  }

  if (isAlphanumeric(key) || key === "Backspace") {
    openMenu();
  }

  if (['ArrowUp', 'ArrowDown'].includes(key)) {
    e.preventDefault();
    if (!menuModel.value) openMenu();

    focusListWithKey(key);
  }
}

function txtUpdated(event?: unknown): void {
  emits('search', search);
}

function txtFocused() {
  if (props.disabled) return;
  validate(modelValue);
}


function handleKeyList(event: KeyboardEvent): void {
  onMenuKeydown(event);
}

function textFieldBlur() {
  // SE MANTIENE LA FUNCINOALIDAD TEMPORALMENTE POR SI SE NECESITA, SINO SERA ELIMINADO
}

function handleEnter(e: KeyboardEvent): void {
  if (props.disabled) return;

  if (!search.value) return;

  let found: unknown = null;

  // Caso 1: returnObject = true
  if (props.returnObject) {
    found = items.value.find((item: unknown) =>
      Object.values(item as Record<string, unknown>).some((val: unknown) =>
        String(val).toLowerCase() === String(search.value).toLowerCase()
      )
    );
  }

  // Caso 2: returnObject = false y hay itemValue
  else if (props.itemValue) {
    found = items.value.find((item: unknown) =>
      String((item as Record<string, unknown>)[props.itemValue as string]).toLowerCase() === String(search.value).toLowerCase()
    );
  }

  // Caso 3: item es primitivo u objeto sin itemValue
  else {
    found = items.value.find((item: unknown) =>
      (typeof item === "object"
        ? Object.values(item as Record<string, unknown>).some((val: unknown) => String(val).toLowerCase() === String(search.value).toLowerCase())
        : String(item).toLowerCase() === String(search.value).toLowerCase()
      )
    );
  }

  if (found) {
    // Reutilizamos la lógica que ya maneja emits, multiple, etc.
    getSelectedItem(found);
  } else {
    // Si no se encuentra nada, emitir evento notFound
    emits('notFound', search.value);

    // Opcional: limpiar campo o mostrar mensaje visual
    if (props.clearOnNotFound) {
      search.value = "";
      menuModel.value = false;
    }
  }

  nextTick(() => {
    emits('keyDownEnter', e);
  });
}

defineExpose({
  focus: () => !props.disabled && nextTick(() => textFieldRef.value?.focus?.())
});
</script>

