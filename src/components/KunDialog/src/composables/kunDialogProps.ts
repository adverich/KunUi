import type { PropType } from 'vue';

export type KunDialogXPosition = 'start' | 'center' | 'end';
export type KunDialogYPosition = 'top' | 'center' | 'bottom';

export const kunDialogProps = {
  /** Visibilidad del diálogo (v-model). */
  modelValue: Boolean,
  /** Muestra overlay oscuro detrás. */
  overlay: { type: Boolean, default: true },
  /** Ocupa toda la pantalla. */
  fullscreen: { type: Boolean, default: false },
  /** Contenido con scroll interno. */
  scrollable: { type: Boolean, default: false },
  /** No cierra al hacer click fuera ni con Escape. */
  persistent: { type: Boolean, default: false },
  /** Clase extra del diálogo. */
  dialogClass: { type: String, default: '' },
  /** Posición horizontal. */
  xPosition: {
    type: String as PropType<KunDialogXPosition>,
    default: 'center',
    validator: (v: unknown) => ['start', 'center', 'end'].includes(v as string),
  },
  /** Posición vertical. */
  yPosition: {
    type: String as PropType<KunDialogYPosition>,
    default: 'center',
    validator: (v: unknown) => ['top', 'center', 'bottom'].includes(v as string),
  },
  /** Clase extra del contenido. */
  contentClass: { type: String, default: '' },
  /** Color de fondo. */
  bgColor: { type: String, default: 'bg-surface-dark' },
  /** Altura mínima. */
  minHeight: { type: String, default: 'h-fit' },
  /** Altura. */
  height: { type: String, default: 'h-fit' },
  /** Altura máxima. */
  maxHeight: { type: String, default: 'max-h-dvh' },
  /** Ancho mínimo. */
  minWidth: { type: String, default: 'min-w-1/3' },
  /** Ancho. */
  width: { type: String, default: 'w-full' },
  /** Ancho máximo. */
  maxWidth: { type: String, default: 'max-w-full' },
}
