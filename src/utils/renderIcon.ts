import { h, resolveComponent, type VNode } from 'vue'
import type { KunIconInput } from '../components/KunIcon/src/composables/kunIconProps.js'

export type RenderableIcon = KunIconInput | null | undefined;

export function renderIconSlot(
  icon: RenderableIcon,
  props: Record<string, unknown> = {},
  fallback: VNode | null = null,
): VNode | null {
    if (!icon) return fallback;
    if (typeof icon === 'string') return h('span', { class: icon, ...props }) as VNode;
    if (typeof icon === 'function' || Array.isArray(icon)) return h(icon as never, props) as VNode;
    return h(resolveComponent('KunIcon'), { icon, ...props }) as VNode;
}
