// Fields sobre la matriz `KunColor x KunVariant` (KunTextarea, KunFileInput).
//
// El `variant` de los fields es el mismo `KunVariant` canónico de la librería
// (`solid` | `outline` | `soft` | `subtle` | `ghost` | `link`), igual que
// Btn/Chip/Card. Este modulo define las clases estructurales de reposo:
// el fondo usa tokens de superficie (como hace `KUN_SURFACE_BG`), nunca
// `bg-${x}` interpolado (el scanner de Tailwind necesita literales).
//
// El `color` no prefiere todo el field: en `solid` pinta el fondo pleno con
// su par de texto contrastado, en `link` tintea el texto, y en el resto tine
// foco/error (ring), manteniendo el reposo neutral tipo Nuxt UI.

import type { KunColor, KunVariant } from '../theme/kunVariants.js';
import { kunSurfaceBg, kunTextClasses } from '../theme/kunVariants.js';

/** Par de texto contrastado sobre fondo pleno (`solid`), literal por color. */
export const KUN_FIELD_SOLID_TEXT: Record<KunColor, string> = {
    primary: 'text-highlighted',
    secondary: 'text-highlighted',
    success: 'text-highlighted',
    info: 'text-highlighted',
    warning: 'text-on-warning',
    error: 'text-highlighted',
    neutral: 'text-white dark:text-neutral-900',
};

/**
 * Fondo/estructura de reposo del field por variante (tokens de superficie).
 * En `outline` el borde visible lo dibuja alguien: por defecto aquí mismo
 * (`ring-inset`, caso FileInput); con `overlayBorder: true` lo dibuja un
 * overlay con muesca aparte (caso Textarea) y solo queda el fondo.
 */
export function kunFieldBaseClass(variant: KunVariant, color: KunColor, opts: { overlayBorder?: boolean } = {}): string {
    if (variant === 'solid') return kunSurfaceBg(color, 'solid');
    switch (variant) {
        case 'outline': return opts.overlayBorder ? 'bg-default' : 'bg-default ring ring-inset ring-accented';
        case 'soft': return 'bg-elevated';
        case 'subtle': return 'bg-elevated ring ring-inset ring-accented';
        default: return 'bg-transparent'; // ghost | link
    }
}

/** Color de texto del contenido/label del field por variante. */
export function kunFieldTextClass(variant: KunVariant, color: KunColor): string {
    if (variant === 'solid') return KUN_FIELD_SOLID_TEXT[color];
    if (variant === 'link') return kunTextClasses(color);
    return 'text-default';
}

/** Ring de foco por color (2px, con `!` para ganarle al `ring-accented` de reposo). */
export const KUN_FIELD_FOCUS_RING: Record<KunColor, string> = {
    primary: 'ring-2 ring-primary/50!',
    secondary: 'ring-2 ring-secondary/50!',
    success: 'ring-2 ring-success/50!',
    info: 'ring-2 ring-info/50!',
    warning: 'ring-2 ring-warning/50!',
    error: 'ring-2 ring-error/50!',
    neutral: 'ring-2 ring-accented!',
};

/** Ring de estado de error para fields con anillo/borde propio. */
export const KUN_FIELD_ERROR_RING = 'ring-2 ring-error/75!';

/** Borde de foco del overlay con muesca (variante `outline`) por color, literal. */
export const KUN_FIELD_FOCUS_BORDER: Record<KunColor, string> = {
    primary: 'border-primary',
    secondary: 'border-secondary',
    success: 'border-success',
    info: 'border-info',
    warning: 'border-warning',
    error: 'border-error',
    neutral: 'border-accented',
};
