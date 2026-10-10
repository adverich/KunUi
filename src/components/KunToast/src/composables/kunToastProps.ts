import type { PropType } from 'vue';
import type { ToastAction } from './useToast.js';

export type KunToastColor = 'primary' | 'success' | 'error' | 'warning' | 'info' | 'neutral';
export type KunToastOrientation = 'vertical' | 'horizontal';
export type KunToastType = 'foreground' | 'background';

export const kunToastProps = {
  /** Id único (lo genera KunToaster si se omite). */
  toastId: { type: [String, Number], default: null },

  /** Título (string o VNode). */
  title: { type: [String, Object, Function], default: '' },
  /** Descripción (string o VNode). */
  description: { type: [String, Object, Function], default: '' },

  /** Ícono principal (null = según `color`). */
  icon: { type: [String, Object, Function], default: null },

  /** Variante de color. */
  color: {
    type: String as PropType<KunToastColor>,
    default: 'primary',
    validator: (v: unknown) => ['primary', 'success', 'error', 'warning', 'info', 'neutral'].includes(v as string)
  },

  /** Layout: acciones abajo ('vertical') o al costado ('horizontal'). */
  orientation: {
    type: String as PropType<KunToastOrientation>,
    default: 'vertical',
    validator: (v: unknown) => ['vertical', 'horizontal'].includes(v as string)
  },

  /** Duración en ms (0 = sin auto-dismiss, null = global del Toaster). */
  duration: { type: Number, default: null },

  /** Barra de progreso del timeout. */
  progress: { type: Boolean, default: true },

  /** Color de la barra de progreso (null = según `color`). */
  progressColor: { type: String, default: null },

  /** Botón de cierre. */
  closable: { type: Boolean, default: true },

  /** Ícono del botón de cierre (null = default). */
  closeIcon: { type: [String, Object, Function], default: null },

  /** Botones de acción `{ label, icon, variant, onClick, closeOnClick }`. */
  actions: { type: Array as PropType<ToastAction[]>, default: () => [] as ToastAction[] },

  /** `foreground` (assertive) o `background` (polite) para lectores de pantalla. */
  type: {
    type: String as PropType<KunToastType>,
    default: 'foreground',
    validator: (v: unknown) => ['foreground', 'background'].includes(v as string)
  },

  /** Estado interno: pausa el auto-dismiss (gestionado por KunToaster). No pasar manualmente. */
  isPaused: { type: Boolean, default: false },
  /** Estado interno: aplica `animate-pulse` al aparecer/actualizar (gestionado por useToast). No pasar manualmente. */
  isPulsing: { type: Boolean, default: false },

  /** Clases por slot: root, wrapper, title, description, icon, actions, progress, close. */
  ui: {
    type: Object as PropType<Record<string, string>>,
    default: () => ({
      root: '',
      wrapper: '',
      title: '',
      description: '',
      icon: '',
      actions: '',
      progress: '',
      close: ''
    })
  }
}
