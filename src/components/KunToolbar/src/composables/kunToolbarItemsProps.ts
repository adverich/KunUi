import type { PropType } from 'vue';
import { isKunColor, isKunVariant, type KunColor, type KunVariant } from '../../../../theme/kunVariants.js';

export type KunToolbarItemsVariant = KunVariant;

export const kunToolbarItemsProps = {
  /** Color semántico; `null` hereda `kunTheme.configure({ defaults: { 'toolbar-items' } })` (fallback `neutral`). */
  color: { type: String as PropType<KunColor | null>, default: null, validator: (v: unknown) => v === null || isKunColor(v) },
  /** Variante estándar de superficie (`KunVariant`); `null` hereda theme (`toolbar-items`, fallback `ghost`). */
  variant: {
    type: String as PropType<KunVariant | null>,
    default: null,
    validator: (v: unknown) => v === null || isKunVariant(v),
  },
}
