import type { PropType } from 'vue';

export type KunMultipleModalFooterPosition = 'bottom-left' | 'bottom-right' | 'bottom-center' | 'top-left' | 'top-right' | 'top-center';
export type KunMultipleModalFooterStackDirection = 'bottom-to-top' | 'top-to-bottom';

export const kunMultipleModalFooterProps = {
  /** Lista de mensajes `{ id, text, color }` a mostrar apilados. */
  messages: {
    type: Array,
    default: () => [],
  },
  /** Esquina del viewport donde se apilan. */
  position: {
    type: String as PropType<KunMultipleModalFooterPosition>,
    default: "bottom-right",
    validator: (v: unknown) => ['bottom-left', 'bottom-right', 'bottom-center', 'top-left', 'top-right', 'top-center'].includes(v as string),
  },
  /** Dirección de apilado: 'bottom-to-top' | 'top-to-bottom'. */
  stackDirection: {
    type: String as PropType<KunMultipleModalFooterStackDirection>,
    default: "bottom-to-top",
    validator: (v: unknown) => ['bottom-to-top', 'top-to-bottom'].includes(v as string),
  },
  /** Ancho de cada mensaje. */
  width: {
    type: String,
    default: "300px",
  },
  /** Altura de cada mensaje ('auto' = contenido). */
  height: {
    type: String,
    default: "auto",
  },
}
