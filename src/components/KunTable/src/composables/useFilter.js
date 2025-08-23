import { computed, reactive, watch, ref, unref } from 'vue'
import { debounce } from '../../../../utils/utils.js'
import { getValue, formatValue } from '@/utils/tableFormatters'

export default function useFilter(props, debounceTime) {
    const appliedFilters = reactive({
        search: '',
        byColumn: {},
    })

    // Desestructuramos pero SIEMPRE usando unref cuando se usen
    const { items, customFilter, searchableKeys, headers } = props

    const modalFilter = ref(false)

    const toSearchableString = (v) => {
        if (v == null) return ''
        // Evita crashear si te pasan objetos/fechas/etc
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

    // Normalizamos headers y searchableKeys para aceptar ref o valor plano
    const headersRef = computed(() => unref(headers) ?? [])
    const searchableKeysRef = computed(() => {
        const sk = unref(searchableKeys)
        if (Array.isArray(sk) && sk.length) return sk
        return headersRef.value.map(h => h?.value).filter(Boolean)
    })

    const getDisplayValue = (item, key) => {
        const header = headersRef.value.find(h => h?.value === key)
        if (!header) return item?.[key]

        const raw = getValue(header, item)
        const shown = formatValue(header, raw)

        return toSearchableString(shown) // 🔑 garantiza que siempre es string
    }

    const matchesFilter = (item, key, value) => {
        const itemValue = getDisplayValue(item, key)

        // customFilter puede venir como ref o como función directa
        const cf = unref(customFilter)
        if (typeof cf === 'function') {
            // Pasamos también el header por si lo necesitan (args extra son opcionales)
            const header = headersRef.value.find(h => h?.value === key)
            return cf(item, key, value, header)
        }

        if (Array.isArray(value)) {
            return value.some(v => defaultFilterFn(itemValue, v))
        }

        return defaultFilterFn(itemValue, value)
    }

    const filteredItems = computed(() => {
        const list = unref(items)
        if (!Array.isArray(list)) return []

        return list.filter((item) => {
            // 🔍 filtro global (usa las claves "searchable")
            const q = appliedFilters.search
            if (q) {
                const keys = searchableKeysRef.value
                const ok = keys.some((key) => matchesFilter(item, key, q))
                if (!ok) return false
            }

            // 🔍 filtros por columna
            for (const key in appliedFilters.byColumn) {
                const value = appliedFilters.byColumn[key]
                if (value != null && value !== '') {
                    if (!matchesFilter(item, key, value)) return false
                }
            }

            return true
        })
    })

    const setSearch = debounce((value) => {
        appliedFilters.search = toSearchableString(value).toLowerCase()
    }, unref(debounceTime) ?? 150)

    const setColumnFilter = (key, value) => {
        appliedFilters.byColumn[key] = value
    }

    function applyColumnFilters(columnFilters) {
        for (const key in columnFilters) {
            setColumnFilter(key, columnFilters[key])
        }
    }

    const clearFilters = () => {
        appliedFilters.search = ''
        appliedFilters.byColumn = {}
    }

    watch(() => unref(items), () => { }, { deep: true })

    return {
        modalFilter,
        appliedFilters,
        filteredItems,
        setSearch,
        applyColumnFilters,
        clearFilters,
    }
}
