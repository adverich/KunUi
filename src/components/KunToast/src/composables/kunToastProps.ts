import type { PropType } from 'vue';
import type { ToastAction } from './useToast.js';

export type KunToastColor = 'primary' | 'success' | 'error' | 'warning' | 'info' | 'neutral';
export type KunToastOrientation = 'vertical' | 'horizontal';
export type KunToastType = 'foreground' | 'background';

export const kunToastProps = {
  // Identificador único del toast
  toastId: { type: [String, Number], default: null },

  // Contenido
  title: { type: [String, Object, Function], default: '' },
  description: { type: [String, Object, Function], default: '' },

  // Ícono
  icon: { type: [String, Object, Function], default: null },

  // Color/variante
  color: {
    type: String as PropType<KunToastColor>,
    default: 'primary',
    validator: (v: unknown) => ['primary', 'success', 'error', 'warning', 'info', 'neutral'].includes(v as string)
  },

  // Orientación del layout
  orientation: {
    type: String as PropType<KunToastOrientation>,
    default: 'vertical',
    validator: (v: unknown) => ['vertical', 'horizontal'].includes(v as string)
  },

  // Duración en ms (0 = sin auto-dismiss)
  duration: { type: Number, default: null },

  // Mostrar barra de progreso
  progress: { type: Boolean, default: true },

  // Color de la barra de progreso (override)
  progressColor: { type: String, default: null },

  // Mostrar botón de cierre
  closable: { type: Boolean, default: true },

  // Ícono del botón de cierre (override)
  closeIcon: { type: [String, Object, Function], default: null },

  // Acciones (botones)
  actions: { type: Array as PropType<ToastAction[]>, default: () => [] as ToastAction[] },

  // Tipo para accesibilidad (foreground/background)
  type: {
    type: String as PropType<KunToastType>,
    default: 'foreground',
    validator: (v: unknown) => ['foreground', 'background'].includes(v as string)
  },

  // Estado gestionado por KunToaster (pausa global y pulse al actualizar)
  isPaused: { type: Boolean, default: false },
  isPulsing: { type: Boolean, default: false },

  // Clases personalizables por slot
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
