import type { PropType } from 'vue';
import type { KunMenuOrigin } from '../../../KunMenu/src/composables/kunMenuProps.js';
import type { KunTextFieldDensity } from '../../../KunTextField/src/composables/KunTextFieldProps.js';
import { isKunColor, type KunColor } from '../../../../theme/kunVariants.js';

export const KunSelectProps = {
  /** Etiqueta del campo. */
  label: {
    type: String,
    default: '',
  },
  /** Campo del ítem usado como valor (null = primer valor del objeto). */
  itemValue: {
    type: String as PropType<string | null>,
    default: null,
  },
  /** Campo(s) a mostrar (string, array o ruta `a.b`). */
  itemTitle: {
    type: [String, Array] as PropType<string | unknown[] | null>,
    default: null,
  },
  /** Alias de `itemTitle`. */
  itemText: {
    type: [String, Array] as PropType<string | unknown[] | null>,
    default: null,
  },
  /** Campo(s) del subtítulo. */
  itemSubtitle: {
    type: [String, Array] as PropType<string | unknown[] | null>,
    default: null,
  },

  /** Emite el objeto completo en vez del valor. */
  returnObject: {
    type: Boolean,
    default: false,
  },

  /** Foco automático al montar. */
  focusOnRender: {
    type: Boolean,
    default: false,
  },
  /** Foco al campo tras seleccionar. */
  focusOnSelect: {
    type: Boolean,
    default: false,
  },

  /** Muestra botón limpiar. */
  clearable: {
    type: Boolean,
    default: false,
  },
  /** Limpia la selección al elegir (multiple). */
  clearOnSelect: {
    type: Boolean,
    default: false,
  },

  /** Cierra el menú al seleccionar (single). */
  closeOnSelect: { type: Boolean, default: true },
  /** Origen del menú (se reenvía a KunMenu). */
  menuOrigin: {
    type: String as PropType<KunMenuOrigin>,
    default: 'bottom left',
    validator: (v: unknown) => [
      'auto',
      'top left', 'top center', 'top right',
      'bottom left', 'bottom center', 'bottom right',
      'left top', 'left center', 'left bottom',
      'right top', 'right center', 'right bottom',
    ].includes(v as string),
  },

  /** Placeholder nativo (el visible es `placeholderText`). */
  placeholder: { type: String, default: '' },
  /** Placeholder visible del campo readonly. */
  placeholderText: { type: String, default: 'Seleccionar' },
  /** Texto cuando no hay ítems. */
  textNoItems: { type: String, default: 'No hay elementos' },

  /** Muestra botón para crear un ítem (emite `createItem`). */
  hasCreateItem: { type: Boolean, default: false },
  /** Clase del botón crear. */
  btnCreateClass: { type: String, default: 'w-full' },
  /** Color semántico del botón crear. */
  btnCreateColor: {
    type: String as PropType<KunColor>,
    default: 'success',
    validator: (v: unknown) => isKunColor(v)
  },
  /** Texto del botón crear. */
  btnCreateText: { type: String, default: 'Crear item' },

  /** Selección múltiple (chips). */
  multiple: { type: Boolean, default: false },
  /** Marca el campo como requerido (asterisco). */
  required: {
    type: Boolean,
    default: false,
  },
  /** Deshabilita el campo. */
  disabled: {
    type: Boolean,
    default: false,
  },
  /** Solo lectura (no abre el menú). */
  readonly: {
    type: Boolean,
    default: false,
  },

  // ***** STYLE ***** //
  // NOTA: `height` está en desuso (el menú ocupa el espacio disponible).
  // El límite lo controla `maxHeight`: undefined = todo el espacio
  // disponible hasta el borde del viewport; con valor se aplica
  // min(valor, espacio disponible). Acepta Number (px), CSS o clase Tailwind.
  height: { type: [String, Number] as PropType<string | number | null>, default: 'h-[500px]' },
  /** Altura máxima del menú. */
  maxHeight: { type: [String, Number] as PropType<string | number | null | undefined>, default: undefined },
  /** Densidad del campo (se reenvía al KunTextField). */
  density: {
    type: String as PropType<KunTextFieldDensity>,
    default: 'default',
    validator: (v: unknown) => ['default', 'comfortable', 'compact'].includes(v as string),
  },
  /** Oculta el área de detalles. */
  hideDetails: {
    type: Boolean,
    default: true,
  },
  /** Muestra iconos de estado (limpiar/desplegar). */
  hasIcons: {
    type: Boolean,
    default: true,
  },
  /** Props visuales y atributos que se reenvían al KunTextField interno. */
  textFieldProps: { type: Object, default: () => ({}) },
  /** Color del ícono desplegar. */
  iconColor: { type: String, default: 'text-primary' },
  /** Color del asterisco de requerido. */
  requiredIconColor: { type: String, default: 'text-error' },
  /** Clase del texto "sin elementos". */
  emptyTextClass: { type: String, default: 'text-muted' },
  /** Reservado (no se reenvía al KunMenu interno). Actualmente sin efecto. */
  attach: {
    type: Boolean,
    default: false,
  },
  /** Reglas de validación: `(valor) => true | string`. */
  rules: {
    type: Array,
    default: () => [],
  },
};
