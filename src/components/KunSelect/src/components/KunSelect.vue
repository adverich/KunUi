<template>
  <div class="w-full h-fit" ref="parentRef">
    <KunTextField
      :model-value="displayText"
      v-bind="textFieldProps"
      :label="label"
      :disabled="disabled"
      :readonly="true"
      dirty
      :hide-details="hideDetails"
      :density="density"
      ref="textFieldRef"
      autocomplete="off"
      class="kun-select-field"
      :rounded="menuModel ? 'rounded-t' : 'rounded'"
      :placeholder="props.multiple && isArray(modelValue) && (modelValue as unknown[]).length ? '' : placeholder"
      :error="!!internalError"
      :error-messages="internalError"
      @handleClick="toggleMenu"
      @focus="txtFocused"
      @keyDown="textKeyDown"
    >
      <template #prepend-input-content>
        <div
          v-if="isArray(modelValue) && isNotEmpty(modelValue)"
          ref="chipsWrapRef"
          class="flex min-w-0 max-w-full flex-nowrap items-center gap-1 overflow-hidden"
          @click="!disabled && !readonly && toggleMenu()"
        >
          <template v-for="(item, idx) in (modelValue as unknown[])" :key="typeof item === 'object' && item !== null ? ((item as any).id ?? (item as any).name ?? idx) : ((item as string) ?? idx)">
            <KunChip v-show="idx < visibleCount" :data-chip="idx" size="small" variant="pill" class="shrink-0">
              <div class="flex items-center">
                {{ getArrayText(item) }}
                <KunIcon
                  v-if="!disabled && !readonly"
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
        <KunIcon v-if="clearable && hasValue && !disabled && !readonly" @click.stop="clearSelection" size="small" color="error" :icon="icons.close"
          class="mr-1 mt-1" />
        <KunIcon :color="iconColor" size="large" class="cursor-pointer"
          :icon="menuModel ? icons.menuUpOutline : icons.menuDownOutline" @click.stop="toggleMenu" />
        <KunIcon v-if="required" :color="requiredIconColor" size="x-small" class="mb-4" :icon="icons.asterisk" />
      </template>

      <KunMenu transition="fade" @click:outside="closeMenu" v-model="menuModel" activator="parent" :z-index="zIndex"
        :parent-ref="(parentRef as any)" :origin="menuOrigin" @handleEscape="handleEscape" :bgColor="bgMenuColor"
        :close-on-content-click="props.multiple ? false : closeOnSelect" width="w-full" :max-height="maxHeight" :hide-details="hideDetails"
      >
        <div v-if="hasCreateItem" class="sticky top-0 z-10 p-2 border-b bg-select-background">
          <KunBtn @click="createItem" :bgColor="btnCreateBg" :class="btnCreateClass">
            {{ btnCreateText }}
          </KunBtn>
        </div>
        <KunList @click:select="getSelectedItem" ref="listRef" @keyDown="handleKeyList" :selectable="false">
          <template v-if="items.length">
            <KunListItem
              v-for="(item, index) in items"
              :key="`kun-select-${index + 1}`"
              :id="`kun-item-${index + 1}`"
              :value="(item as any)"
              :disabled="checkDisabled(item)"
              :bg-items="bgItemListColor"
              :hover-bg="hoverItemListColor"
              :activeClass="selectedItemListColor"
              :density="density"
              :selectable="true"
              :active="isItemSelected(item)"
              rounded="none"
            >
              <KunListItemTitle class="text-wrap">
                {{ itemToString(item, itemTitle ?? textArr, 'hasDefault') }}
              </KunListItemTitle>
              <KunListItemSubtitle :text="itemSubtitle ? itemToString(item, itemSubtitle) : ''" />
            </KunListItem>
          </template>
          <template v-else>
            <KunListItem disabled>
              <KunListItemTitle :class="['text-center w-full', emptyTextClass]">
                {{ textNoItems }}
              </KunListItemTitle>
            </KunListItem>
          </template>
        </KunList>
      </KunMenu>
    </KunTextField>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick, type Ref } from 'vue';
import { icons } from '@/icons/index.js';
import { isNotEmpty, isArray } from '../../../../utils/utils.js';

import KunList from '../../../KunList/src/components/KunList.vue';
import KunListItem from '../../../KunListItem/src/components/KunListItem.vue';
import KunListItemTitle from '../../../KunListItemTitle/src/components/KunListItemTitle.vue';
import KunListItemSubtitle from '../../../KunListItemSubtitle/src/components/KunListItemSubtitle.vue';
import KunMenu from '../../../KunMenu/src/components/KunMenu.vue';

import { useSelect, type SelectEmitEvent } from '../composables/useSelect.js';
import { KunSelectProps } from '../composables/KunSelectProps.js';
import KunTextField from '../../../KunTextField/src/components/KunTextField.vue';
import KunBtn from '../../../KunBtn/src/components/KunBtn.vue';
import KunChip from '../../../KunChip/src/components/KunChip.vue';
import KunIcon from '../../../KunIcon/src/components/KunIcon.vue';

// any intencional: los tipos de Vue exigen default no-null para T=unknown;
// el modelo acepta cualquier cosa (objeto, array, primitivo, null).
const modelValue = defineModel<any>({ default: null });
const items = defineModel<unknown[]>('items', { default: (() => []) as () => unknown[] });

const props = defineProps(KunSelectProps);
const emits = defineEmits<{
  (event: SelectEmitEvent, value?: unknown): void;
  (event: 'validation', value: boolean): void;
  (event: 'keyDown', value: unknown): void;
}>();

const { textFieldRef, listRef, menuModel, displayText, removeItem, clearSelection, closeMenu, openMenu, toggleMenu, focusListWithKey,
  getSelectedItem, textArr, getArrayText, checkIfValueExist, extractValueKey,
  createItem, checkDisabled, itemToString, placeholder,
} = useSelect(props, emits, modelValue, items);

const hasValue = computed(() => {
  const v: unknown = modelValue.value;
  if (v === null || v === undefined || v === '') return false;
  if (isArray(v)) return (v as unknown[]).length > 0;
  return true;
});

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
  const TOL = 2;
  let n = totalSelected.value;
  visibleCount.value = n;
  await nextTick();
  if (my !== overflowToken) return;
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
    const result = (rule as (v: unknown) => unknown)(value ?? modelValue.value);
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
watch(() => modelValue.value, (newValue) => {
  if (isNotEmpty(props.rules)) {
    validate(newValue);
  }
});

watch(() => props.disabled, () => {
  closeMenu();
});

function handleEscape(): void {
  menuModel.value = false;
  textFieldRef.value?.inputField?.focus();
}

function textKeyDown(e: KeyboardEvent): void {
  if (props.disabled || props.readonly) return;

  const key = e.key;

  if (key === 'Tab' || key === 'Escape') {
    closeMenu();
    emits('keyDown', key);
    return;
  }

  if (['ArrowUp', 'ArrowDown'].includes(key)) {
    e.preventDefault();
    if (!menuModel.value) openMenu();
    focusListWithKey(key);
    return;
  }

  if (key === 'Enter' || key === ' ') {
    e.preventDefault();
    toggleMenu();
    return;
  }

  emits('keyDown', key);
}

function txtFocused() {
  if (props.disabled || props.readonly) return;
  validate(modelValue.value);
}

function handleKeyList(event: KeyboardEvent): void {
  if (event.key === 'Escape') {
    handleEscape();
  }
}

defineExpose({
  focus: () => !(props.disabled || props.readonly) && nextTick(() => textFieldRef.value?.focus?.()),
  validate,
});
</script>

<style scoped>
.kun-select-field :deep(input) {
  cursor: pointer;
  caret-color: transparent;
  user-select: none;
}
</style>

