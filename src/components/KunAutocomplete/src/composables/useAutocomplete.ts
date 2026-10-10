import { ref, computed, watch, nextTick, type Ref, type ComputedRef } from 'vue';
import { isObject, isArray, fullCopy } from '../../../../utils/utils.js'

export interface AutocompletePropsLike {
    itemTitle?: unknown;
    itemText?: unknown;
    itemValue?: string;
    returnObject?: boolean;
    multiple?: boolean;
    disabled?: boolean;
    clearSearchOnSelect?: boolean;
    clearOnSelect?: boolean;
    focusOnSelect?: boolean;
    placeholderText?: string;
    textNoItems?: string;
}

export type AutocompleteEmitEvent =
  | 'update:modelValue'
  | 'selectedItem'
  | 'createItem'
  | 'cleared';

export type AutocompleteEmit = (event: AutocompleteEmitEvent, value?: unknown) => void;

export interface AutocompleteTextFieldExpose {
    inputField?: HTMLInputElement | null;
    $el?: HTMLElement | null;
    focus?: () => void;
    focusWithKey?: (key: string) => void;
}

type RecordAny = Record<string, unknown>;

export function useAutocomplete(
    props: AutocompletePropsLike,
    emits: AutocompleteEmit,
    modelValue: Ref<unknown>,
    items: Ref<unknown[]>,
) {
    const selectedItem: Ref<unknown> = ref(null);
    const textFieldRef: Ref<AutocompleteTextFieldExpose | null> = ref(null);
    const listRef: Ref<unknown> = ref(null);
    const menuModel = ref(false);
    const search = ref("");

    const getArrayText = (item: unknown): string => {
        const titleKey = (props.itemTitle ?? props.itemText ?? textArr.value) as string | string[] | undefined;
        if (props.returnObject) return itemToString(item, titleKey, "hasDefault");
        const resolved = resolveItem(item);
        return itemToString(resolved, titleKey, "hasDefault");
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

    const placeholder: ComputedRef<string> = computed(() => {
        if (selectedItem.value !== null && selectedItem.value !== undefined) {
            if (isArray(selectedItem.value)) {
                // En múltiple los valores ya se muestran como chips: jamás eco como placeholder
                // (evita "valores fantasma" de fondo al deseleccionar todo).
                return props.placeholderText as string;
            }
            if (isObject(selectedItem.value)) {
                return itemToString(selectedItem.value, props.itemTitle, "hasDefault");
            }
            return String(selectedItem.value);
        }
        return !items.value.length ? (props.textNoItems as string) : (props.placeholderText as string);
    });

    const textArr: ComputedRef<unknown> = computed(() => {
        const txt = props.itemText;

        if (typeof txt === 'string' && txt.includes(",")) {
            return txt.split(",");
        }

        return txt;
    });

    function itemToString(item: unknown, value?: unknown, hasDefault?: unknown): string {
        if (isObject(item)) {
            const rec = item as RecordAny;
            if (value) {
                // Verificamos si tiene texto configurado
                if (isArray(value)) {
                    // Verificamos si el texto es un array de strings
                    return (value as unknown[]).map((i: unknown) => {
                        const key = i as string;
                        if (key.includes(".")) {
                            const parts = key.split(".");
                            let result: unknown = rec;
                            for (const part of parts) {
                                result = result != null ? (result as RecordAny)[part] : '';
                            }
                            return (result as string) ?? "No definido";
                        }
                        return (rec[key] as string) ?? "No definido";
                    }).join(" - ");
                }
                if ((value as string).includes(",")) {
                    // Verificamos si el texto es un string separado por comas
                    return (value as string)
                        .split(",")
                        .map((i: string) => rec[i])
                        .join(" - ") as string;
                }
                if ((value as string).includes(".")) {
                    // Verificamos si el texto es un string separado por puntos
                    const parts = (value as string).split(".");
                    let result: unknown = rec;
                    for (const part of parts) {
                        result = result != null ? (result as RecordAny)[part] : '';
                    }
                    return result as string;
                }
                if (!props.returnObject && typeof rec[value as string] === "number") {
                    return (rec[value as string] as number).toString();
                }

                if (rec[value as string] !== undefined && rec[value as string] !== null) {
                    return (rec[value as string] as { toString(): string }).toString();
                }
                return "";
            }
            if (hasDefault) {
                return Object.values(rec)[0] as string;
            }
        }
        if (isArray(item)) {
            return (item as unknown[]).map((el: unknown) => itemToString(el, value, hasDefault)).join(" - ");
        }
        if (hasDefault && item !== null && item !== undefined && typeof item !== "number" && typeof item !== "object") {
            const str = item as string;
            if (str.includes(",")) {
                return str.split(",") as unknown as string;
            }
            return str;
        } else {
            return (item as { toString?: () => string } | null | undefined)?.toString?.() ?? '';
        }
    }

    function getSelectedItem(item: unknown): void {
        if (props.disabled || checkDisabled(item)) return;

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
                menuModel.value = false;
                focusTextField();
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
        ([model]: unknown[]) => {
            const newSelected = findItemByValue(model);
            if (JSON.stringify(selectedItem.value) !== JSON.stringify(newSelected)) {
                selectedItem.value = newSelected;
            }
        },
        { immediate: true }
    );

    function findItemByValue(value: unknown): unknown {
        if (value === undefined || value === null) return null;

        // Si es múltiple, buscar cada objeto en items (opción 4: mostrar el primitivo si aún no resuelve)
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

        // Si es un objeto
        if (props.returnObject) return value;

        // Single value: buscar en items el objeto cuya clave coincida con value
        const pool: unknown[] = items.value?.length ? items.value : (isArray(selectedItem.value) ? (selectedItem.value as unknown[]) : []);
        const item = pool.find((candidate: unknown) =>
            isObject(candidate) ? extractValueKey(candidate) === value : candidate === value
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

    // Dentro de useAutocomplete.ts
    function extractValueKey(item: unknown): unknown {
        if (!isObject(item)) {
            return item; // ya es primitivo
        }
        const rec = item as RecordAny;

        // Si itemValue está definido, úsalo
        if (props.itemValue) {
            return rec[props.itemValue];
        }

        if ('id' in rec) {
            return rec.id;
        }

        // Primer valor como fallback
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
        // Sincronización explícita para no dejar selección fantasma.
        selectedItem.value = findItemByValue(modelValue.value);
    }

    function lightReset(event?: Event): void {
        props.clearSearchOnSelect ? (search.value = "") : "";
        if (props.clearOnSelect) clearSelection();
        props.focusOnSelect ? focusTextField() : "";
    }

    function openMenu(): void {
        if (props.disabled) return;
        if (!menuModel.value) menuModel.value = true;
    }

    function closeMenu(): void {
        if (menuModel.value) menuModel.value = false;
    }

    function toggleMenu(): void {
        if (props.disabled) return;
        menuModel.value = !menuModel.value;
    }

    function isAlphanumeric(key: string): boolean | RegExpMatchArray | null {
        return key.length === 1 && key.match(/\w/);
    }

    function focusTextField(): void {
        textFieldRef.value?.inputField?.focus();
    }

    function focusListWithKey(key: string): void {
        (listRef.value as { focusWithKey?: (k: string) => void } | null | undefined)?.focusWithKey?.(key);
    }

    function focusOnMenu(): void {
        menuModel.value = true;
        if (!listRef.value) return;
        textFieldRef.value?.$el && (textFieldRef.value.$el as HTMLElement).focus();
    }

    function onMenuKeydown(event: KeyboardEvent): void {
        if (props.disabled) return;
        const key = event.key;
        if (isAlphanumeric(key) || key === "Backspace") {
            openMenu();
            focusTextField();

            nextTick(() => {
                const inputEl = textFieldRef.value?.inputField;
                if (inputEl) {
                    const start = inputEl.selectionStart ?? 0;
                    const end = inputEl.selectionEnd ?? 0;
                    const text = inputEl.value;

                    const newChar = event.key.length === 1 ? event.key : ''; // solo insertamos caracteres imprimibles

                    inputEl.value = text.slice(0, start) + newChar + text.slice(end);
                    inputEl.selectionStart = inputEl.selectionEnd = start + newChar.length;

                    // Opcional: emitir evento input si usás v-model con listeners
                    inputEl.dispatchEvent(new Event('input', { bubbles: true }));
                }
            });
        }
    }

    // FUNCION PARA EMITIR EVENTO DE CREACION DE NUEVO ITEM
    function createItem(): void {
        if (props.disabled) return;
        menuModel.value = false;
        emits("createItem");
    }

    function removeItem(item: unknown): void {
        if (props.disabled) return;
        if (!isArray(modelValue.value)) return;
        const arr = modelValue.value as unknown[];
        const index = arr.indexOf(item);
        if (index === -1) return;
        arr.splice(index, 1);
        // Sincronización explícita: el watcher también lo hace, pero así no quedan
        // valores fantasma si la mutación in-place no dispara el watch a tiempo.
        selectedItem.value = findItemByValue(modelValue.value);
    }

    function clearSelection(): void {
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

    function checkDisabled(item: unknown): boolean {
        return (item as RecordAny)?.disabled ? true : false;
    }

    return {
        selectedItem, textFieldRef, listRef, menuModel, search, getArrayText, resolveItem,
        placeholder, textArr, itemToString, getSelectedItem,
        checkIfValueExist, extractValueKey, removeFromArray, lightReset, openMenu, closeMenu, toggleMenu, focusOnMenu, focusListWithKey, onMenuKeydown, createItem,
        removeItem, clearSelection, checkDisabled, isAlphanumeric,
    };
}
