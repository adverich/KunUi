// useFilter.js
import { computed, reactive, watch, ref, unref, onMounted } from 'vue'
import { debounce } from '../../../../utils/utils.js'
import { getValue, formatValue } from '@/utils/tableFormatters'

export default function useFilter(props, debounceTime, resolvedHeaders, debug = false) {
    const appliedFilters = reactive({
        search: '',
        byColumn: {},
    })

    const { items, customFilter, searchableKeys, headers } = props
    const modalFilter = ref(false)

    // --- Helpers ---
    const toSearchableString = (v) => {
        if (v == null) return ''
        if (typeof v === 'string') return v
        if (typeof v === 'number' || typeof v === 'boolean') return String(v)
        if (v instanceof Date) return v.toISOString()
        if (typeof v === 'object') {
            if ('label' in v) return String(v.label)
            if ('name' in v) return String(v.name)
            try { return String(v) } catch { return '' }
        }
        try { return String(v) } catch { return '' }
    }

    const defaultFilterFn = (itemValue, filterValue) => {
        const a = toSearchableString(itemValue).toLowerCase()
        const b = toSearchableString(filterValue).toLowerCase()
        if (!b) return true
        if (!a) return false
        return a.includes(b)
    }

    // --- Headers y searchableKeys ---
    const headersRef = computed(() => resolvedHeaders.value ?? [])
    const searchableKeysRef = computed(() => {
        const sk = unref(searchableKeys)
        if (Array.isArray(sk) && sk.length) return sk
        return headersRef.value.map(h => h?.value).filter(Boolean)
    })

    // --- Cache para valores buscables ---
    const searchableCache = ref(new Map())

    // 🔥 Centralizamos la reconstrucción del cache
    function rebuildCache() {
        searchableCache.value.clear()
        const list = unref(items)
        if (!Array.isArray(list)) return

        list.forEach(item => {
            const values = {}
            searchableKeysRef.value.forEach(key => {
                const header = headersRef.value.find(h => h.value === key)
                let raw, shown
                try {
                    raw = header ? getValue(header, item) : item[key]
                } catch (err) {
                    raw = ''
                    if (debug) console.error('[useFilter] ERROR getValue', { item, key, err })
                }
                try {
                    shown = header ? formatValue(header, raw) : raw
                } catch (err) {
                    shown = raw
                    if (debug) console.error('[useFilter] ERROR formatValue', { header, raw, err })
                }
                values[key] = toSearchableString(shown).toLowerCase()
            })
            searchableCache.value.set(item, values)
        })

        if (debug) console.log('[useFilter] Cache reconstruida', searchableCache.value)
    }

    // --- Watchers ---
    // 1) Cuando cambia la referencia completa de items
    watch(() => unref(items), () => rebuildCache(), { immediate: true })

    // 2) Cuando cambia la longitud del array (push, splice, pop, etc.)
    watch(() => unref(items)?.length, () => rebuildCache())

    // --- Getters y filtros ---
    const getDisplayValue = (item, key) => {
        const val = searchableCache.value.get(item)?.[key] ?? ''
        if (debug) console.log('[getDisplayValue]', { item, key, val })
        return val
    }

    const matchesFilter = (item, key, value) => {
        const rawValue = getRawValue(item, key)
        const cf = unref(customFilter)

        if (typeof cf === 'function') {
            const header = headersRef.value.find(h => h?.value === key)
            try {
                return cf(item, key, value, header)
            } catch (err) {
                if (debug) console.error('[matchesFilter] ERROR customFilter', { item, key, value, header, err })
                return false
            }
        }

        // Resolvemos la lista de filters tanto si viene como ref o como array
        const filtersList = unref(props.filters) ?? props.filters
        const filterDef = Array.isArray(filtersList) ? filtersList.find(f => f.value === key) : undefined
        const itemValueKey = filterDef?.['item-value'] ?? 'id'

        const extractFilterVal = (v) => {
            if (v != null && typeof v === 'object') {
                return v[itemValueKey]
            }
            return v
        }

        if (Array.isArray(value)) {
            return value.some(v => defaultFilterFn(rawValue, extractFilterVal(v)))
        }
        return defaultFilterFn(rawValue, extractFilterVal(value))
    }

    const filteredItems = computed(() => {
        const list = unref(items)
        if (!Array.isArray(list)) return []

        return list.filter(item => {
            // Filtro global
            const q = appliedFilters.search
            if (q) {
                const keys = searchableKeysRef.value
                const ok = keys.some(key => matchesFilter(item, key, q))
                if (!ok) return false
            }

            // Filtros por columna
            for (const key in appliedFilters.byColumn) {
                const value = appliedFilters.byColumn[key]
                if (value != null && value !== '' && !matchesFilter(item, key, value)) return false
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
