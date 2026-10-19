/**
 * kunVariants.ts - Matriz unica `KunColor x KunVariant`.
 *
 * Unica fuente de clases de color para componentes. Los 42 pares estan
 * escritos como strings literales completos (nunca `bg-${x}`) para que el
 * scanner de Tailwind los detecte y emita. `solid` de `neutral` no usa
 * `bg-neutral`: sigue a Nuxt con `bg-inverted text-inverted`.
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
        solid: 'text-inverted bg-primary hover:bg-primary/75 active:bg-primary/75 focus-visible:outline-3 focus-visible:outline-primary/25',
        outline: 'text-primary ring ring-primary/50 hover:bg-primary/10 focus-visible:outline-3 focus-visible:outline-primary/25',
        soft: 'text-primary bg-primary/10 hover:bg-primary/15 focus-visible:outline-3 focus-visible:outline-primary/25',
        subtle: 'text-primary bg-primary/10 ring ring-primary/25 hover:bg-primary/15 focus-visible:outline-3 focus-visible:outline-primary/25',
        ghost: 'text-primary hover:bg-primary/10 focus-visible:outline-3 focus-visible:outline-primary/25',
        link: 'text-primary hover:text-primary/75 focus-visible:outline-3 focus-visible:outline-primary/25',
    },
    secondary: {
        solid: 'text-inverted bg-secondary hover:bg-secondary/75 active:bg-secondary/75 focus-visible:outline-3 focus-visible:outline-secondary/25',
        outline: 'text-secondary ring ring-secondary/50 hover:bg-secondary/10 focus-visible:outline-3 focus-visible:outline-secondary/25',
        soft: 'text-secondary bg-secondary/10 hover:bg-secondary/15 focus-visible:outline-3 focus-visible:outline-secondary/25',
        subtle: 'text-secondary bg-secondary/10 ring ring-secondary/25 hover:bg-secondary/15 focus-visible:outline-3 focus-visible:outline-secondary/25',
        ghost: 'text-secondary hover:bg-secondary/10 focus-visible:outline-3 focus-visible:outline-secondary/25',
        link: 'text-secondary hover:text-secondary/75 focus-visible:outline-3 focus-visible:outline-secondary/25',
    },
    success: {
        solid: 'text-inverted bg-success hover:bg-success/75 active:bg-success/75 focus-visible:outline-3 focus-visible:outline-success/25',
        outline: 'text-success ring ring-success/50 hover:bg-success/10 focus-visible:outline-3 focus-visible:outline-success/25',
        soft: 'text-success bg-success/10 hover:bg-success/15 focus-visible:outline-3 focus-visible:outline-success/25',
        subtle: 'text-success bg-success/10 ring ring-success/25 hover:bg-success/15 focus-visible:outline-3 focus-visible:outline-success/25',
        ghost: 'text-success hover:bg-success/10 focus-visible:outline-3 focus-visible:outline-success/25',
        link: 'text-success hover:text-success/75 focus-visible:outline-3 focus-visible:outline-success/25',
    },
    info: {
        solid: 'text-inverted bg-info hover:bg-info/75 active:bg-info/75 focus-visible:outline-3 focus-visible:outline-info/25',
        outline: 'text-info ring ring-info/50 hover:bg-info/10 focus-visible:outline-3 focus-visible:outline-info/25',
        soft: 'text-info bg-info/10 hover:bg-info/15 focus-visible:outline-3 focus-visible:outline-info/25',
        subtle: 'text-info bg-info/10 ring ring-info/25 hover:bg-info/15 focus-visible:outline-3 focus-visible:outline-info/25',
        ghost: 'text-info hover:bg-info/10 focus-visible:outline-3 focus-visible:outline-info/25',
        link: 'text-info hover:text-info/75 focus-visible:outline-3 focus-visible:outline-info/25',
    },
    warning: {
        solid: 'text-inverted bg-warning hover:bg-warning/75 active:bg-warning/75 focus-visible:outline-3 focus-visible:outline-warning/25',
        outline: 'text-warning ring ring-warning/50 hover:bg-warning/10 focus-visible:outline-3 focus-visible:outline-warning/25',
        soft: 'text-warning bg-warning/10 hover:bg-warning/15 focus-visible:outline-3 focus-visible:outline-warning/25',
        subtle: 'text-warning bg-warning/10 ring ring-warning/25 hover:bg-warning/15 focus-visible:outline-3 focus-visible:outline-warning/25',
        ghost: 'text-warning hover:bg-warning/10 focus-visible:outline-3 focus-visible:outline-warning/25',
        link: 'text-warning hover:text-warning/75 focus-visible:outline-3 focus-visible:outline-warning/25',
    },
    error: {
        solid: 'text-inverted bg-error hover:bg-error/75 active:bg-error/75 focus-visible:outline-3 focus-visible:outline-error/25',
        outline: 'text-error ring ring-error/50 hover:bg-error/10 focus-visible:outline-3 focus-visible:outline-error/25',
        soft: 'text-error bg-error/10 hover:bg-error/15 focus-visible:outline-3 focus-visible:outline-error/25',
        subtle: 'text-error bg-error/10 ring ring-error/25 hover:bg-error/15 focus-visible:outline-3 focus-visible:outline-error/25',
        ghost: 'text-error hover:bg-error/10 focus-visible:outline-3 focus-visible:outline-error/25',
        link: 'text-error hover:text-error/75 focus-visible:outline-3 focus-visible:outline-error/25',
    },
    neutral: {
        solid: 'text-inverted bg-inverted hover:bg-inverted/90 active:bg-inverted/90 focus-visible:outline-3 focus-visible:outline-inverted/25',
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
 * Resuelve color/variante con fallback prop > `theme.defaults.button` > default.
 * `null`/`undefined` en prop delega al theme global.
 */
export function resolveKunColor(prop: KunColor | null | undefined): KunColor {
    if (prop) return prop;
    const configured = kunTheme.current.defaults?.button?.color;
    return configured ?? 'primary';
}
export function resolveKunVariant(prop: KunVariant | null | undefined): KunVariant {
    if (prop) return prop;
    const configured = kunTheme.current.defaults?.button?.variant;
    return configured ?? 'solid';
}
