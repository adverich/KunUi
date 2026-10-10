import type { PropType } from 'vue';

export type KunAlertPosition =
  | 'tl' | 'tc' | 'tr'
  | 'cl' | 'cc' | 'cr'
  | 'bl' | 'bc' | 'br';

export const kunAlertProps = {
  /** Visibilidad de la alerta (v-model). */
  modelValue: Boolean,
  /** Título principal de la alerta. */
  title: String,
  /** Mensaje descriptivo bajo el título. */
  message: String,
  /** Posición en pantalla: t(op)/c(enter)/b(ottom) + l(eft)/c(enter)/r(ight). */
  position: {
    type: String as PropType<KunAlertPosition>,
    default: 'br',
    validator: (v: unknown) => [
      'tl', 'tc', 'tr',
      'cl', 'cc', 'cr',
      'bl', 'bc', 'br'
    ].includes(v as string)
  },
  /** Ícono a mostrar (clase o nombre con `$`). */
  icon: { type: String, default: null },
  /** Tamaño del ícono (clase Tailwind de texto). */
  iconSize: { type: String, default: 'text-2xl' },
  /** Color de fondo del contenedor del ícono. */
  iconBgColor: { type: String, default: 'bg-error' },
  /** Color de fondo de la alerta. */
  bgColor: { type: String, default: 'bg-error' },
  /** Color del texto. */
  textColor: { type: String, default: 'text-ui-inverse' },
  /** Color del borde (vacío = sin borde visible). */
  borderColor: { type: String, default: '' },
  /** Clases del título. */
  titleClass: { type: String, default: 'text-2xl font-bold' },
  /** Clases del mensaje. */
  messageClass: { type: String, default: 'text-base font-normal' },
  /** Muestra botón de cierre. */
  closable: { type: Boolean, default: false },
  /** Z-index del contenedor flotante. */
  zIndex: { type: [String, Number], default: 2500 },
  /** Clases de transición de entrada/salida. */
  transition: { type: String, default: 'transition-opacity duration-300 ease-in-out' },
  /** Clases del contenedor de la alerta. */
  alertClass: { type: String, default: 'relative w-fit rounded-lg shadow-md' },
  /** Padding interno del contenedor. */
  paddingContainer: { type: String, default: 'p-2' },
  /** Margen externo del contenedor. */
  margin: { type: String, default: 'm-2' },
  /** Ocupa toda la pantalla. */
  fullscreen: { type: Boolean, default: false },
  /** Requiere acción explícita para cerrarse (no cierra por timeout). */
  persistent: { type: Boolean, default: false },
  /** Texto del botón de confirmación en modo persistente. */
  persistentLabel: { type: String, default: 'Aceptar' },
  /** Texto de acción secundaria (vacío = sin acción). */
  actionLabel: { type: String, default: '' },
  /** Milisegundos hasta el auto-cierre (0 = sin auto-cierre). */
  timeout: { type: Number, default: 2500 }
}
