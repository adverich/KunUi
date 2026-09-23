import { ref, computed, watch, nextTick } from 'vue';
import { isObject, isArray, fullCopy } from '../../../../utils/utils.js'

export function useAutocomplete(props, emits, modelValue, items) {
    const selectedItem = ref(null);
    const textFieldRef = ref(null);
    const listRef = ref(null);
    const menuModel = ref(false);
    const search = ref("");

    const getArrayText = (item) => {
        const titleKey = props.itemTitle ?? props.itemText ?? textArr.value;
        if (props.returnObject) return itemToString(item, titleKey, "hasDefault");
        const resolved = resolveItem(item);
        return itemToString(resolved, titleKey, "hasDefault");
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

    const placeholder = computed(() => {
        if (selectedItem.value !== null && selectedItem.value !== undefined) {
            if (isArray(selectedItem.value)) {
                if (selectedItem.value.length) {
                    return itemToString(selectedItem.value, props.itemTitle, "hasDefault");
                }
                return props.placeholderText;
            }
            if (isObject(selectedItem.value)) {
                return itemToString(selectedItem.value, props.itemTitle, "hasDefault");
            }
            return selectedItem.value.toString();
        }
        return !items.value.length ? props.textNoItems : props.placeholderText;
    });

    const textArr = computed(() => {
        const txt = props.itemText;

        if (typeof txt === 'string' && txt.includes(",")) {
            return txt.split(",");
        }

        return txt;
    });

    function itemToString(item, value, hasDefault) {
        if (isObject(item)) {
            if (value) {
                // Verificamos si tiene texto configurado
                if (isArray(value)) {
                    // Verificamos si el texto es un array de strings
                    return value.map((i) => {
                        if (i.includes(".")) {
                            const parts = i.split(".");
                            let result = item;
                            for (const part of parts) {
                                result = result != null ? result[part] : '';
                            }
                            return result ?? "No definido";
                        }
                        return item[i] ?? "No definido";
                    }).join(" - ");
                }
                if (value.includes(",")) {
                    // Verificamos si el texto es un string separado por comas
                    return value
                        .split(",")
                        .map((i) => item[i])
                        .join(" - ");
                }
                if (value.includes(".")) {
                    // Verificamos si el texto es un string separado por puntos
                    const parts = value.split(".");
                    let result = item;
                    for (const part of parts) {
                        result = result != null ? result[part] : '';
                    }
                    return result;
                }
                if (!props.returnObject && typeof item[value] === "number") {
                    return item[value].toString();
                }

                if (item[value] !== undefined && item[value] !== null) {
                    return item[value].toString();
                }
                return "";
            }
            if (hasDefault) {
                return Object.values(item)[0];
            }
        }
        if (isArray(item)) {
            return item.map((el) => itemToString(el, value, hasDefault)).join(" - ");
        }
        if (hasDefault && item !== null && item !== undefined && typeof item !== "number" && typeof item !== "object") {
            if (item.includes(",")) {
                return item.split(",");
            }
            return item;
        } else {
            return item?.toString?.() ?? '';
        }
    }

    function getSelectedItem(item) {
        if (props.disabled || checkDisabled(item)) return;

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
                menuModel.value = false;
                focusTextField();
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

            if (modelValue.value === updated) emits("update:modelValue", updated)
            else modelValue.value = updated;

            emits('selectedItem', selectedItem.value);
        } catch {
        } finally {
            nextTick(() => {
                lightReset();
            });
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
        { immediate: true }
    );

    function findItemByValue(value) {
        if (value === undefined || value === null) return null;

        // Si es múltiple, buscar cada objeto en items (opción 4: mostrar el primitivo si aún no resuelve)
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

        // Si es un objeto
        if (props.returnObject) return value;

        // Single value: buscar en items el objeto cuya clave coincida con value
        const pool = items.value?.length ? items.value : (isArray(selectedItem.value) ? selectedItem.value : []);
        const item = pool.find((candidate) =>
            isObject(candidate) ? extractValueKey(candidate) === value : candidate === value
        ) ?? value;

        return item;
    }

    function checkIfValueExist(value) {
        if (!modelValue.value || !value) return false;

        const targetKey = extractValueKey(value);

        return modelValue.value.some(selected => {
            const selectedKey = extractValueKey(selected);
            return selectedKey === targetKey;
        });
    }

    // Dentro de useAutocomplete.js
    function extractValueKey(item) {
        if (!isObject(item)) {
            return item; // ya es primitivo
        }

        // Si itemValue está definido, úsalo
        if (props.itemValue) {
            return item[props.itemValue];
        }

        if ('id' in item) {
            return item.id;
        }

        // Primer valor como fallback
        const values = Object.values(item);
        return values.length > 0 ? values[0] : item;
    }

    function removeFromArray(itemToRemove) {
        if (!modelValue.value) return;

        const keyToRemove = extractValueKey(itemToRemove);

        modelValue.value = modelValue.value.filter(currentItem => {
            const currentKey = extractValueKey(currentItem);
            return currentKey !== keyToRemove;
        });
    }

    function lightReset(event) {
        props.clearSearchOnSelect ? (search.value = "") : "";
        if (props.clearOnSelect) clearSelection();
        props.focusOnSelect ? focusTextField() : "";
    }

    function openMenu() {
        if (props.disabled) return;
        if (!menuModel.value) menuModel.value = true;
    }

    function closeMenu() {
        if (menuModel.value) menuModel.value = false;
    }

    function toggleMenu() {
        if (props.disabled) return;
        menuModel.value = !menuModel.value;
    }

    function isAlphanumeric(key) {
        return key.length === 1 && key.match(/\w/);
    }

    function focusTextField() {
        textFieldRef.value.inputField.focus();
    }

    function focusOnMenu() {
        menuModel.value = true;
        if (!listRef.value) return;
        textFieldRef.value.$el.focus();
    }

    function onMenuKeydown(event) {
        if (props.disabled) return;
        const key = event.key;
        if (isAlphanumeric(key) || key === "Backspace") {
            openMenu();
            focusTextField();

            nextTick(() => {
                const inputEl = textFieldRef.value?.inputField;
                if (inputEl) {
                    const start = inputEl.selectionStart;
                    const end = inputEl.selectionEnd;
                    const text = inputEl.value;

                    const newChar = event.key.length === 1 ? event.key : ''; // solo insertamos caracteres imprimibles

                    inputEl.value = text.slice(0, start) + newChar + text.slice(end);
                    inputEl.selectionStart = inputEl.selectionEnd = start + newChar.length;

                    // Opcional: emitir evento input si usás v-model con listeners
                    inputEl.dispatchEvent(new Event('input', { bubbles: true }));
                }
            });
        }
    };

    // FUNCION PARA EMITIR EVENTO DE CREACION DE NUEVO ITEM
    function createItem() {
        if (props.disabled) return;
        menuModel.value = false;
        emits("createItem");
    }

    function removeItem(item) {
        if (props.disabled) return;
        let index = modelValue.value.indexOf(item);
        modelValue.value.splice(index, 1);
    }

    function clearSelection() {
        if (props.disabled) return;
        if (search.value !== "") search.value = "";

        if (modelValue.value !== null) {
            modelValue.value = null;
        }

        if (selectedItem.value !== null) {
            selectedItem.value = null;
        }

        emits("cleared");
    }

    function checkDisabled(item) {
        return item.disabled ? true : false;
    }

    return {
        selectedItem, textFieldRef, listRef, menuModel, search, getArrayText, resolveItem,
        placeholder, textArr, itemToString, getSelectedItem,
        checkIfValueExist, removeFromArray, lightReset, openMenu, closeMenu, toggleMenu, focusOnMenu, onMenuKeydown, createItem,
        removeItem, clearSelection, checkDisabled, isAlphanumeric,
    };
}
