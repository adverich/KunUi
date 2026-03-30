// useFilter.js
import { computed, reactive, watch, ref, unref, onMounted } from 'vue'
import { debounce } from '../../../../utils/utils.js'
import { getValue, formatValue } from '@/utils/tableFormatters'

/**
 * Composable para lógica de filtrado avanzado.
 * Características:
 * - Búsqueda global (en todas las columnas searchables).
 * - Búsqueda por columna específica.
 * - Cache de valores stringificados para optimizar performance en tablas grandes.
 * - Debounce en inputs de búsqueda.
 */
export default function useFilter(props, debounceTime, resolvedHeaders, debug = false) {
    // Estado reactivo de filtros aplicados
    const appliedFilters = reactive({
        search: '', // Búsqueda global
        byColumn: {}, // Mapa columna -> valor
    })

    const { items, customFilter, searchableKeys, headers } = props
    const modalFilter = ref(false) // Control del modal de filtros avanzados

    // --- Helpers de Stringificación ---
    // Convierte cualquier valor a string para comparaciones de texto
    const toSearchableString = (v) => {
        if (v == null) return ''
        if (typeof v === 'string') return v
        if (typeof v === 'number' || typeof v === 'boolean') return String(v)
        if (v instanceof Date) return v.toISOString()
        if (typeof v === 'object') {
            if ('label' in v) return String(v.label) // Soporte para objetos tipo {id, label}
            if ('name' in v) return String(v.name)
            try { return String(v) } catch { return '' }
        }
        try { return String(v) } catch { return '' }
    }

    // Predicado de filtrado por defecto (case insensitive includes)
    // Usado para búsqueda global (search bar) donde se espera match parcial
    const defaultFilterFn = (itemValue, filterValue) => {
        const a = toSearchableString(itemValue).toLowerCase()
        const b = toSearchableString(filterValue).toLowerCase()
        if (!b) return true // Si no hay filtro, pasa
        if (!a) return false // Si hay filtro y no valor, falla
        return a.includes(b)
    }

    // Predicado de filtrado por match exacto (case insensitive)
    // Usado para filtros por columna (KunAutocomplete) donde se espera match exacto
    const exactMatchFilter = (itemValue, filterValue) => {
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
        if (Array.isArray(sk) && sk.length) return sk
        // Por defecto, todas las columnas definidas en headers son buscables
        return headersRef.value.map(h => h?.value).filter(Boolean)
    })

    // --- Cache para valores buscables ---
    // Map<Item, { [key]: string }>
    // Pre-calcula la representación en string de cada celda para no hacerlo en cada keyup
    const searchableCache = ref(new Map())

    // Genera el cache de strings para todos los items
    function rebuildCache() {
        searchableCache.value.clear()
        const list = unref(items)
        if (!Array.isArray(list)) return

        list.forEach(item => {
            const values = {}
            searchableKeysRef.value.forEach(key => {
                const header = headersRef.value.find(h => h.value === key)
                let raw, shown
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
    watch(() => unref(items)?.length, () => rebuildCache())

    // --- Lógica Principal de Filtrado ---

    // Verifica si un item cumple con todos los criterios
    const matchesFilter = (item, key, value) => {
        // En búsqueda global usa el cache stringificado
        // En filtros específicos podría requerir lógica custom

        const rawValue = getRawValue(item, key)
        const cf = unref(customFilter)

        if (typeof cf === 'function') {
            // Delegar a función custom si existe
            const header = headersRef.value.find(h => h?.value === key)
            try {
                return cf(item, key, value, header)
            } catch (err) {
                if (debug) console.error('[matchesFilter] ERROR customFilter', { item, key, value, header, err })
                return false
            }
        }

        // Lógica para filtros de columna (arrays/selects múltiples)
        const filtersList = unref(props.filters) ?? props.filters
        const filterDef = Array.isArray(filtersList) ? filtersList.find(f => f.value === key) : undefined
        const itemValueKey = filterDef?.['item-value'] ?? 'id'

        const extractFilterVal = (v) => {
            if (v != null && typeof v === 'object') {
                return v[itemValueKey]
            }
            return v
        }

        // Si el filtro es un array (multiselect), verificamos si incluye el valor
        if (Array.isArray(value)) {
            return value.some(v => exactMatchFilter(rawValue, extractFilterVal(v)))
        }
        return exactMatchFilter(rawValue, extractFilterVal(value))
    }

    // Computed principal que retorna los items filtrados
    const filteredItems = computed(() => {
        const list = unref(items)
        if (!Array.isArray(list)) return []

        return list.filter(item => {
            // 1. Filtro global (Search Bar)
            // Se busca el string en CUALQUIERA de las columnas cacheadas
            const q = appliedFilters.search
            if (q) {
                // Usamos el cache pre-generado para velocidad
                const cachedValues = searchableCache.value.get(item)
                if (cachedValues) {
                    const match = Object.values(cachedValues).some(val => val.includes(q))
                    if (!match) return false
                } else {
                    // Fallback si no hay cache (no debería pasar)
                    const keys = searchableKeysRef.value
                    const ok = keys.some(key => matchesFilter(item, key, q))
                    if (!ok) return false
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
    const setSearch = debounce((value) => {
        appliedFilters.search = toSearchableString(value).toLowerCase()
        if (debug) console.log('[setSearch]', appliedFilters.search)
    }, unref(debounceTime) ?? 150)

    const setColumnFilter = (key, value) => {
        appliedFilters.byColumn[key] = value
        if (debug) console.log('[setColumnFilter]', key, value)
    }

    const applyColumnFilters = (columnFilters) => {
        for (const key in columnFilters) setColumnFilter(key, columnFilters[key])
        if (debug) console.log('[applyColumnFilters]', columnFilters)
    }

    const clearFilters = () => {
        appliedFilters.search = ''
        appliedFilters.byColumn = {}
        if (debug) console.log('[clearFilters] filtros reseteados')
    }

    const getRawValue = (item, key) => {
        // Prioritize raw item property if it exists
        if (Object.prototype.hasOwnProperty.call(item, key)) return item[key]

        const header = headersRef.value.find(h => h?.value === key)
        try {
            return header ? getValue(header, item) : item[key]
        } catch (err) {
            if (debug) console.error('[useFilter] ERROR getRawValue', { item, key, err })
            return null
        }
    }

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
