import { ref, computed, watch, nextTick } from 'vue';
import { isObject, isArray, fullCopy } from '../../../../utils/utils.js'

export function useAutocomplete(props, emits, modelValue, items) {
    const selectedItem = ref(null);
    const textFieldRef = ref(null);
    const listRef = ref(null);
    const menuModel = ref(false);
    const search = ref("");

    const getItemText = (obj, string) => {
        return string.split('.').reduce((acc, key) => {
            return acc && acc[key] !== undefined ? acc[key] : null;
        }, obj);
    };

    const placeholder = computed(() => {
        if (selectedItem.value) {
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
        if (props.itemText.includes(",")) {
            return props.itemText.split(",");
        }
        return props.itemText;
    });

    function itemToString(item, value, hasDefault) {
        if (isObject(item)) {
            if (value) {
                // Verificamos si tiene texto configurado
                if (isArray(value)) {
                    // Verificamos si el texto es un array de strings
                    return value.map((i) => item[i] ?? 'No definido').join(" - ");
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
                        result = result[part]
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
            if (!props.returnObject) {
                return item.map((i) => i).join(" - ");
            }
            return item.map((i) => i[value]).join(" - ");
        }
        if (hasDefault && typeof item !== "number") {
            if (item.includes(",")) {
                return item.split(",");
            }
            return item;
        } else {
            return item;
        }
    }

    function getSelectedItem(item) {
        try {
            let updated = null;
            selectedItem.value = fullCopy(item);
            if (!props.multiple) {
                if (props.returnObject) {
                    updated = item;
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
            } else {
                if (!checkIfValueExist(item)) {
                    const val = props.returnObject
                        ? item
                        : isObject(item)
                            ? props.itemValue
                                ? item[props.itemValue]
                                : Object.values(item)[0]
                            : item;

                    updated = [...(modelValue.value || []), val];
                } else {
                    if (item) removeFromArray(item);
                }
            }
            if (modelValue.value !== updated) {
                console.log('a');
                modelValue.value = updated;
            }
            // emits('update:modelValue', updated);
            emits('selectedItem', selectedItem.value);
            // setValue();
        } catch (e) {
            console.log(e)
        } finally {
            lightReset();
            focusTextField();
        }
    }

    watch(() => items.value, () => {
        selectedItem.value = findItemByValue(modelValue.value);
    }, { immediate: true });

    function findItemByValue(value) {
        if (value === undefined || value === null) return null;
        // Si es un objeto
        if (props.returnObject) return value;

        // Si es múltiple, buscar cada objeto en items
        if (props.multiple && Array.isArray(value)) return value.map(val => items.value.find(item => item[props.itemValue] === val)).filter(Boolean);

        // Single value: buscar en items el objeto cuyo itemValue coincida con value
        const item = items.value.find(item => item[props.itemValue] === value) || null;
        return item;
    }

    function checkIfValueExist(value) {
        if (modelValue.value === null) return false;
        if (!value) return true;

        return modelValue.value.some((i) =>
            props.returnObject ?
                i[props.itemValue] === value[props.itemValue]
                : i === value[props.itemValue]
        );
    }

    function removeFromArray(value) {
        let updated = modelValue.value;
        if (props.returnObject) {
            const item = updated.find(
                (i) => i[props.itemValue] === value[props.itemValue]
            );
            const index = updated.indexOf(item);
            updated.splice(index, 1);
        } else {
            const index = updated.indexOf(value[props.itemValue]);
            updated.splice(index, 1);
        }
        // emits('update:modelValue', updated);
    }

    function lightReset(event) {
        props.clearSearchOnSelect ? (search.value = "") : "";
        if (props.clearOnSelect) clearSelection();
        props.focusOnSelect ? focusTextField() : "";
    }

    function openMenu() {
        if (!menuModel.value) menuModel.value = true;
    }

    function closeMenu() {
        if (menuModel.value) menuModel.value = false;
    }

    function toggleMenu() {
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
        menuModel.value = false;
        emits("createItem");
    }

    function removeItem(item) {
        let index = modelValue.value.indexOf(item);
        modelValue.value.splice(index, 1);
    }

    function clearSelection() {
        if (search.value !== "") search.value = "";

        if (modelValue.value !== null) {
            modelValue.value = null;
        }

        if (selectedItem.value !== null) {
            selectedItem.value = null;
        }
        // if (isArray(modelValue.value)) {
        //     selectedItem.value = [];
        // }
        // if (isObject(modelValue.value)) {
        //     selectedItem.value = null;
        // }
        // if (typeof modelValue.value === "number" && modelValue.value) {
        //     selectedItem.value = null;
        // }
        // if (typeof modelValue.value === "string" && modelValue.value) {
        //     selectedItem.value = null;
        // }
        // if (typeof modelValue.value == "boolean") {
        //     selectedItem.value = false;
        // }
    }

    function checkDisabled(item) {
        return item.disabled ? true : false;
    }

    return {
        selectedItem, textFieldRef, listRef, menuModel, search, getItemText,
        placeholder, textArr, itemToString, getSelectedItem,
        checkIfValueExist, removeFromArray, lightReset, openMenu, closeMenu, toggleMenu, focusOnMenu, onMenuKeydown, createItem,
        removeItem, clearSelection, checkDisabled, isAlphanumeric,
    };
}