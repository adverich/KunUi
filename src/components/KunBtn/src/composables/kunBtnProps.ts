import type { PropType } from 'vue';

export type KunBtnSize = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
export type KunBtnVariant = 'default' | 'tonal' | 'plain' | 'outlined' | 'soft' | 'text';
export type KunBtnType = 'button' | 'submit' | 'reset';

export const kunBtnProps = {
  /** Texto del botón (alternativa al slot default). */
  text: String,
  /** Tamaño: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'. */
  size: {
    type: String as PropType<KunBtnSize>,
    default: 'md',
    validator: (v: unknown) => ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'].includes(v as string)
  },
  /** Ancho mínimo (clase Tailwind). Solo aplica si no hay ancho custom. */
  minWidth: { type: String, default: 'min-w-[3rem]' },
  /** Peso del texto. */
  fontWeight: { type: String, default: 'font-medium' },
  /** Redondeo de bordes. */
  rounded: { type: String, default: 'rounded-lg' },
  /** Alineación del texto. */
  textAlign: { type: String, default: 'text-center' },
  /** Variante visual: 'default' | 'tonal' | 'plain' | 'outlined' | 'soft' | 'text'. */
  variant: {
    type: String as PropType<KunBtnVariant>,
    default: 'default',
    validator: (v: unknown) => ['default', 'tonal', 'plain', 'outlined', 'soft', 'text'].includes(v as string)
  },
  /** Tipo del botón nativo (submit envía formularios). */
  type: {
    type: String as PropType<KunBtnType>,
    default: 'button',
    validator: (v: unknown) => ['button', 'submit', 'reset'].includes(v as string)
  },
  /** Deshabilita el botón (también cuando loading). */
  disabled: Boolean,
  /** Muestra loader y bloquea interacción. */
  loading: Boolean,
  /** Color de fondo. */
  bgColor: { type: String, default: 'bg-button' },
  /** Color del texto. */
  textColor: {
    type: String,
    default: 'text-ui'
  },
  /** Ruta Vue Router (renderiza router-link en vez de button). */
  to: [String, Object],
  /** URL externa (renderiza <a> en vez de button). */
  href: String,
  /** Navegación con replace (solo con `to`). */
  replace: Boolean,
  /** Target del enlace (solo con `to`/`href`). */
  target: String,
  /** Anillo de foco accesible. */
  ring: Boolean,
  /** Ícono central (solo visible si no hay `text` ni slot default). */
  icon: [Boolean, String, Function, Object, Array],
  /** Ícono a la izquierda del contenido. */
  prependIcon: [String, Function, Object, Array],
  /** Ícono a la derecha del contenido. */
  appendIcon: [String, Function, Object, Array],
  /** Tamaño del ícono (sobrescribe el calculado por `size`). */
  iconSize: { type: String, default: null },
  /** Color extra en estado de foco. */
  focusColor: { type: String, default: null }
}
