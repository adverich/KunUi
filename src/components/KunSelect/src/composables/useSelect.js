import { ref, computed, watch, nextTick } from 'vue';
import { isObject, isArray, fullCopy } from '../../../../utils/utils.js';

export function useSelect(props, emits, modelValue, items) {
  const selectedItem = ref(props.multiple ? [] : null);
  const textFieldRef = ref(null);
  const listRef = ref(null);
  const menuModel = ref(false);

  const getArrayText = (item) => {
    const titleKey = props.itemTitle ?? props.itemText ?? textArr.value;
    if (props.returnObject) return itemToString(item, titleKey, 'hasDefault');
    const resolved = resolveItem(item);
    return itemToString(resolved, titleKey, 'hasDefault');
  };

  function resolveItem(rawVal) {
    if (isObject(rawVal)) return rawVal;
    const pool = items.value?.length ? items.value : (isArray(selectedItem.value) ? selectedItem.value : []);
    const found = pool.find((candidate) => {
      if (isObject(candidate)) return extractValueKey(candidate) === rawVal;
      return candidate === rawVal;
    });
    return found ?? rawVal;
  }

  /** Texto visible en el campo (solo single; en múltiple se muestran chips). */
  const displayText = computed(() => {
    if (props.multiple) return '';
    const sel = selectedItem.value;
    if (sel === null || sel === undefined || sel === '') return '';
    if (isObject(sel)) return itemToString(sel, props.itemTitle ?? props.itemText, 'hasDefault');
    const resolved = resolveItem(sel);
    if (isObject(resolved)) return itemToString(resolved, props.itemTitle ?? props.itemText, 'hasDefault');
    return resolved?.toString?.() ?? '';
  });

  const placeholder = computed(() => {
    if (props.placeholder) return props.placeholder;
    if (!items.value.length) return props.textNoItems;
    return props.placeholderText;
  });

  const textArr = computed(() => {
    const txt = props.itemText;

    if (typeof txt === 'string' && txt.includes(',')) {
      return txt.split(',');
    }

    return txt;
  });

  function itemToString(item, value, hasDefault) {
    if (isObject(item)) {
      if (value) {
        if (isArray(value)) {
          return value.map((i) => {
            if (i.includes('.')) {
              const parts = i.split('.');
              let result = item;
              for (const part of parts) {
                result = result != null ? result[part] : '';
              }
              return result ?? 'No definido';
            }
            return item[i] ?? 'No definido';
          }).join(' - ');
        }
        if (value.includes(',')) {
          return value
            .split(',')
            .map((i) => item[i])
            .join(' - ');
        }
        if (value.includes('.')) {
          const parts = value.split('.');
          let result = item;
          for (const part of parts) {
            result = result != null ? result[part] : '';
          }
          return result;
        }
        if (!props.returnObject && typeof item[value] === 'number') {
          return item[value].toString();
        }

        if (item[value] !== undefined && item[value] !== null) {
          return item[value].toString();
        }
        return '';
      }
      if (hasDefault) {
        return Object.values(item)[0];
      }
    }
    if (isArray(item)) {
      return item.map((el) => itemToString(el, value, hasDefault)).join(' - ');
    }
    if (hasDefault && item !== null && item !== undefined && typeof item !== 'number' && typeof item !== 'object') {
      if (item.includes(',')) {
        return item.split(',');
      }
      return item;
    } else {
      return item?.toString?.() ?? '';
    }
  }

  function getSelectedItem(item) {
    if (props.disabled || props.readonly || checkDisabled(item)) return;

    try {
      let updated = null;
      selectedItem.value = fullCopy(item);
      if (!props.multiple) {
        if (props.returnObject) {
          updated = fullCopy(item);
        } else {
          if (isObject(item)) {
            if (props.itemValue) {
              updated = item[props.itemValue];
            } else {
              updated = Object.values(item)[0];
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
                ? item[props.itemValue]
                : Object.values(item)[0]
              : item;

          updated = [...(modelValue.value || []), val];
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
    ([model]) => {
      const newSelected = findItemByValue(model);
      if (JSON.stringify(selectedItem.value) !== JSON.stringify(newSelected)) {
        selectedItem.value = newSelected;
      }
    },
    { immediate: true },
  );

  function findItemByValue(value) {
    if (value === undefined || value === null || value === '') {
      return props.multiple ? [] : null;
    }

    if (props.multiple && Array.isArray(value)) {
      if (props.returnObject) return value;
      return value.map((val) => {
        if (isObject(val)) return val;
        const pool = items.value?.length ? items.value : (isArray(selectedItem.value) ? selectedItem.value : []);
        const found = pool.find((candidate) => {
          if (isObject(candidate)) return extractValueKey(candidate) === val;
          return candidate === val;
        });
        return found ?? val;
      });
    }

    if (props.returnObject) return value;

    const pool = items.value?.length ? items.value : (isArray(selectedItem.value) ? selectedItem.value : []);
    const item = pool.find((candidate) =>
      isObject(candidate) ? extractValueKey(candidate) === value : candidate === value,
    ) ?? value;

    return item;
  }

  function checkIfValueExist(value) {
    if (!modelValue.value || !value) return false;

    const targetKey = extractValueKey(value);

    return modelValue.value.some((selected) => {
      const selectedKey = extractValueKey(selected);
      return selectedKey === targetKey;
    });
  }

  function extractValueKey(item) {
    if (!isObject(item)) {
      return item;
    }

    if (props.itemValue) {
      return item[props.itemValue];
    }

    if ('id' in item) {
      return item.id;
    }

    const values = Object.values(item);
    return values.length > 0 ? values[0] : item;
  }

  function removeFromArray(itemToRemove) {
    if (!modelValue.value) return;

    const keyToRemove = extractValueKey(itemToRemove);

    modelValue.value = modelValue.value.filter((currentItem) => {
      const currentKey = extractValueKey(currentItem);
      return currentKey !== keyToRemove;
    });
    selectedItem.value = findItemByValue(modelValue.value);
  }

  function openMenu() {
    if (props.disabled || props.readonly) return;
    if (!menuModel.value) menuModel.value = true;
  }

  function closeMenu() {
    if (menuModel.value) menuModel.value = false;
  }

  function toggleMenu() {
    if (props.disabled || props.readonly) return;
    menuModel.value = !menuModel.value;
  }

  function focusTextField() {
    textFieldRef.value?.inputField?.focus?.();
  }

  function createItem() {
    if (props.disabled || props.readonly) return;
    menuModel.value = false;
    emits('createItem');
  }

  function removeItem(item) {
    if (props.disabled || props.readonly) return;
    if (!isArray(modelValue.value)) return;
    const keyToRemove = extractValueKey(item);
    const index = modelValue.value.findIndex((current) => extractValueKey(current) === keyToRemove);
    if (index === -1) return;
    modelValue.value.splice(index, 1);
    selectedItem.value = findItemByValue(modelValue.value);
  }

  function clearSelection() {
    if (props.disabled || props.readonly) return;

    modelValue.value = props.multiple ? [] : null;
    selectedItem.value = props.multiple ? [] : null;

    emits('cleared');
  }

  function checkDisabled(item) {
    return item?.disabled ? true : false;
  }

  return {
    selectedItem, textFieldRef, listRef, menuModel,
    displayText, getArrayText, resolveItem,
    placeholder, textArr, itemToString, getSelectedItem,
    checkIfValueExist, extractValueKey, removeFromArray,
    openMenu, closeMenu, toggleMenu, focusTextField, createItem,
    removeItem, clearSelection, checkDisabled,
  };
}
