import { computed, reactive, watch, ref, unref } from 'vue'
import { debounce } from '../../../../utils/utils.js'
import { getValue, formatValue } from '@/utils/tableFormatters'

export default function useFilter(props, debounceTime, resolvedHeaders) {
    const appliedFilters = reactive({
        search: '',
        byColumn: {},
    })

    // Desestructuramos pero SIEMPRE usando unref cuando se usen
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

    // Normalizamos headers y searchableKeys para aceptar ref o valor plano
    const headersRef = computed(() => resolvedHeaders.value ?? [])
    const searchableKeysRef = computed(() => {
        const sk = unref(searchableKeys)
        if (Array.isArray(sk) && sk.length) return sk
        return headersRef.value.map(h => h?.value).filter(Boolean)
    })

    const getDisplayValue = (item, key) => {
        console.log('[getDisplayValue] START → key:', key, 'item:', item)

        const header = headersRef.value.find(h => h?.value === key)
        console.log('[getDisplayValue] header encontrado:', header)

        if (!header) {
            const val = item?.[key]
            console.log('[getDisplayValue] SIN header, devuelvo item[key]:', val)
            return val
        }

        let raw, shown
        try {
            raw = getValue(header, item)
            console.log('[getDisplayValue] raw value de getValue:', raw)
        } catch (err) {
            console.error('[getDisplayValue] ERROR en getValue', { header, item, err })
        }

        try {
            shown = formatValue(header, raw)
            console.log('[getDisplayValue] shown value de formatValue:', shown)
        } catch (err) {
            console.error('[getDisplayValue] ERROR en formatValue', { header, raw, err })
        }

        const str = toSearchableString(shown)
        console.log('[getDisplayValue] FINAL stringified:', str)
        return str
    }

    const matchesFilter = (item, key, value) => {
        console.log('[matchesFilter] item:', item, 'key:', key, 'filter value:', value)

        const itemValue = getDisplayValue(item, key)
        console.log('[matchesFilter] itemValue obtenido:', itemValue)

        const cf = unref(customFilter)
        if (typeof cf === 'function') {
            console.log('[matchesFilter] customFilter detectado, llamando...')
            const header = headersRef.value.find(h => h?.value === key)
            try {
                const res = cf(item, key, value, header)
                console.log('[matchesFilter] customFilter result:', res)
                return res
            } catch (err) {
                console.error('[matchesFilter] ERROR en customFilter', { item, key, value, header, err })
                return false
            }
        }

        if (Array.isArray(value)) {
            console.log('[matchesFilter] value es array, evaluando...')
            const res = value.some(v => defaultFilterFn(itemValue, v))
            console.log('[matchesFilter] array filter result:', res)
            return res
        }

        const res = defaultFilterFn(itemValue, value)
        console.log('[matchesFilter] default filter result:', res)
        return res
    }

    const filteredItems = computed(() => {
        const list = unref(items)
        console.log('[filteredItems] recompute → items length:', Array.isArray(list) ? list.length : 'NO ARRAY')

        if (!Array.isArray(list)) return []

        const result = list.filter((item, idx) => {
            console.log('\n[filteredItems] --- Evaluando item idx:', idx, item)

            const q = appliedFilters.search
            if (q) {
                console.log('[filteredItems] search activo:', q)
                const keys = searchableKeysRef.value
                console.log('[filteredItems] searchableKeys:', keys)

                const ok = keys.some((key) => matchesFilter(item, key, q))
                console.log('[filteredItems] resultado filtro global:', ok)
                if (!ok) return false
            }

            for (const key in appliedFilters.byColumn) {
                const value = appliedFilters.byColumn[key]
                if (value != null && value !== '') {
                    console.log('[filteredItems] columna con filtro:', key, 'value:', value)
                    if (!matchesFilter(item, key, value)) {
                        console.log('[filteredItems] filtro por columna NO pasó')
                        return false
                    }
                }
            }

            console.log('[filteredItems] item pasó todos los filtros ✅')
            return true
        })

        console.log('[filteredItems] RESULT FINAL →', result)
        return result
    })

    const setSearch = debounce((value) => {
        console.log('[setSearch] nuevo valor:', value)
        appliedFilters.search = toSearchableString(value).toLowerCase()
    }, unref(debounceTime) ?? 150)

    const setColumnFilter = (key, value) => {
        console.log('[setColumnFilter] key:', key, 'value:', value)
        appliedFilters.byColumn[key] = value
    }

    function applyColumnFilters(columnFilters) {
        console.log('[applyColumnFilters] aplicando:', columnFilters)
        for (const key in columnFilters) {
            setColumnFilter(key, columnFilters[key])
        }
    }

    const clearFilters = () => {
        console.log('[clearFilters] reseteando filtros')
        appliedFilters.search = ''
        appliedFilters.byColumn = {}
    }

    watch(() => unref(items), (n, o) => {
        console.log('[watch items] old:', o, 'new:', n)
    }, { deep: true })

    return {
        modalFilter,
        appliedFilters,
        filteredItems,
        setSearch,
        applyColumnFilters,
        clearFilters,
    }
}
