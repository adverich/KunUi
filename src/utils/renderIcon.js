export function renderIconSlot(icon, props = {}, fallback = null) {
    if (!icon) return fallback
    if (typeof icon === 'string') return h('span', { class: icon, ...props })
    if (typeof icon === 'function') return h(icon, props)
    return h(resolveComponent('KunIcon'), { icon, ...props })
}