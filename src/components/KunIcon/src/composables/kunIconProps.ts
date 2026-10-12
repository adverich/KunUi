import type { Component, PropType } from 'vue';

export type KunIconInput = string | Record<string, any> | Function | unknown[] | Component | boolean;

export const kunIconProps = {
  /** Ícono a renderizar: clase CSS, SVG inline, alias `$nombre`, componente o `[icono, tamaño]`. */
  icon: {
    type: [String, Object, Function, Array] as PropType<KunIconInput>,
    required: false as const,
    default: undefined,
  },
  /** Aliases `$nombre` → icono/clase/componente. Pisan el set bundleado (`$star`, ...). */
  aliases: {
    type: Object as PropType<Record<string, unknown>>,
    default: (): Record<string, unknown> => ({}),
  },
  /** Tamaño (clase de texto o número → px). */
  size: {
    type: String,
    default: 'text-md',
  },
  /** Color del ícono. */
  color: {
    type: String,
    default: 'text-font-color',
  },
  /** Atenúa el ícono y bloquea el click. */
  disabled: {
    type: Boolean,
    default: false,
  },
  /** Cursor (por defecto pointer, o not-allowed si disabled). */
  cursor: {
    type: String as PropType<string | null>,
    default: null as string | null,
  },
  /** Clase extra del contenido del ícono. */
  contentClass: [String, Array, Object] as PropType<string | unknown[] | Record<string, unknown>>,
};
