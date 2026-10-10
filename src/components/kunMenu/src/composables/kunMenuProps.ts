// kunMenuProps.js
import type { PropType } from 'vue';

export type KunMenuLocation = 'top' | 'bottom' | 'left' | 'right';
export type KunMenuOrigin =
  | 'auto'
  | 'top left' | 'top center' | 'top right'
  | 'bottom left' | 'bottom center' | 'bottom right'
  | 'left top' | 'left center' | 'left bottom'
  | 'right top' | 'right center' | 'right bottom';
export type KunMenuTransition =
  | 'fade' | 'fade-scale' | 'slide-down' | 'slide-up' | 'slide-left' | 'slide-right' | 'none';

export const kunMenuProps = {
    /** Clase extra del contenido. */
    class: [String, Array, Object],
    /** Color de fondo. */
    bgColor: { type: String, default: 'bg-menu' },
    /** Apertura (v-model). */
    modelValue: Boolean,
    /** Selector o elemento que dispara el menú. */
    activator: [String, Object],
    /** Props que se pasan al activador. */
    activatorProps: {
        type: Object,
        default: () => ({})
    },
    /** Ref del elemento padre para posicionar. */
    parentRef: Object,
    /** Dónde montar el contenido (Teleport). */
    attach: [Boolean, String, Object],
    /** Abrir al hacer click en el activador. */
    openOnClick: Boolean,
    /** Abrir al pasar el mouse. */
    openOnHover: Boolean,
    /** Abrir al enfocar. */
    openOnFocus: Boolean,
    /** Cerrar al hacer click en el contenido. */
    closeOnContentClick: {
        type: Boolean,
        default: true
    },
    /** Cerrar con el botón atrás del navegador. */
    closeOnBack: {
        type: Boolean,
        default: true
    },
    /** Contenido limitado al padre (sin Teleport). */
    contained: Boolean,
    /** Deshabilita el menú. */
    disabled: Boolean,
    /** Renderiza el contenido aunque esté cerrado. */
    eager: Boolean,
    /** Altura mínima. */
    minHeight: [String, Number],
    /** Altura fija. */
    height: [String, Number],
    /** Altura máxima. */
    maxHeight: [String, Number],
    /** Ancho del contenido (clase o px). */
    width: {
        type: [String, Number],
        default: 'w-fit'
    },
    /** Ancho mínimo. */
    minWidth: [String, Number],
    /** Ancho máximo. */
    maxWidth: [String, Number],
    /** Desplazamiento respecto al activador. */
    offset: [String, Number, Array],
    /** Retraso en ms antes de abrir (hover). */
    openDelay: {
        type: [String, Number],
        default: 100
    },
    /** Retraso en ms antes de cerrar (hover). */
    closeDelay: {
        type: [String, Number],
        default: 100
    },
    /** Lado de apertura respecto al activador. */
    location: {
        type: String as PropType<KunMenuLocation>,
        default: 'bottom',
        validator: (v: unknown) => ['top', 'bottom', 'left', 'right'].includes(v as string)
    },
    /** Origen de la animación ('auto' = según `location`). */
    origin: {
        type: String as PropType<KunMenuOrigin>,
        default: 'auto',
        validator: (value: unknown) => {
            const validOrigins = [
                'auto',
                'top left', 'top center', 'top right',
                'bottom left', 'bottom center', 'bottom right',
                'left top', 'left center', 'left bottom',
                'right top', 'right center', 'right bottom'
            ]
            return validOrigins.includes(value as string)
        }
    },
    /** Animación de apertura/cierre. */
    transition: {
        type: String as PropType<KunMenuTransition>,
        default: 'fade-scale', // animación por defecto
        validator: (val: unknown) => [
            'fade', 'fade-scale', 'slide-down', 'slide-up', 'slide-left', 'slide-right', 'none'
        ].includes(val as string)
    },
    /** No cierra al hacer click fuera ni con Escape. */
    persistent: Boolean,
    /** Z-index del contenido. */
    zIndex: [String, Number],
    /** Comportamiento de submenú (hereda contexto del padre). */
    submenu: Boolean,
    /** Etiqueta accesible del menú. */
    label: {
        type: String,
        default: 'Menú contextual'
    },
    /** Navegación con teclado (flechas/Enter/Escape). */
    keyboardNavigation: {
        type: Boolean,
        default: true
    },
    /** Oculta el área de detalles. */
    hideDetails: {
        type: Boolean,
        default: true,
    },
}
