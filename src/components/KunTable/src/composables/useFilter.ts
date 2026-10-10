// useFilter.ts
import { computed, reactive, watch, ref, unref, type Ref, type ComputedRef } from 'vue'
import { debounce } from '../../../../utils/utils.js'
import { getValue, formatValue, type KunTableHeader } from '@/utils/tableFormatters.js'
import type { TableItem } from './useRowKey.js'

export interface FilterPropsLike {
    items?: unknown;
    customFilter?: unknown;
    searchableKeys?: unknown;
    headers?: unknown;
    filters?: unknown;
}

export interface FilterDefinition {
    value: string;
    [key: string]: unknown;
}

/**
 * Composable para lógica de filtrado avanzado.
 * Características:
 * - Búsqueda global (en todas las columnas searchables).
 * - Búsqueda por columna específica.
 * - Cache de valores stringificados para optimizar performance en tablas grandes.
 * - Debounce en inputs de búsqueda.
 */
export default function useFilter(
    props: FilterPropsLike,
    debounceTime: number | Ref<number> | ComputedRef<number>,
    resolvedHeaders: Ref<KunTableHeader[]> | ComputedRef<KunTableHeader[]>,
    debug = false,
) {
    // Estado reactivo de filtros aplicados
    const appliedFilters = reactive({
        search: '', // Búsqueda global
        byColumn: {} as Record<string, unknown>, // Mapa columna -> valor
    })

    const { items, customFilter, searchableKeys, headers } = props
    const modalFilter = ref(false) // Control del modal de filtros avanzados

    // --- Helpers de Stringificación ---
    // Convierte cualquier valor a string para comparaciones de texto
    const toSearchableString = (v: unknown): string => {
        if (v == null) return ''
        if (typeof v === 'string') return v
        if (typeof v === 'number' || typeof v === 'boolean') return String(v)
        if (v instanceof Date) return v.toISOString()
        if (typeof v === 'object') {
            const rec = v as Record<string, unknown>;
            if ('label' in rec) return String(rec.label) // Soporte para objetos tipo {id, label}
            if ('name' in rec) return String(rec.name)
            try { return String(v) } catch { return '' }
        }
        try { return String(v) } catch { return '' }
    }

    // Predicado de filtrado por defecto (case insensitive includes)
    // Usado para búsqueda global (search bar) donde se espera match parcial
    const defaultFilterFn = (itemValue: unknown, filterValue: unknown): boolean => {
        const a = toSearchableString(itemValue).toLowerCase()
        const b = toSearchableString(filterValue).toLowerCase()
        if (!b) return true // Si no hay filtro, pasa
        if (!a) return false // Si hay filtro y no valor, falla
        return a.includes(b)
    }

    // Predicado de filtrado por match exacto (case insensitive)
    // Usado para filtros por columna (KunAutocomplete) donde se espera match exacto
    const exactMatchFilter = (itemValue: unknown, filterValue: unknown): boolean => {
        const a = toSearchableString(itemValue).toLowerCase()
        const b = toSearchableString(filterValue).toLowerCase()
        if (!b) return true // Si no hay filtro, pasa
        return a === b
    }

    // --- Configuración de Headers y Keys ---
    const headersRef = computed(() => resolvedHeaders.value ?? [])

    // Determina qué columnas son buscables globalmente
    const searchableKeysRef = computed(() => {
        const sk = unref(searchableKeys)
        if (Array.isArray(sk) && sk.length) return sk as string[]
        // Por defecto, todas las columnas definidas en headers son buscables
        return headersRef.value.map((h: KunTableHeader) => h?.value).filter(Boolean) as string[]
    })

    // --- Cache para valores buscables ---
    // Map<Item, { [key]: string }>
    // Pre-calcula la representación en string de cada celda para no hacerlo en cada keyup
    const searchableCache: Ref<Map<TableItem, Record<string, string>>> = ref(new Map())

    // Genera el cache de strings para todos los items
    function rebuildCache(): void {
        searchableCache.value.clear()
        const list = unref(items)
        if (!Array.isArray(list)) return

        (list as TableItem[]).forEach((item: TableItem) => {
            const values: Record<string, string> = {}
            searchableKeysRef.value.forEach((key: string) => {
                const header = headersRef.value.find((h: KunTableHeader) => h.value === key)
                let raw: unknown, shown: unknown
                // 1. Obtener valor crudo (soportando relationPath)
                try {
                    raw = header ? getValue(header, item) : item[key]
                } catch (err) {
                    raw = ''
                    if (debug) console.error('[useFilter] ERROR getValue', { item, key, err })
                }
                // 2. Formatearlo (ej: fechas, monedas) -> Lo que ve el usuario es lo que busca
                try {
                    shown = header ? formatValue(header, raw) : raw
                } catch (err) {
                    shown = raw
                    if (debug) console.error('[useFilter] ERROR formatValue', { header, raw, err })
                }
                // 3. Guardar versión minúscula para búsqueda rápida
                values[key] = toSearchableString(shown).toLowerCase()
            })
            searchableCache.value.set(item, values)
        })

        if (debug) console.log('[useFilter] Cache reconstruida', searchableCache.value)
    }

    // --- Watchers para invalidar cache ---
    // 1) Cuando cambia la referencia completa de items
    watch(() => unref(items), () => rebuildCache(), { immediate: true })

    // 2) Cuando cambia la longitud del array (push, splice, pop, etc.)
    watch(() => (unref(items) as TableItem[] | undefined)?.length, () => rebuildCache())

    // --- Lógica Principal de Filtrado ---

    // Verifica si un item cumple con todos los criterios
    const matchesFilter = (item: TableItem, key: string, value: unknown): boolean => {
        // En búsqueda global usa el cache stringificado
        // En filtros específicos podría requerir lógica custom

        const rawValue = getRawValue(item, key)
        const cf = unref(customFilter)

        if (typeof cf === 'function') {
            // Delegar a función custom si existe
            const header = headersRef.value.find((h: KunTableHeader) => h?.value === key)
            try {
                return (cf as (item: TableItem, key: string, value: unknown, header: KunTableHeader | undefined) => boolean)(item, key, value, header)
            } catch (err) {
                if (debug) console.error('[matchesFilter] ERROR customFilter', { item, key, value, header, err })
                return false
            }
        }

        // Lógica para filtros de columna (arrays/selects múltiples)
        const filtersList = (unref(props.filters) ?? props.filters) as FilterDefinition[] | undefined
        const filterDef = Array.isArray(filtersList) ? filtersList.find((f: FilterDefinition) => f.value === key) : undefined
        const itemValueKey = (filterDef?.['item-value'] as string) ?? 'id'

        const extractFilterVal = (v: unknown): unknown => {
            if (v != null && typeof v === 'object') {
                return (v as Record<string, unknown>)[itemValueKey]
            }
            return v
        }

        // Extrae el valor comparable de un miembro de celda (relación) o deja el primitivo
        const extractCellVal = (v: unknown): unknown => {
            if (v != null && typeof v === 'object' && !Array.isArray(v)) {
                return (v as Record<string, unknown>)[itemValueKey]
            }
            return v
        }

        // Multiselect: OR entre valores seleccionados.
        // Celda array (M2M): includes-any sobre miembros; celda escalar: igualdad exacta.
        const selectedVals = (Array.isArray(value) ? value : [value]).map(extractFilterVal)
        const cellVals = Array.isArray(rawValue)
            ? (rawValue as unknown[]).map(extractCellVal)
            : [rawValue]

        return selectedVals.some((sel: unknown) =>
            cellVals.some((cell: unknown) => exactMatchFilter(cell, sel))
        )
    }

    // Computed principal que retorna los items filtrados
    const filteredItems = computed(() => {
        const list = unref(items)
        if (!Array.isArray(list)) return []

        return (list as TableItem[]).filter((item: TableItem) => {
            // 1. Filtro global (Search Bar) - Búsqueda multi-token
            // Se tokeniza el query por espacios y se busca que TODOS los tokens
            // estén presentes en CUALQUIERA de las columnas cacheadas
            const q = appliedFilters.search
            if (q) {
                // Tokenizar por espacios y filtrar vacíos
                const tokens = q.split(/\s+/).filter((t: string) => t.length > 0)

                if (tokens.length > 0) {
                    // Usamos el cache pre-generado para velocidad
                    const cachedValues = searchableCache.value.get(item)
                    if (cachedValues) {
                        // Cada token debe hacer match en ALGUNA columna
                        const allTokensMatch = tokens.every((token: string) => {
                            return Object.values(cachedValues).some((val: string) => val.includes(token))
                        })
                        if (!allTokensMatch) return false
                    } else {
                        // Fallback si no hay cache: lógica multi-token sin cache
                        const keys = searchableKeysRef.value
                        const allTokensMatch = tokens.every((token: string) => {
                            return keys.some((key: string) => {
                                const rawValue = getRawValue(item, key)
                                const strValue = toSearchableString(rawValue).toLowerCase()
                                return strValue.includes(token)
                            })
                        })
                        if (!allTokensMatch) return false
                    }
                }
            }

            // 2. Filtros por columna (Modal)
            // Deben cumplirse TODOS (AND)
            for (const key in appliedFilters.byColumn) {
                const value = appliedFilters.byColumn[key]
                const isEmptyArray = Array.isArray(value) && value.length === 0
                if (value != null && value !== '' && !isEmptyArray && !matchesFilter(item, key, value)) return false
            }
            return true
        })
    })

    // --- Acciones ---
    const setSearch = debounce((value: unknown) => {
        appliedFilters.search = toSearchableString(value).toLowerCase()
        if (debug) console.log('[setSearch]', appliedFilters.search)
    }, (unref(debounceTime) as number) ?? 150)

    const setColumnFilter = (key: string, value: unknown): void => {
        appliedFilters.byColumn[key] = value
        if (debug) console.log('[setColumnFilter]', key, value)
    }

    const applyColumnFilters = (columnFilters: Record<string, unknown>): void => {
        for (const key in columnFilters) setColumnFilter(key, columnFilters[key])
        if (debug) console.log('[applyColumnFilters]', columnFilters)
    }

    const clearFilters = (): void => {
        appliedFilters.search = ''
        appliedFilters.byColumn = {}
        if (debug) console.log('[clearFilters] filtros reseteados')
    }

    const getRawValue = (item: TableItem, key: string): unknown => {
        // Prioritize raw item property if it exists
        if (Object.prototype.hasOwnProperty.call(item, key)) return item[key]

        const header = headersRef.value.find((h: KunTableHeader) => h?.value === key)
        try {
            return header ? getValue(header, item) : item[key]
        } catch (err) {
            if (debug) console.error('[useFilter] ERROR getRawValue', { item, key, err })
            return null
        }
    }

    // Silencia variable no usada del destructure original (defaultFilterFn se usa vía matchesFilter en otros flujos)
    void defaultFilterFn;

    return {
        modalFilter,
        appliedFilters,
        filteredItems,
        setSearch,
        applyColumnFilters,
        clearFilters,
        // 👇 Exponemos también por si querés refrescar manualmente
        refreshCache: rebuildCache,
    }
}
