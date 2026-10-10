import { ref, computed, watch, nextTick, type Ref, type ComputedRef } from 'vue';
import { isObject, isArray, fullCopy } from '../../../../utils/utils.js';

export interface SelectPropsLike {
    itemTitle?: unknown;
    itemText?: unknown;
    itemValue?: string;
    returnObject?: boolean;
    multiple?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    closeOnSelect?: boolean;
    focusOnSelect?: boolean;
    clearOnSelect?: boolean;
    placeholder?: string;
    textNoItems?: string;
    placeholderText?: string;
}

export type SelectEmitEvent =
  | 'update:modelValue'
  | 'selectedItem'
  | 'createItem'
  | 'cleared';

export type SelectEmit = (event: SelectEmitEvent, value?: unknown) => void;

export interface SelectTextFieldExpose {
    inputField?: HTMLInputElement | null;
    focus?: () => void;
    focusWithKey?: (key: string) => void;
}

type RecordAny = Record<string, unknown>;

export function useSelect(
  props: SelectPropsLike,
  emits: SelectEmit,
  modelValue: Ref<unknown>,
  items: Ref<unknown[]>,
) {
  const selectedItem: Ref<unknown> = ref(props.multiple ? [] : null);
  const textFieldRef: Ref<SelectTextFieldExpose | null> = ref(null);
  const listRef: Ref<unknown> = ref(null);
  const menuModel = ref(false);

  const getArrayText = (item: unknown): string => {
    const titleKey = (props.itemTitle ?? props.itemText ?? textArr.value) as string | string[] | undefined;
    if (props.returnObject) return itemToString(item, titleKey, 'hasDefault');
    const resolved = resolveItem(item);
    return itemToString(resolved, titleKey, 'hasDefault');
  };

  function resolveItem(rawVal: unknown): unknown {
    if (isObject(rawVal)) return rawVal;
    const pool: unknown[] = items.value?.length ? items.value : (isArray(selectedItem.value) ? (selectedItem.value as unknown[]) : []);
    const found = pool.find((candidate: unknown) => {
      if (isObject(candidate)) return extractValueKey(candidate) === rawVal;
      return candidate === rawVal;
    });
    return found ?? rawVal;
  }

  /** Texto visible en el campo (solo single; en múltiple se muestran chips). */
  const displayText: ComputedRef<string> = computed(() => {
    if (props.multiple) return '';
    const sel = selectedItem.value;
    if (sel === null || sel === undefined || sel === '') return '';
    if (isObject(sel)) return itemToString(sel, props.itemTitle ?? props.itemText, 'hasDefault');
    const resolved = resolveItem(sel);
    if (isObject(resolved)) return itemToString(resolved, props.itemTitle ?? props.itemText, 'hasDefault');
    return (resolved as { toString?: () => string } | null | undefined)?.toString?.() ?? '';
  });

  const placeholder: ComputedRef<string> = computed(() => {
    if (props.placeholder) return props.placeholder;
    if (!items.value.length) return props.textNoItems as string;
    return props.placeholderText as string;
  });

  const textArr: ComputedRef<unknown> = computed(() => {
    const txt = props.itemText;

    if (typeof txt === 'string' && txt.includes(',')) {
      return txt.split(',');
    }

    return txt;
  });

  function itemToString(item: unknown, value?: unknown, hasDefault?: unknown): string {
    if (isObject(item)) {
      const rec = item as RecordAny;
      if (value) {
        if (isArray(value)) {
          return (value as unknown[]).map((i: unknown) => {
            const key = i as string;
            if (key.includes('.')) {
              const parts = key.split('.');
              let result: unknown = rec;
              for (const part of parts) {
                result = result != null ? (result as RecordAny)[part] : '';
              }
              return (result as string) ?? 'No definido';
            }
            return (rec[key] as string) ?? 'No definido';
          }).join(' - ');
        }
        if ((value as string).includes(',')) {
          return (value as string)
            .split(',')
            .map((i: string) => rec[i])
            .join(' - ') as string;
        }
        if ((value as string).includes('.')) {
          const parts = (value as string).split('.');
          let result: unknown = rec;
          for (const part of parts) {
            result = result != null ? (result as RecordAny)[part] : '';
          }
          return result as string;
        }
        if (!props.returnObject && typeof rec[value as string] === 'number') {
          return (rec[value as string] as number).toString();
        }

        if (rec[value as string] !== undefined && rec[value as string] !== null) {
          return (rec[value as string] as { toString(): string }).toString();
        }
        return '';
      }
      if (hasDefault) {
        return Object.values(rec)[0] as string;
      }
    }
    if (isArray(item)) {
      return (item as unknown[]).map((el: unknown) => itemToString(el, value, hasDefault)).join(' - ');
    }
    if (hasDefault && item !== null && item !== undefined && typeof item !== 'number' && typeof item !== 'object') {
      const str = item as string;
      if (str.includes(',')) {
        return str.split(',') as unknown as string;
      }
      return str;
    } else {
      return (item as { toString?: () => string } | null | undefined)?.toString?.() ?? '';
    }
  }

  function getSelectedItem(item: unknown): void {
    if (props.disabled || props.readonly || checkDisabled(item)) return;

    try {
      let updated: unknown = null;
      selectedItem.value = fullCopy(item);
      if (!props.multiple) {
        if (props.returnObject) {
          updated = fullCopy(item);
        } else {
          if (isObject(item)) {
            const rec = item as RecordAny;
            if (props.itemValue) {
              updated = rec[props.itemValue];
            } else {
              updated = Object.values(rec)[0];
            }
          } else {
            updated = item;
          }
        }
        if (props.closeOnSelect) menuModel.value = false;
        if (props.focusOnSelect) focusTextField();
      } else {
        if (!checkIfValueExist(item)) {
          const val = props.returnObject
            ? fullCopy(item)
            : isObject(item)
              ? props.itemValue
                ? (item as RecordAny)[props.itemValue]
                : Object.values(item as RecordAny)[0]
              : item;

          updated = [...((modelValue.value as unknown[]) || []), val];
        } else {
          if (item) removeFromArray(item);
          return;
        }
      }

      if (modelValue.value === updated) emits('update:modelValue', updated);
      else modelValue.value = updated;

      emits('selectedItem', selectedItem.value);
    } catch {
    } finally {
      if (props.clearOnSelect) {
        nextTick(() => clearSelection());
      }
    }
  }

  watch(
    [() => modelValue.value, () => items.value],
    ([model]: unknown[]) => {
      const newSelected = findItemByValue(model);
      if (JSON.stringify(selectedItem.value) !== JSON.stringify(newSelected)) {
        selectedItem.value = newSelected;
      }
    },
    { immediate: true },
  );

  function findItemByValue(value: unknown): unknown {
    if (value === undefined || value === null || value === '') {
      return props.multiple ? [] : null;
    }

    if (props.multiple && Array.isArray(value)) {
      if (props.returnObject) return value;
      return (value as unknown[]).map((val: unknown) => {
        if (isObject(val)) return val;
        const pool: unknown[] = items.value?.length ? items.value : (isArray(selectedItem.value) ? (selectedItem.value as unknown[]) : []);
        const found = pool.find((candidate: unknown) => {
          if (isObject(candidate)) return extractValueKey(candidate) === val;
          return candidate === val;
        });
        return found ?? val;
      });
    }

    if (props.returnObject) return value;

    const pool: unknown[] = items.value?.length ? items.value : (isArray(selectedItem.value) ? (selectedItem.value as unknown[]) : []);
    const item = pool.find((candidate: unknown) =>
      isObject(candidate) ? extractValueKey(candidate) === value : candidate === value,
    ) ?? value;

    return item;
  }

  function checkIfValueExist(value: unknown): boolean {
    if (!modelValue.value || !value) return false;

    const targetKey = extractValueKey(value);

    return (modelValue.value as unknown[]).some((selected: unknown) => {
      const selectedKey = extractValueKey(selected);
      return selectedKey === targetKey;
    });
  }

  function extractValueKey(item: unknown): unknown {
    if (!isObject(item)) {
      return item;
    }
    const rec = item as RecordAny;

    if (props.itemValue) {
      return rec[props.itemValue];
    }

    if ('id' in rec) {
      return rec.id;
    }

    const values = Object.values(rec);
    return values.length > 0 ? values[0] : item;
  }

  function removeFromArray(itemToRemove: unknown): void {
    if (!modelValue.value) return;

    const keyToRemove = extractValueKey(itemToRemove);

    modelValue.value = (modelValue.value as unknown[]).filter((currentItem: unknown) => {
      const currentKey = extractValueKey(currentItem);
      return currentKey !== keyToRemove;
    });
    selectedItem.value = findItemByValue(modelValue.value);
  }

  function openMenu(): void {
    if (props.disabled || props.readonly) return;
    if (!menuModel.value) menuModel.value = true;
  }

  function closeMenu(): void {
    if (menuModel.value) menuModel.value = false;
  }

  function toggleMenu(): void {
    if (props.disabled || props.readonly) return;
    menuModel.value = !menuModel.value;
  }

  function focusTextField(): void {
    textFieldRef.value?.inputField?.focus?.();
  }

  function focusListWithKey(key: string): void {
    (listRef.value as { focusWithKey?: (k: string) => void } | null | undefined)?.focusWithKey?.(key);
  }

  function createItem(): void {
    if (props.disabled || props.readonly) return;
    menuModel.value = false;
    emits('createItem');
  }

  function removeItem(item: unknown): void {
    if (props.disabled || props.readonly) return;
    if (!isArray(modelValue.value)) return;
    const arr = modelValue.value as unknown[];
    const keyToRemove = extractValueKey(item);
    const index = arr.findIndex((current: unknown) => extractValueKey(current) === keyToRemove);
    if (index === -1) return;
    arr.splice(index, 1);
    selectedItem.value = findItemByValue(modelValue.value);
  }

  function clearSelection(): void {
    if (props.disabled || props.readonly) return;

    modelValue.value = props.multiple ? [] : null;
    selectedItem.value = props.multiple ? [] : null;

    emits('cleared');
  }

  function checkDisabled(item: unknown): boolean {
    return (item as RecordAny)?.disabled ? true : false;
  }

  return {
    selectedItem, textFieldRef, listRef, menuModel,
    displayText, getArrayText, resolveItem,
    placeholder, textArr, itemToString, getSelectedItem,
    checkIfValueExist, extractValueKey, removeFromArray,
    openMenu, closeMenu, toggleMenu, focusTextField, focusListWithKey, createItem,
    removeItem, clearSelection, checkDisabled,
  };
}
