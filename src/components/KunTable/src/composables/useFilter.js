// useFilter.js
import { computed, reactive, watch, ref, unref } from 'vue'
import { debounce } from '@/utils/utils.js'
import { getValue, formatValue } from '@/utils/tableFormatters'

export default function useFilter(props, debounceTime, resolvedHeaders, debug = false) {
    const appliedFilters = reactive({
        search: '',
        byColumn: {},
    })

    const { items, customFilter, searchableKeys, headers } = props
    const modalFilter = ref(false)

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

    // Headers y searchableKeys
    const headersRef = computed(() => resolvedHeaders.value ?? [])
    const searchableKeysRef = computed(() => {
        const sk = unref(searchableKeys)
        if (Array.isArray(sk) && sk.length) return sk
        return headersRef.value.map(h => h?.value).filter(Boolean)
    })

    // Cache para valores buscables
    const searchableCache = ref(new Map())

    // función para obtener clave única
    const getItemKey = (item, index) => {
        return item?.id ?? index
    }

    const buildCacheForItem = (item) => {
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
        return values
    }

    // Actualización incremental del cache
    watch(
        () => unref(items),
        (list) => {
            if (!Array.isArray(list)) {
                searchableCache.value.clear()
                return
            }

            const newMap = new Map()
            list.forEach((item, idx) => {
                const key = getItemKey(item, idx)
                if (searchableCache.value.has(key)) {
                    newMap.set(key, searchableCache.value.get(key))
                } else {
                    newMap.set(key, buildCacheForItem(item))
                }
            })
            searchableCache.value = newMap

            if (debug) console.log('[useFilter] Cache actualizado', searchableCache.value)
        },
        { immediate: true, deep: false }
    )

    const getDisplayValue = (item, key, index = 0) => {
        const cacheKey = getItemKey(item, index)
        const val = searchableCache.value.get(cacheKey)?.[key] ?? ''
        if (debug) console.log('[getDisplayValue]', { item, key, val })
        return val
    }

    const matchesFilter = (item, key, value, index = 0) => {
        const itemValue = getDisplayValue(item, key, index)
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

        if (Array.isArray(value)) {
            return value.some(v => defaultFilterFn(itemValue, v))
        }

        return defaultFilterFn(itemValue, value)
    }

    const filteredItems = computed(() => {
        const list = unref(items)
        if (!Array.isArray(list)) return []

        return list.filter((item, idx) => {
            // Filtro global
            const q = appliedFilters.search
            if (q) {
                const keys = searchableKeysRef.value
                const ok = keys.some(key => matchesFilter(item, key, q, idx))
                if (!ok) return false
            }

            // Filtros por columna
            for (const key in appliedFilters.byColumn) {
                const value = appliedFilters.byColumn[key]
                if (value != null && value !== '' && !matchesFilter(item, key, value, idx)) return false
            }

            return true
        })
    })

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

    return {
        modalFilter,
        appliedFilters,
        filteredItems,
        setSearch,
        applyColumnFilters,
        clearFilters,
    }
}
