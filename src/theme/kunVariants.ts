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
 *
 * Roles de color (ver `theme.css`, capa 2):
 * - `solid`: superficie `bg-{color}` + tinta `text-on-{color}` (AA por modo).
 * - texto/ring/outline (`text-{color}`, `ring-{color}/NN`): rol tonal por
 *   override de namespace (700 light / 300 dark).
 * - tintes translucidos: siempre `bg-{color}-tint/NN`, nunca `bg-{color}/NN`
 *   (la superficie dark es 700 y un tinte de ella seria invisible; el tint
 *   es 400 en light y 300 en dark). Seleccionado: tint /20 + ring /50.
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
        solid: 'text-on-primary bg-primary hover:bg-primary/75 active:bg-primary/75 focus-visible:outline-3 focus-visible:outline-primary/25',
        outline: 'text-primary ring ring-primary/50 hover:bg-primary-tint/10 focus-visible:outline-3 focus-visible:outline-primary/25',
        soft: 'text-primary bg-primary-tint/10 hover:bg-primary-tint/15 focus-visible:outline-3 focus-visible:outline-primary/25',
        subtle: 'text-primary bg-primary-tint/10 ring ring-primary/40 hover:bg-primary-tint/15 focus-visible:outline-3 focus-visible:outline-primary/25',
        ghost: 'text-primary hover:bg-primary-tint/10 focus-visible:outline-3 focus-visible:outline-primary/25',
        link: 'text-primary hover:text-primary/75 focus-visible:outline-3 focus-visible:outline-primary/25',
    },
    secondary: {
        solid: 'text-on-secondary bg-secondary hover:bg-secondary/75 active:bg-secondary/75 focus-visible:outline-3 focus-visible:outline-secondary/25',
        outline: 'text-secondary ring ring-secondary/50 hover:bg-secondary-tint/10 focus-visible:outline-3 focus-visible:outline-secondary/25',
        soft: 'text-secondary bg-secondary-tint/10 hover:bg-secondary-tint/15 focus-visible:outline-3 focus-visible:outline-secondary/25',
        subtle: 'text-secondary bg-secondary-tint/10 ring ring-secondary/40 hover:bg-secondary-tint/15 focus-visible:outline-3 focus-visible:outline-secondary/25',
        ghost: 'text-secondary hover:bg-secondary-tint/10 focus-visible:outline-3 focus-visible:outline-secondary/25',
        link: 'text-secondary hover:text-secondary/75 focus-visible:outline-3 focus-visible:outline-secondary/25',
    },
    success: {
        solid: 'text-on-success bg-success hover:bg-success/75 active:bg-success/75 focus-visible:outline-3 focus-visible:outline-success/25',
        outline: 'text-success ring ring-success/50 hover:bg-success-tint/10 focus-visible:outline-3 focus-visible:outline-success/25',
        soft: 'text-success bg-success-tint/10 hover:bg-success-tint/15 focus-visible:outline-3 focus-visible:outline-success/25',
        subtle: 'text-success bg-success-tint/10 ring ring-success/40 hover:bg-success-tint/15 focus-visible:outline-3 focus-visible:outline-success/25',
        ghost: 'text-success hover:bg-success-tint/10 focus-visible:outline-3 focus-visible:outline-success/25',
        link: 'text-success hover:text-success/75 focus-visible:outline-3 focus-visible:outline-success/25',
    },
    info: {
        solid: 'text-on-info bg-info hover:bg-info/75 active:bg-info/75 focus-visible:outline-3 focus-visible:outline-info/25',
        outline: 'text-info ring ring-info/50 hover:bg-info-tint/10 focus-visible:outline-3 focus-visible:outline-info/25',
        soft: 'text-info bg-info-tint/10 hover:bg-info-tint/15 focus-visible:outline-3 focus-visible:outline-info/25',
        subtle: 'text-info bg-info-tint/10 ring ring-info/40 hover:bg-info-tint/15 focus-visible:outline-3 focus-visible:outline-info/25',
        ghost: 'text-info hover:bg-info-tint/10 focus-visible:outline-3 focus-visible:outline-info/25',
        link: 'text-info hover:text-info/75 focus-visible:outline-3 focus-visible:outline-info/25',
    },
    warning: {
        solid: 'text-on-warning bg-warning hover:bg-warning/75 active:bg-warning/75 focus-visible:outline-3 focus-visible:outline-warning/25',
        outline: 'text-warning ring ring-warning/50 hover:bg-warning-tint/10 focus-visible:outline-3 focus-visible:outline-warning/25',
        soft: 'text-warning bg-warning-tint/10 hover:bg-warning-tint/15 focus-visible:outline-3 focus-visible:outline-warning/25',
        subtle: 'text-warning bg-warning-tint/10 ring ring-warning/40 hover:bg-warning-tint/15 focus-visible:outline-3 focus-visible:outline-warning/25',
        ghost: 'text-warning hover:bg-warning-tint/10 focus-visible:outline-3 focus-visible:outline-warning/25',
        link: 'text-warning hover:text-warning/75 focus-visible:outline-3 focus-visible:outline-warning/25',
    },
    error: {
        solid: 'text-on-error bg-error hover:bg-error/75 active:bg-error/75 focus-visible:outline-3 focus-visible:outline-error/25',
        outline: 'text-error ring ring-error/50 hover:bg-error-tint/10 focus-visible:outline-3 focus-visible:outline-error/25',
        soft: 'text-error bg-error-tint/10 hover:bg-error-tint/15 focus-visible:outline-3 focus-visible:outline-error/25',
        subtle: 'text-error bg-error-tint/10 ring ring-error/40 hover:bg-error-tint/15 focus-visible:outline-3 focus-visible:outline-error/25',
        ghost: 'text-error hover:bg-error-tint/10 focus-visible:outline-3 focus-visible:outline-error/25',
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
        soft: 'bg-primary-tint/10',
        subtle: 'bg-primary-tint/10 ring ring-primary/40',
        ghost: '',
        link: '',
    },
    secondary: {
        solid: 'bg-secondary',
        outline: 'bg-default ring ring-default',
        soft: 'bg-secondary-tint/10',
        subtle: 'bg-secondary-tint/10 ring ring-secondary/40',
        ghost: '',
        link: '',
    },
    success: {
        solid: 'bg-success',
        outline: 'bg-default ring ring-default',
        soft: 'bg-success-tint/10',
        subtle: 'bg-success-tint/10 ring ring-success/40',
        ghost: '',
        link: '',
    },
    info: {
        solid: 'bg-info',
        outline: 'bg-default ring ring-default',
        soft: 'bg-info-tint/10',
        subtle: 'bg-info-tint/10 ring ring-info/40',
        ghost: '',
        link: '',
    },
    warning: {
        solid: 'bg-warning',
        outline: 'bg-default ring ring-default',
        soft: 'bg-warning-tint/10',
        subtle: 'bg-warning-tint/10 ring ring-warning/40',
        ghost: '',
        link: '',
    },
    error: {
        solid: 'bg-error',
        outline: 'bg-default ring ring-default',
        soft: 'bg-error-tint/10',
        subtle: 'bg-error-tint/10 ring ring-error/40',
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
    primary: 'bg-primary-tint/20! text-primary ring ring-inset ring-primary/50',
    secondary: 'bg-secondary-tint/20! text-secondary ring ring-inset ring-secondary/50',
    success: 'bg-success-tint/20! text-success ring ring-inset ring-success/50',
    info: 'bg-info-tint/20! text-info ring ring-inset ring-info/50',
    warning: 'bg-warning-tint/20! text-warning ring ring-inset ring-warning/50',
    error: 'bg-error-tint/20! text-error ring ring-inset ring-error/50',
    neutral: 'bg-elevated! text-default ring ring-inset ring-accented',
};

/** Clases literales para el estado activo/seleccionado de un item. */
export function kunSelectedClasses(color: KunColor): string {
    return KUN_SELECTED_CLASSES[color];
}

/** Hover neutro para items seleccionables (sin estado activo), por color. */
export const KUN_HOVER_CLASSES: Record<KunColor, string> = {
    primary: 'hover:bg-primary-tint/15',
    secondary: 'hover:bg-secondary-tint/15',
    success: 'hover:bg-success-tint/15',
    info: 'hover:bg-info-tint/15',
    warning: 'hover:bg-warning-tint/15',
    error: 'hover:bg-error-tint/15',
    neutral: 'hover:bg-elevated',
};

/** Clases literales de hover para un item de lista seleccionable. */
export function kunHoverClasses(color: KunColor): string {
    return KUN_HOVER_CLASSES[color];
}

/**
 * Tinta sobre la superficie solida de un color (`kunSurfaceBg(color, 'solid')`).
 * Para glifos/texto sobre `bg-{color}`: nunca `text-highlighted` fijo, porque
 * la superficie cambia de luminancia por modo y por paleta.
 */
export const KUN_ON_SURFACE_TEXT: Record<KunColor, string> = {
    primary: 'text-on-primary',
    secondary: 'text-on-secondary',
    success: 'text-on-success',
    info: 'text-on-info',
    warning: 'text-on-warning',
    error: 'text-on-error',
    neutral: 'text-white dark:text-neutral-900',
};

/** Clase literal de tinta sobre la superficie solida de un color. */
export function kunOnSurfaceText(color: KunColor): string {
    return KUN_ON_SURFACE_TEXT[color];
}

const SOLID_BG_RE = /(?:^|\s)bg-(primary|secondary|success|info|warning|error)(?=\s|$)/;

/**
 * Si una cadena de clases pinta una superficie semantica solida (`bg-error`,
 * no `bg-error/10` ni `hover:bg-error`), devuelve su tinta `text-on-*`; si no,
 * `null`. Lo usan los campos con `bgInput` para que valor, prefijo y label se
 * lean sobre el fondo elegido por el consumidor.
 */
export function kunOnSurfaceTextFromBg(classes: string | null | undefined): string | null {
    if (!classes) return null;
    const match = SOLID_BG_RE.exec(classes);
    return match ? KUN_ON_SURFACE_TEXT[match[1] as KunColor] : null;
}

/** Solo la capa de texto de un color (para glifos dentro de controles: ✓ del checkbox). */
export const KUN_TEXT_COLORS: Record<KunColor, string> = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    success: 'text-success',
    info: 'text-info',
    warning: 'text-warning',
    error: 'text-error',
    neutral: 'text-default',
};

/** Clases literales de solo texto para un color. */
export function kunTextClasses(color: KunColor): string {
    return KUN_TEXT_COLORS[color];
}

/** Componentes con defaults de color/variante configurables vía `kunTheme.configure({ defaults })`. */
export type KunThemeComponent = 'button' | 'list' | 'avatar' | 'card' | 'toolbar-items' | 'input';

/** Fallback cuando no hay default configurado (ni prop). */
const KUN_FALLBACK_COLOR: Record<KunThemeComponent, KunColor> = {
    button: 'primary',
    list: 'primary',
    avatar: 'neutral',
    card: 'neutral',
    'toolbar-items': 'neutral',
    input: 'primary',
};

/** Fallback de variante. */
const KUN_FALLBACK_VARIANT: Record<KunThemeComponent, KunVariant> = {
    button: 'solid',
    list: 'soft',
    avatar: 'soft',
    card: 'solid',
    'toolbar-items': 'ghost',
    input: 'outline',
};

/**
 * Resuelve color/variante con fallback prop > `theme.defaults[component]` > default.
 * `null`/`undefined` en prop delega al theme global. `component` permite defaults
 * por componente (`button`, `list`, `avatar`, `card`, `toolbar-items`, `input`);
 * default `'button'`.
 */
export function resolveKunColor(prop: KunColor | null | undefined, component: KunThemeComponent = 'button'): KunColor {
    if (prop) return prop;
    const configured = (kunTheme.current.defaults as Record<string, { color?: KunColor } | undefined> | undefined)?.[component]?.color;
    return configured ?? KUN_FALLBACK_COLOR[component];
}
export function resolveKunVariant(prop: KunVariant | null | undefined, component: KunThemeComponent = 'button'): KunVariant {
    if (prop) return prop;
    const configured = (kunTheme.current.defaults as Record<string, { variant?: KunVariant } | undefined> | undefined)?.[component]?.variant;
    return configured ?? KUN_FALLBACK_VARIANT[component];
}
