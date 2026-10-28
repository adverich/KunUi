import type { PropType } from 'vue';
import { isKunColor, isKunVariant, type KunColor, type KunVariant } from '../../../../theme/kunVariants.js';

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
  icon: { type: String as PropType<string | null>, default: null },
  /** Tamaño del ícono (clase Tailwind, `size-6`). */
  iconSize: { type: String, default: 'size-6' },
  /** Color semántico de la alerta. */
  color: {
    type: String as PropType<KunColor>,
    default: 'error' as KunColor,
    validator: (v: unknown) => isKunColor(v)
  },
  /** Variante visual: 'solid' | 'outline' | 'soft' | 'subtle' | 'ghost' | 'link'. */
  variant: {
    type: String as PropType<KunVariant>,
    default: 'solid' as KunVariant,
    validator: (v: unknown) => isKunVariant(v)
  },
  /** Clases del título. */
  titleClass: { type: String, default: 'text-2xl font-bold' },
  /** Clases del mensaje. */
  messageClass: { type: String, default: 'text-base font-normal' },
  /** Muestra botón de cierre. */
  closable: { type: Boolean, default: false },
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
