import type { Component, PropType } from 'vue';

export type KunIconInput = string | Record<string, any> | Function | unknown[] | Component | boolean;

export const kunIconProps = {
  /** Ícono a renderizar: clase CSS, SVG inline, alias `$nombre`, componente, nombre Iconify (`i-mdi-home`, `mdi:home`) o `[icono, tamaño]`. */
  icon: {
    type: [String, Object, Function, Array] as PropType<KunIconInput>,
    required: false as const,
    default: undefined,
  },
  /** Aliases `$nombre` → icono/clase/componente. Máxima prioridad: pisan a `kunConfig.icons` y al set bundleado (`$star`, ...). */
  aliases: {
    type: Object as PropType<Record<string, unknown>>,
    default: (): Record<string, unknown> => ({}),
  },
  /** Tamaño: clase Tailwind (`size-5`, `text-xl`) o número → px (ancho/alto). Vacío = hereda el contexto. */
  size: {
    type: [String, Number] as PropType<string | number>,
    default: '',
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
