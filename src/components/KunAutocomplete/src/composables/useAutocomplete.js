import { ref, computed } from 'vue';
import { isObject, isArray } from '../../../../utils/utils.js'

export function useAutocomplete(props, emits, modelValue, items, itemsPerIntersection) {
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
                if (item[value]) return item[value].toString();
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
            if (!props.multiple) {
                if (props.returnObject) {
                    selectedItem.value = item;
                } else {
                    if (isObject(item)) {
                        if (props.itemValue) {
                            selectedItem.value = item[props.itemValue];
                        } else {
                            selectedItem.value = Object.values(item)[0];
                        }
                    } else {
                        selectedItem.value = item;
                    }
                }
                menuModel.value = false;
            } else {
                if (!selectedItem.value) {
                    selectedItem.value = [];
                }
                if (!checkIfValueExist(item)) {
                    if (props.returnObject) {
                        selectedItem.value.push(item);
                    } else {
                        if (isObject(item)) {
                            if (props.itemValue) {
                                selectedItem.value.push(item[props.itemValue]);
                            } else {
                                selectedItem.value.push(Object.values(item)[0]);
                            }
                        } else {
                            selectedItem.value.push(item);
                        }
                    }
                } else {
                    if (item) removeFromArray(item);
                }
            }
            emits('update:model-value', selectedItem.value);
            if (props.clearOnSelect) clearSelection();
        } catch (e) {
            console.log(e)
        } finally {
            focusTextField();
        }
    }

    function checkIfValueExist(value) {
        if (selectedItem.value === null) return false;
        if (!value) return true;

        return selectedItem.value.some((i) =>
            props.returnObject ?
                i[props.itemValue] === value[props.itemValue]
                : i === value[props.itemValue]
        );
    }

    function removeFromArray(value) {
        if (props.returnObject) {
            const item = selectedItem.value.find(
                (i) => i[props.itemValue] === value[props.itemValue]
            );
            const index = selectedItem.value.indexOf(item);
            selectedItem.value.splice(index, 1);
        } else {
            const index = selectedItem.value.indexOf(value[props.itemValue]);
            selectedItem.value.splice(index, 1);
        }
    }

    function lightReset(event) {
        props.clearSearchOnSelect ? (search.value = "") : "";
        props.focusOnSelect ? focusTextField() : "";
    }

    function openMenu() {
        if (!menuModel.value) menuModel.value = true;
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
        // Verificar si es una tecla alfanumérica
        if (isAlphanumeric(key) || key === "Backspace") {
            openMenu();
            focusTextField();
        }
    };

    // FUNCION PARA EMITIR EVENTO DE CREACION DE NUEVO ITEM
    function createItem() {
        menuModel.value = false;
        emits("createItem");
    }

    function removeItem(item) {
        let index = selectedItem.value.indexOf(item);
        selectedItem.value.splice(index, 1);
    }

    function clearSelection() {
        search.value = "";
        if (isArray(modelValue.value)) {
            selectedItem.value = [];
        }
        if (isObject(modelValue.value)) {
            selectedItem.value = null;
        }
        if (typeof modelValue.value === "number" && modelValue.value) {
            selectedItem.value = null;
        }
        if (typeof modelValue.value === "string" && modelValue.value) {
            selectedItem.value = null;
        }
        if (typeof modelValue.value == "boolean") {
            selectedItem.value = false;
        }
    }

    function checkDisabled(item) {
        return item.disabledItem ? true : false;
    }

    return {
        selectedItem, textFieldRef, listRef, menuModel, search, getItemText,
        placeholder, textArr, itemToString, getSelectedItem,
        checkIfValueExist, removeFromArray, lightReset, openMenu, toggleMenu, focusOnMenu, onMenuKeydown, createItem,
        removeItem, clearSelection, checkDisabled, isAlphanumeric,
    };
}