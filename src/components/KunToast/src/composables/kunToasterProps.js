export const kunToasterProps = {
  // Posición del toaster en el viewport
  position: {
    type: String,
    default: 'bottom-right',
    validator: v => [
      'top-left', 'top-center', 'top-right',
      'bottom-left', 'bottom-center', 'bottom-right'
    ].includes(v)
  },
  
  // Duración global por defecto en ms
  duration: { type: Number, default: 5000 },
  
  // Máximo número de toasts visibles simultáneamente
  max: { type: Number, default: 5 },
  
  // Modo expandible (stacked)
  expand: { type: Boolean, default: false },
  
  // Z-index del contenedor
  zIndex: { type: [String, Number], default: 3000 },
  
  // Clase personalizada del contenedor
  containerClass: { type: String, default: '' }
}
