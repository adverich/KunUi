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

    function setSelectedItemValue() {
        if (isArray(modelValue.value)) {
            if (modelValue.value.length) {
                selectedItem.value = items.value.filter((i) => {
                    let itmText = getItemText(i, props.itemTitle);
                    return isObject(i)
                        ? modelValue.value.some((itm) =>
                            getItemText(itm, props.itemTitle).includes(itmText)
                        )
                        : modelValue.value.some((itm) => itm.includes(i))
                })
            } else {
                selectedItem.value = [];
            }
        }
        if (
            (isObject(modelValue.value) && Object.keys(modelValue.value).length) ||
            (typeof modelValue.value === "number" && modelValue.value) ||
            (typeof modelValue.value === "string" && modelValue.value) ||
            (typeof modelValue.value === "boolean")
        ) {
            selectedItem.value = items.value.find((i) =>
                isObject(i)
                    ? props.returnObject
                        ? props.itemValue
                            ? i[props.itemValue] === modelValue.value[props.itemValue]
                            : i[props.itemTitle] === modelValue.value[props.itemTitle]
                        : i[props.itemValue] === modelValue.value
                    : i === modelValue.value
            );
        }
    }

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

    // FILTRO DE ITEMS O DEVUELVE EL LISTADO COMPLETO SEGUN LA CANTIDAD DE ELEMENTOS A MOSTRAR
    const filteredItems = computed(() => {
        if (props.startEmtpy && search.value.length < 3) {
            return [];
        }
        let itemsFound = items.value.filter((item) => {
            if (isObject(item)) {
                const allKeys = Object.values(item).filter((i) => {
                    if (isObject(i)) return;
                    if (isArray(i)) return;
                    return i;
                });

                const getSelectedKeyValue = [item].reduce((acc, curr) => {
                    let result = props.searchableKeys.map((key) => {
                        if (key.includes(".")) {
                            const propsArr = key.split('.');
                            return propsArr.reduce((obj, prop) => {
                                return obj && obj[prop];  // Accede a la propiedad actual
                            }, curr);
                        }
                        return curr[key];
                    });
                    return result;
                }, []);

                const keys = props.searchableKeys.length ? getSelectedKeyValue : allKeys;
                return keys
                    ? keys.some((value) =>
                        value
                            ? value
                                .toString()
                                .toLowerCase()
                                .includes(search.value.toLowerCase())
                            : ""
                    )
                    : search.value
                        ? item == search.value
                        : item;
            }
            return item.toString().toLowerCase().includes(search.value.toLowerCase());
        });
        return itemsFound;
        // return itemsFound.slice(0, currentBatchStep.value);
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
        let result = item[0];

        if (!props.multiple) {
            selectedItem.value = item[0];
            if (props.returnObject) {
                modelValue.value = result;
            }
            if (!props.returnObject && isObject(result)) {
                if (props.itemValue) {
                    modelValue.value = result[props.itemValue];
                } else {
                    modelValue.value = Object.values(result)[0];
                }
            }
            if (!isObject(result)) {
                modelValue.value = result;
            }
            menuModel.value = false;
        } else {
            if (!selectedItem.value) {
                selectedItem.value = [];
            }
            if (!checkIfValueExist(result)) {
                if (props.returnObject) {
                    selectedItem.value.push(result);
                }
                if (!props.returnObject && isObject(result)) {
                    if (props.itemValue) {
                        selectedItem.value.push(result[props.itemValue]);
                    } else {
                        modelValue.value = selectedItem.value.push(Object.values(result)[0]);
                        return;
                    }
                }
                modelValue.value = selectedItem.value;
            } else {
                if (result) removeFromArray(result);
                modelValue.value = selectedItem.value;
            }
        }
        if (props.clearOnSelect) {
            clearSelection()
        };
        focusTextField();
    }

    function checkIfValueExist(result) {
        if (selectedItem.value === null) return false;
        if (!result) return true;

        return selectedItem.value.some((i) =>
            props.returnObject ?
                i[props.itemValue] === result[props.itemValue]
                : i === result[props.itemValue]
        );
    }

    function removeFromArray(result) {
        if (props.returnObject) {
            let item = selectedItem.value.find(
                (i) => i[props.itemValue] === result[props.itemValue]
            );
            let index = selectedItem.value.indexOf(item);
            selectedItem.value.splice(index, 1);
        } else {
            let index = selectedItem.value.indexOf(result[props.itemValue]);
            selectedItem.value.splice(index, 1);
        }
    }

    function lightReset() {
        props.clearSearchOnSelect ? (search.value = "") : "";
        props.focusOnSelect ? focusTextField() : "";
    }

    function openMenu() {
        // if (!menuModel.value) menuModel.value = true;
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
        modelValue.value = selectedItem.value;
    }

    function clearSelection() {
        search.value = "";
        if (isArray(modelValue.value)) {
            selectedItem.value = [];
        }
        if (isObject(modelValue.value)) {
            selectedItem.value = {};
        }
        if (typeof modelValue.value === "number" && modelValue.value) {
            selectedItem.value = null;
        }
        if (typeof modelValue.value === "string" && modelValue.value) {
            selectedItem.value = '';
        }
        if (typeof modelValue.value == "boolean") {
            selectedItem.value = false;
        }
        modelValue.value = selectedItem.value;
    }

    function checkDisabled(item) {
        if (!item.disabledItem) return false;
        if (item.disabledItem) return true;
    }

    return {
        selectedItem, textFieldRef, listRef, menuModel, search, getItemText,
        setSelectedItemValue, placeholder, filteredItems, textArr, itemToString, getSelectedItem,
        checkIfValueExist, removeFromArray, lightReset, openMenu, focusOnMenu, onMenuKeydown, createItem,
        removeItem, clearSelection, checkDisabled, isAlphanumeric,
    };
}