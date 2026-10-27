/**
 * kunVariants.ts - Matriz unica `KunColor x KunVariant`.
 *
 * Unica fuente de clases de color para componentes. Los 42 pares estan
 * escritos como strings literales completos (nunca `bg-${x}`) para que el
 * scanner de Tailwind los detecte y emita. `solid` de `neutral` no usa
 * `bg-neutral`: conserva `bg-inverted` con un par de texto explícito,
 * `text-white dark:text-neutral-900`. Ningun componente aplica
 * `text-inverted`: ese token queda exclusivamente para uso manual del
 * consumidor.
 */
import { kunTheme } from './kunTheme.js';

/** Color semantico de componentes. */
export type KunColor = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral';
/** Variante visual compartida (estetica Nuxt `UButton`). */
export type KunVariant = 'solid' | 'outline' | 'soft' | 'subtle' | 'ghost' | 'link';

export const KUN_COLORS: KunColor[] = ['primary', 'secondary', 'success', 'info', 'warning', 'error', 'neutral'];
export const KUN_VARIANTS: KunVariant[] = ['solid', 'outline', 'soft', 'subtle', 'ghost', 'link'];

export function isKunColor(value: unknown): value is KunColor {
    return typeof value === 'string' && (KUN_COLORS as string[]).includes(value);
}
export function isKunVariant(value: unknown): value is KunVariant {
    return typeof value === 'string' && (KUN_VARIANTS as string[]).includes(value);
}

export const KUN_VARIANT_CLASSES: Record<KunColor, Record<KunVariant, string>> = {
    primary: {
        solid: 'text-highlighted bg-primary hover:bg-primary/75 active:bg-primary/75 focus-visible:outline-3 focus-visible:outline-primary/25',
        outline: 'text-primary ring ring-primary/50 hover:bg-primary/10 focus-visible:outline-3 focus-visible:outline-primary/25',
        soft: 'text-primary bg-primary/10 hover:bg-primary/15 focus-visible:outline-3 focus-visible:outline-primary/25',
        subtle: 'text-primary bg-primary/10 ring ring-primary/25 hover:bg-primary/15 focus-visible:outline-3 focus-visible:outline-primary/25',
        ghost: 'text-primary hover:bg-primary/10 focus-visible:outline-3 focus-visible:outline-primary/25',
        link: 'text-primary hover:text-primary/75 focus-visible:outline-3 focus-visible:outline-primary/25',
    },
    secondary: {
        solid: 'text-highlighted bg-secondary hover:bg-secondary/75 active:bg-secondary/75 focus-visible:outline-3 focus-visible:outline-secondary/25',
        outline: 'text-secondary ring ring-secondary/50 hover:bg-secondary/10 focus-visible:outline-3 focus-visible:outline-secondary/25',
        soft: 'text-secondary bg-secondary/10 hover:bg-secondary/15 focus-visible:outline-3 focus-visible:outline-secondary/25',
        subtle: 'text-secondary bg-secondary/10 ring ring-secondary/25 hover:bg-secondary/15 focus-visible:outline-3 focus-visible:outline-secondary/25',
        ghost: 'text-secondary hover:bg-secondary/10 focus-visible:outline-3 focus-visible:outline-secondary/25',
        link: 'text-secondary hover:text-secondary/75 focus-visible:outline-3 focus-visible:outline-secondary/25',
    },
    success: {
        solid: 'text-highlighted bg-success hover:bg-success/75 active:bg-success/75 focus-visible:outline-3 focus-visible:outline-success/25',
        outline: 'text-success ring ring-success/50 hover:bg-success/10 focus-visible:outline-3 focus-visible:outline-success/25',
        soft: 'text-success bg-success/10 hover:bg-success/15 focus-visible:outline-3 focus-visible:outline-success/25',
        subtle: 'text-success bg-success/10 ring ring-success/25 hover:bg-success/15 focus-visible:outline-3 focus-visible:outline-success/25',
        ghost: 'text-success hover:bg-success/10 focus-visible:outline-3 focus-visible:outline-success/25',
        link: 'text-success hover:text-success/75 focus-visible:outline-3 focus-visible:outline-success/25',
    },
    info: {
        solid: 'text-highlighted bg-info hover:bg-info/75 active:bg-info/75 focus-visible:outline-3 focus-visible:outline-info/25',
        outline: 'text-info ring ring-info/50 hover:bg-info/10 focus-visible:outline-3 focus-visible:outline-info/25',
        soft: 'text-info bg-info/10 hover:bg-info/15 focus-visible:outline-3 focus-visible:outline-info/25',
        subtle: 'text-info bg-info/10 ring ring-info/25 hover:bg-info/15 focus-visible:outline-3 focus-visible:outline-info/25',
        ghost: 'text-info hover:bg-info/10 focus-visible:outline-3 focus-visible:outline-info/25',
        link: 'text-info hover:text-info/75 focus-visible:outline-3 focus-visible:outline-info/25',
    },
    warning: {
        solid: 'text-highlighted bg-warning hover:bg-warning/75 active:bg-warning/75 focus-visible:outline-3 focus-visible:outline-warning/25',
        outline: 'text-warning ring ring-warning/50 hover:bg-warning/10 focus-visible:outline-3 focus-visible:outline-warning/25',
        soft: 'text-warning bg-warning/10 hover:bg-warning/15 focus-visible:outline-3 focus-visible:outline-warning/25',
        subtle: 'text-warning bg-warning/10 ring ring-warning/25 hover:bg-warning/15 focus-visible:outline-3 focus-visible:outline-warning/25',
        ghost: 'text-warning hover:bg-warning/10 focus-visible:outline-3 focus-visible:outline-warning/25',
        link: 'text-warning hover:text-warning/75 focus-visible:outline-3 focus-visible:outline-warning/25',
    },
    error: {
        solid: 'text-highlighted bg-error hover:bg-error/75 active:bg-error/75 focus-visible:outline-3 focus-visible:outline-error/25',
        outline: 'text-error ring ring-error/50 hover:bg-error/10 focus-visible:outline-3 focus-visible:outline-error/25',
        soft: 'text-error bg-error/10 hover:bg-error/15 focus-visible:outline-3 focus-visible:outline-error/25',
        subtle: 'text-error bg-error/10 ring ring-error/25 hover:bg-error/15 focus-visible:outline-3 focus-visible:outline-error/25',
        ghost: 'text-error hover:bg-error/10 focus-visible:outline-3 focus-visible:outline-error/25',
        link: 'text-error hover:text-error/75 focus-visible:outline-3 focus-visible:outline-error/25',
    },
    neutral: {
        solid: 'text-white dark:text-neutral-900 bg-inverted hover:bg-inverted/90 active:bg-inverted/90 focus-visible:outline-3 focus-visible:outline-inverted/25',
        outline: 'text-default ring ring-accented bg-default hover:bg-elevated focus-visible:outline-3 focus-visible:outline-inverted/25',
        soft: 'text-default bg-elevated hover:bg-accented/75 focus-visible:outline-3 focus-visible:outline-inverted/25',
        subtle: 'text-default bg-elevated ring ring-accented hover:bg-accented/75 focus-visible:outline-3 focus-visible:outline-inverted/25',
        ghost: 'text-default hover:bg-elevated focus-visible:outline-3 focus-visible:outline-inverted/25',
        link: 'text-muted hover:text-default focus-visible:outline-3 focus-visible:outline-inverted/25',
    },
};

/** Clases literales para un par color x variante. */
export function kunVariantClasses(color: KunColor, variant: KunVariant): string {
    return KUN_VARIANT_CLASSES[color][variant];
}

/**
 * Solo la capa de fondo de un par color x variante, para contenedores
 * (listas, superficies) donde el texto no debe teñirse entero. Shares la
 * semantica de `KUN_VARIANT_CLASSES` pero restringida a `bg-*`/ring de
 * superficie. `neutral` mantiene el trato especial de `solid` (`bg-inverted`).
 */
export const KUN_SURFACE_BG: Record<KunColor, Record<KunVariant, string>> = {
    primary: {
        solid: 'bg-primary',
        outline: 'bg-default ring ring-default',
        soft: 'bg-primary/10',
        subtle: 'bg-primary/10 ring ring-primary/25',
        ghost: '',
        link: '',
    },
    secondary: {
        solid: 'bg-secondary',
        outline: 'bg-default ring ring-default',
        soft: 'bg-secondary/10',
        subtle: 'bg-secondary/10 ring ring-secondary/25',
        ghost: '',
        link: '',
    },
    success: {
        solid: 'bg-success',
        outline: 'bg-default ring ring-default',
        soft: 'bg-success/10',
        subtle: 'bg-success/10 ring ring-success/25',
        ghost: '',
        link: '',
    },
    info: {
        solid: 'bg-info',
        outline: 'bg-default ring ring-default',
        soft: 'bg-info/10',
        subtle: 'bg-info/10 ring ring-info/25',
        ghost: '',
        link: '',
    },
    warning: {
        solid: 'bg-warning',
        outline: 'bg-default ring ring-default',
        soft: 'bg-warning/10',
        subtle: 'bg-warning/10 ring ring-warning/25',
        ghost: '',
        link: '',
    },
    error: {
        solid: 'bg-error',
        outline: 'bg-default ring ring-default',
        soft: 'bg-error/10',
        subtle: 'bg-error/10 ring ring-error/25',
        ghost: '',
        link: '',
    },
    neutral: {
        solid: 'bg-inverted',
        outline: 'bg-default ring ring-accented',
        soft: 'bg-elevated',
        subtle: 'bg-elevated ring ring-accented',
        ghost: '',
        link: '',
    },
};

/** Clases literales de solo fondo para un par color x variante. */
export function kunSurfaceBg(color: KunColor, variant: KunVariant): string {
    return KUN_SURFACE_BG[color][variant];
}

/**
 * Estado activo/seleccionado de items de lista, por color. Lleva modificador
 * `!` para ganarle al `bg-*`/`hover:bg-*` de la variante (ambos literales,
 * el orden del CSS generado no puede decidir el estado).
 */
export const KUN_SELECTED_CLASSES: Record<KunColor, string> = {
    primary: 'bg-primary/25! text-primary ring ring-inset ring-primary/50',
    secondary: 'bg-secondary/25! text-secondary ring ring-inset ring-secondary/50',
    success: 'bg-success/25! text-success ring ring-inset ring-success/50',
    info: 'bg-info/25! text-info ring ring-inset ring-info/50',
    warning: 'bg-warning/25! text-warning ring ring-inset ring-warning/50',
    error: 'bg-error/25! text-error ring ring-inset ring-error/50',
    neutral: 'bg-elevated! text-default ring ring-inset ring-accented',
};

/** Clases literales para el estado activo/seleccionado de un item. */
export function kunSelectedClasses(color: KunColor): string {
    return KUN_SELECTED_CLASSES[color];
}

/** Hover neutro para items seleccionables (sin estado activo), por color. */
export const KUN_HOVER_CLASSES: Record<KunColor, string> = {
    primary: 'hover:bg-primary/15',
    secondary: 'hover:bg-secondary/15',
    success: 'hover:bg-success/15',
    info: 'hover:bg-info/15',
    warning: 'hover:bg-warning/15',
    error: 'hover:bg-error/15',
    neutral: 'hover:bg-elevated',
};

/** Clases literales de hover para un item de lista seleccionable. */
export function kunHoverClasses(color: KunColor): string {
    return KUN_HOVER_CLASSES[color];
}

/**
 * Resuelve color/variante con fallback prop > `theme.defaults[component]` > default.
 * `null`/`undefined` en prop delega al theme global. `component` permite defaults
 * por componente (`button`, `list`); default `'button'`.
 */
export function resolveKunColor(prop: KunColor | null | undefined, component: 'button' | 'list' = 'button'): KunColor {
    if (prop) return prop;
    const configured = kunTheme.current.defaults?.[component]?.color;
    return configured ?? 'primary';
}
export function resolveKunVariant(prop: KunVariant | null | undefined, component: 'button' | 'list' = 'button'): KunVariant {
    if (prop) return prop;
    const configured = kunTheme.current.defaults?.[component]?.variant;
    return configured ?? 'solid';
}
