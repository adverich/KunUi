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
    type: String,
    default: 'primary',
    validator: v => ['primary', 'success', 'error', 'warning', 'info', 'neutral'].includes(v)
  },
  
  // Orientación del layout
  orientation: {
    type: String,
    default: 'vertical',
    validator: v => ['vertical', 'horizontal'].includes(v)
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
  actions: { type: Array, default: () => [] },
  
  // Tipo para accesibilidad (foreground/background)
  type: {
    type: String,
    default: 'foreground',
    validator: v => ['foreground', 'background'].includes(v)
  },
  
  // Clases personalizables por slot
  ui: {
    type: Object,
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
