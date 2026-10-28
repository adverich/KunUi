import type { PropType } from 'vue';

export type KunToasterPosition =
  | 'top-left' | 'top-center' | 'top-right'
  | 'bottom-left' | 'bottom-center' | 'bottom-right';

export const kunToasterProps = {
  /** Posición de los toasts en el viewport. */
  position: {
    type: String as PropType<KunToasterPosition>,
    default: 'bottom-right',
    validator: (v: unknown) => [
      'top-left', 'top-center', 'top-right',
      'bottom-left', 'bottom-center', 'bottom-right'
    ].includes(v as string)
  },

  /** Duración global por defecto (ms) para toasts creados sin `duration` propio. Reactiva: reconfigura el sistema en caliente. */
  duration: { type: Number, default: 5000 },

  /** Máximo de toasts retenidos simultáneamente. Reactiva. */
  max: { type: Number, default: 5 },

  /** Muestra todos los toasts apilados. Si es `false`, se colapsa al más nuevo y se expande al hacer hover (patrón Nuxt UI). */
  expand: { type: Boolean, default: true },

  /** Valor por defecto de la barra de progreso para toasts creados sin `progress` propio. Reactiva. */
  progress: { type: Boolean, default: true },

  /** Renderiza los toasts en un portal. `true` = `<body>`, `false` = en su lugar, o un selector/HTMLElement destino. */
  portal: { type: [Boolean, String, Object] as PropType<boolean | string | HTMLElement>, default: true },

  /** Clase personalizada del contenedor. */
  containerClass: { type: String, default: '' }
}
