/**
 * kunTheme.ts - Theme global KunUI (color, radio, fuente, colorMode).
 *
 * Separado de `kunConfig` (locale/currency/date) por decision de diseno.
 * El color activo es siempre un alias a una paleta completa `50-950`:
 * nombre del catalogo Tailwind o paleta publicada por `registerPalette`.
 * Un HEX jamas se escribe directo como semántico.
 */
import { reactive, readonly, inject, type InjectionKey, type DeepReadonly } from 'vue';
import type { KunColor, KunVariant } from './kunVariants.js';
import {
    KUN_COLOR_CATALOG_HEX,
    type KunCatalogHexStop,
    type KunCatalogPaletteName,
} from './kunColorCatalogHex.js';

/** Nombres de Tailwind con escala `50-950` (black/white excluidos, como Nuxt). */
export const KUN_PALETTE_CATALOG = [
    'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal',
    'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink',
    'rose', 'slate', 'gray', 'zinc', 'neutral', 'stone',
] as const;
export type KunPaletteName = (typeof KUN_PALETTE_CATALOG)[number];

/** Neutros que pueden gobernar texto/fondo/borde. */
export const KUN_NEUTRAL_CATALOG = ['slate', 'gray', 'zinc', 'neutral', 'stone'] as const;
export type KunNeutralName = (typeof KUN_NEUTRAL_CATALOG)[number];

/** Slots semanticos con escala propia. */
export type KunSemanticSlot = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error';
export type KunColorMode = 'light' | 'dark' | 'system';

export interface KunFontOptions {
    sans?: string;
    mono?: string;
}

export interface KunThemeOptions {
    primary?: string;
    secondary?: string;
    success?: string;
    info?: string;
    warning?: string;
    error?: string;
    neutral?: string;
    radius?: string;
    font?: KunFontOptions;
    colorMode?: KunColorMode;
    /** Defaults por componente (resueltos con prop > theme > default). */
    defaults?: {
        button?: {
            color?: KunColor;
            variant?: KunVariant;
        };
        list?: {
            color?: KunColor;
            variant?: KunVariant;
        };
        /** Fields (KunTextarea, KunFileInput). */
        input?: {
            color?: KunColor;
            variant?: KunVariant;
        };
    };
}

interface KunThemeState extends Required<Omit<KunThemeOptions, 'font' | 'defaults'>> {
    font: { sans: string; mono: string };
    defaults: {
        button: { color: KunColor; variant: KunVariant };
        list: { color: KunColor; variant: KunVariant };
        input: { color: KunColor; variant: KunVariant };
    };
}

const STOPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
const SLOTS: KunSemanticSlot[] = ['primary', 'secondary', 'success', 'info', 'warning', 'error'];
const DEFAULT_PALETTES: Record<KunSemanticSlot, KunPaletteName> = {
    primary: 'sky',
    secondary: 'blue',
    success: 'green',
    info: 'blue',
    // amber en vez de yellow: mismo rol de alerta, luminancia alineada con el
    // resto de los semanticos al mismo stop (ver theme.css, capa 1).
    warning: 'amber',
    error: 'red',
};
const DEFAULT_NEUTRAL: KunNeutralName = 'slate';
const DEFAULT_RADIUS = '0.25rem';
/** Nombre del registro que crea el azucar `setX('#hex')`: `custom-primary`, `custom-neutral`, … */
export function customPaletteName(slot: KunSemanticSlot | 'neutral'): string {
    return `custom-${slot}`;
}

const STORE_KEYS = {
    primary: 'kun:theme:primary',
    neutral: 'kun:theme:neutral',
    radius: 'kun:theme:radius',
    font: 'kun:theme:font',
    colorMode: 'kun:theme:colorMode',
    defaults: 'kun:theme:defaults',
} as const;

function isCatalog(name: string): name is KunPaletteName {
    return (KUN_PALETTE_CATALOG as readonly string[]).includes(name);
}
function isNeutralCatalog(name: string): name is KunNeutralName {
    return (KUN_NEUTRAL_CATALOG as readonly string[]).includes(name);
}
/**
 * La paleta solo sirve si sus stops existen en el CSS efectivo. Con el dist
 * precompilado solo están las paletas referenciadas; con `theme.css` compilado
 * por la app están todas. Sin documento (SSR) se asume presente: el navegador
 * lo tendrá si el contrato se cumple.
 */
function catalogAvailable(name: string): boolean {
    const el = root();
    if (!el || typeof getComputedStyle === 'undefined') return true;
    return getComputedStyle(el).getPropertyValue(`--color-${name}-500`).trim() !== '';
}
function isHex(value: string): boolean {
    return /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value.trim());
}
/** Guardas locales (evitan ciclo runtime con kunVariants, que importa este módulo). */
function isButtonColor(value: unknown): value is KunColor {
    return (
        value === 'primary' ||
        value === 'secondary' ||
        value === 'success' ||
        value === 'info' ||
        value === 'warning' ||
        value === 'error' ||
        value === 'neutral'
    );
}
function isButtonVariant(value: unknown): value is KunVariant {
    return (
        value === 'solid' ||
        value === 'outline' ||
        value === 'soft' ||
        value === 'subtle' ||
        value === 'ghost' ||
        value === 'link'
    );
}
function root(): HTMLElement | null {
    return typeof document === 'undefined' ? null : document.documentElement;
}
function setVar(el: HTMLElement, name: string, value: string): void {
    el.style.setProperty(name, value);
}

/* ---------- oklch (matematica pura, sin dependencias) ---------- */
interface Oklch { l: number; c: number; h: number; }

function hexToRgb(hex: string): [number, number, number] | null {
    let h = hex.trim().replace(/^#/, '');
    if (h.length === 3) h = h.split('').map((c) => c + c).join('');
    if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}
function srgbToLinear(c: number): number {
    c /= 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}
function linearToSrgb(c: number): number {
    const v = c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
    return Math.round(v * 255);
}
function rgbToOklch(r: number, g: number, b: number): Oklch {
    // M1 combinada: linear-sRGB -> LMS (Ottosson; incluye sRGB->XYZ).
    const rl = srgbToLinear(r), gl = srgbToLinear(g), bl = srgbToLinear(b);
    const l = 0.4122214708 * rl + 0.5363325363 * gl + 0.0514459929 * bl;
    const m = 0.2119034982 * rl + 0.6806995451 * gl + 0.1073969566 * bl;
    const s = 0.0883024619 * rl + 0.2817188376 * gl + 0.6299787005 * bl;
    const l_ = Math.cbrt(l), m_ = Math.cbrt(m), s_ = Math.cbrt(s);
    const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
    const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
    const bb = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;
    return { l: L, c: Math.hypot(a, bb), h: Math.atan2(bb, a) };
}
function oklchToRgb(L: number, C: number, H: number): [number, number, number] {
    const a = C * Math.cos(H), b = C * Math.sin(H);
    const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
    const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
    const s_ = L - 0.0894841775 * a - 1.291485548 * b;
    const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3;
    return [
        linearToSrgb(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
        linearToSrgb(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
        linearToSrgb(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
    ];
}
function inGamut(rgb: [number, number, number]): boolean {
    return rgb.every((c) => c >= 0 && c <= 255);
}
function toHex(rgb: [number, number, number]): string {
    return '#' + rgb.map((c) => Math.max(0, Math.min(255, c)).toString(16).padStart(2, '0')).join('');
}
function luminance(hex: string): number {
    const rgb = hexToRgb(hex);
    if (!rgb) return 0;
    const [r, g, b] = rgb.map(srgbToLinear);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
/** Contraste WCAG contra blanco. */
export function contrastOnWhite(hex: string): number {
    return 1.05 / (luminance(hex) + 0.05);
}

/**
 * Genera 11 stops desde un HEX. El 500 es el color exacto de la marca.
 * Curva de L estrictamente decreciente con el índice, sin tocar el 500:
 * en marcas casi-blancas/casi-negras los extremos se comprimen pero nunca
 * se invierten. Matiz fijo, croma atenuado hacia el blanco y reducido
 * hasta entrar en gamut sRGB.
 */
function generateScale(hex: string): string[] | null {
    const rgb = hexToRgb(hex);
    if (!rgb) return null;
    const { l: L0, c: C0, h: H } = rgbToOklch(rgb[0], rgb[1], rgb[2]);
    const lightTop = Math.min(0.995, L0 + Math.max(0.04, 0.98 - L0));
    const darkFloor = Math.max(0.02, L0 - Math.max(0.04, L0 - 0.18));
    const lightL = [0, 1, 2, 3, 4].map((i) => lightTop + (L0 - lightTop) * ((i + 1) / 6));
    const darkL = [0, 1, 2, 3, 4].map((i) => L0 + (darkFloor - L0) * ((i + 1) / 6));
    const targets = [...lightL, L0, ...darkL];
    for (let i = 1; i < targets.length; i++) {
        if (i === 5) continue;
        if (targets[i]! >= targets[i - 1]!) targets[i] = targets[i - 1]! - 1e-4;
    }
    const stops: string[] = [];
    for (let i = 0; i < targets.length; i++) {
        let C = i < 5 ? C0 * (1 - ((5 - i) / 5) * 0.85) : i === 5 ? C0 : C0 * (1 - ((i - 5) / 5) * 0.35);
        let out = oklchToRgb(targets[i]!, C, H);
        let guard = 0;
        while (!inGamut(out) && C > 1e-4 && guard++ < 200) {
            C *= 0.95;
            out = oklchToRgb(targets[i]!, C, H);
        }
        stops.push(toHex(out));
    }
    const exact = hexToRgb(hex);
    stops[5] = exact ? toHex(exact) : stops[5]!;
    // Marca atada al blanco: nada es más claro que el brand; los claros
    // colapsan al HEX exacto en vez de fingir una escala.
    if (L0 >= 0.995) for (let i = 0; i < 5; i++) stops[i] = stops[5]!;
    return stops;
}

/* ---------- estado ---------- */
const state = reactive<KunThemeState>({    primary: DEFAULT_PALETTES.primary,
    secondary: DEFAULT_PALETTES.secondary,
    success: DEFAULT_PALETTES.success,
    info: DEFAULT_PALETTES.info,
    warning: DEFAULT_PALETTES.warning,
    error: DEFAULT_PALETTES.error,
    neutral: DEFAULT_NEUTRAL,
    radius: DEFAULT_RADIUS,
    font: { sans: '', mono: '' },
    colorMode: 'light',
    defaults: {
        button: { color: 'primary', variant: 'solid' },
        list: { color: 'primary', variant: 'soft' },
        input: { color: 'primary', variant: 'outline' },
    },
});

/** Stops publicados por `registerPalette`, para recalcular `on-*` al aliasar. */
const paletteStops = new Map<string, string[]>();
/** Origen persistible: un HEX o los 11 stops unidos por coma. */
const paletteSource = new Map<string, string>();

export const KUN_THEME_KEY: InjectionKey<DeepReadonly<KunThemeState>> = Symbol('kunTheme');

let mediaQuery: MediaQueryList | null = null;
let mediaListener: ((e: MediaQueryListEvent) => void) | null = null;

function stopVar(slot: string, stop: number): string {
    return `--kun-color-${slot}-${stop}`;
}
function applyAlias(slot: string, palette: string): void {
    const el = root();
    if (!el) return;
    const prefix = isCatalog(palette) ? `--color-${palette}-` : `--kun-palette-${palette}-`;
    for (const stop of STOPS) setVar(el, stopVar(slot, stop), `var(${prefix}${stop})`);
    publishAlphaVars();
}
function applyNeutralAlias(palette: string): void {
    const el = root();
    if (!el) return;
    const prefix = isCatalog(palette) ? `--color-${palette}-` : `--kun-palette-${palette}-`;
    for (const stop of STOPS) setVar(el, `--kun-color-neutral-${stop}`, `var(${prefix}${stop})`);
    publishAlphaVars();
}

/** Opacidades que emiten las utilidades de `kunVariants` / superficies. */
const ALPHA_PCTS = [10, 15, 20, 25, 30, 40, 50, 75, 90] as const;

function hexToRgba(hex: string, pct: number): string {
    const rgb = hexToRgb(hex);
    if (!rgb) return 'transparent';
    const alpha = pct / 100;
    const alphaStr = Number.isInteger(alpha) ? String(alpha) : String(Math.round(alpha * 100) / 100);
    return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alphaStr})`;
}

function resolvePaletteHex(palette: string, stop: number): string | null {
    if (isCatalog(palette)) {
        const scale = KUN_COLOR_CATALOG_HEX[palette as KunCatalogPaletteName];
        return scale?.[stop as KunCatalogHexStop] ?? null;
    }
    const list = paletteStops.get(palette);
    if (!list) return null;
    const idx = STOPS.indexOf(stop as (typeof STOPS)[number]);
    return idx >= 0 ? list[idx]! : null;
}

function isDocumentDark(): boolean {
    const el = root();
    if (!el) return false;
    return el.classList.contains('dark') || el.getAttribute('data-theme') === 'dark';
}

/**
 * Publica `--kun-{token}-{pct}` en rgba para el fallback sin `color-mix`
 * (`compat-alpha.css`). Los navegadores con color-mix ignoran esas utilidades
 * override y siguen en oklab; esto solo alimenta el camino legacy.
 */
function publishAlphaVars(): void {
    const el = root();
    if (!el) return;
    const dark = isDocumentDark();

    for (const slot of SLOTS) {
        const stop = slot === 'warning' ? (dark ? 700 : 500) : dark ? 400 : 500;
        const hex = resolvePaletteHex(state[slot], stop);
        if (!hex) continue;
        for (const pct of ALPHA_PCTS) setVar(el, `--kun-${slot}-${pct}`, hexToRgba(hex, pct));
    }

    const tonalHex = resolvePaletteHex(state.warning, dark ? 400 : 500);
    if (tonalHex) {
        for (const pct of ALPHA_PCTS) {
            setVar(el, `--kun-text-warning-tonal-${pct}`, hexToRgba(tonalHex, pct));
        }
    }

    const elevated = resolvePaletteHex(state.neutral, dark ? 800 : 100);
    const accented = resolvePaletteHex(state.neutral, dark ? 700 : 200);
    const inverted = dark ? '#ffffff' : resolvePaletteHex(state.neutral, 900);
    if (elevated) {
        for (const pct of [50, 80, 95] as const) {
            setVar(el, `--kun-bg-elevated-${pct}`, hexToRgba(elevated, pct));
        }
    }
    if (accented) setVar(el, '--kun-bg-accented-75', hexToRgba(accented, 75));
    if (inverted) {
        setVar(el, '--kun-bg-inverted-90', hexToRgba(inverted, 90));
        setVar(el, '--kun-border-inverted-25', hexToRgba(inverted, 25));
    }
}
function persistedValue(name: string): string {
    const source = paletteSource.get(name);
    return source ? `${name}:${source}` : name;
}
function decodePersisted(raw: string): { name: string; payload: string | Record<number, string> } | null {
    const sep = raw.indexOf(':');
    if (sep <= 0) return null;
    const name = raw.slice(0, sep);
    const payload = raw.slice(sep + 1);
    if (isCatalog(name)) return null;
    if (isHex(payload)) return { name, payload };
    const parts = payload.split(',').map((part) => part.trim());
    if (parts.length !== STOPS.length || parts.some((part) => !isHex(part))) return null;
    const record: Record<number, string> = {};
    STOPS.forEach((stop, index) => { record[stop] = parts[index]!; });
    return { name, payload: record };
}
function persist(key: string, value: string): void {
    try {
        if (typeof localStorage !== 'undefined') localStorage.setItem(key, value);
    } catch { /* almacenamiento no disponible */ }
}
function readStore(key: string): string | null {
    try {
        return typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
    } catch {
        return null;
    }
}

function applyColorMode(mode: KunColorMode): void {
    const el = root();
    if (mediaListener && mediaQuery) {
        mediaQuery.removeEventListener('change', mediaListener);
        mediaListener = null;
        mediaQuery = null;
    }
    const dark =
        mode === 'dark' ||
        (mode === 'system' &&
            typeof window !== 'undefined' &&
            window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (el) {
        el.setAttribute('data-theme', dark ? 'dark' : 'light');
        el.classList.toggle('dark', dark);
    }
    publishAlphaVars();
    if (mode === 'system' && typeof window !== 'undefined') {
        mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaListener = (e) => {
            const doc = root();
            if (!doc) return;
            doc.setAttribute('data-theme', e.matches ? 'dark' : 'light');
            doc.classList.toggle('dark', e.matches);
            publishAlphaVars();
        };
        mediaQuery.addEventListener('change', mediaListener);
    }
}

function setSlot(slot: KunSemanticSlot, value: string): boolean {
    if (isCatalog(value)) {
        if (!catalogAvailable(value)) return false;
        state[slot] = value;
        applyAlias(slot, value);
        persist(`kun:theme:${slot}`, value);
        return true;
    }
    if (isHex(value)) {
        const name = customPaletteName(slot);
        if (!kunTheme.registerPalette(name, value)) return false;
        state[slot] = name;
        applyAlias(slot, name);
        persist(`kun:theme:${slot}`, persistedValue(name));
        return true;
    }
    if (!paletteStops.has(value)) return false;
    state[slot] = value;
    applyAlias(slot, value);
    persist(`kun:theme:${slot}`, persistedValue(value));
    return true;
}

export const kunTheme = {
    get current(): DeepReadonly<KunThemeState> {
        return readonly(state);
    },

    configure(options: KunThemeOptions = {}): void {
        if (options.primary !== undefined) setSlot('primary', options.primary);
        if (options.secondary !== undefined) setSlot('secondary', options.secondary);
        if (options.success !== undefined) setSlot('success', options.success);
        if (options.info !== undefined) setSlot('info', options.info);
        if (options.warning !== undefined) setSlot('warning', options.warning);
        if (options.error !== undefined) setSlot('error', options.error);
        if (options.neutral !== undefined) kunTheme.setNeutral(options.neutral);
        if (options.radius !== undefined) kunTheme.setRadius(options.radius);
        if (options.font !== undefined) kunTheme.setFont(options.font);
        if (options.colorMode !== undefined) kunTheme.setColorMode(options.colorMode);
        if (options.defaults?.button !== undefined) {
            Object.assign(state.defaults.button, options.defaults.button);
            persist(STORE_KEYS.defaults, JSON.stringify(state.defaults));
        }
        if (options.defaults?.list !== undefined) {
            Object.assign(state.defaults.list, options.defaults.list);
            persist(STORE_KEYS.defaults, JSON.stringify(state.defaults));
        }
        if (options.defaults?.input !== undefined) {
            Object.assign(state.defaults.input, options.defaults.input);
            persist(STORE_KEYS.defaults, JSON.stringify(state.defaults));
        }
    },

    reset(): void {
        if (mediaListener && mediaQuery) {
            mediaQuery.removeEventListener('change', mediaListener);
            mediaListener = null;
            mediaQuery = null;
        }
        try {
            if (typeof localStorage !== 'undefined') {
                for (const key of Object.values(STORE_KEYS)) localStorage.removeItem(key);
                for (const slot of SLOTS) localStorage.removeItem(`kun:theme:${slot}`);
            }
        } catch { /* noop */ }
        const el = root();
        if (el) {
            for (const slot of [...SLOTS, 'neutral']) {
                for (const stop of STOPS) el.style.removeProperty(stopVar(slot, stop));
            }
            for (const name of paletteStops.keys()) {
                for (const stop of STOPS) el.style.removeProperty(`--kun-palette-${name}-${stop}`);
            }
            el.style.removeProperty('--kun-radius');
            el.style.removeProperty('--kun-font-sans');
            el.style.removeProperty('--kun-font-mono');
        }
        paletteStops.clear();
        paletteSource.clear();
        Object.assign(state, {
            ...DEFAULT_PALETTES,
            neutral: DEFAULT_NEUTRAL,
            radius: DEFAULT_RADIUS,
            font: { sans: '', mono: '' },
            colorMode: 'light' as KunColorMode,
            defaults: {
                button: { color: 'primary' as KunColor, variant: 'solid' as KunVariant },
                list: { color: 'primary' as KunColor, variant: 'soft' as KunVariant },
                input: { color: 'primary' as KunColor, variant: 'outline' as KunVariant },
            },
        });
        applyColorMode('light');
    },

    setPrimary(value: string): boolean {
        return setSlot('primary', value);
    },
    setColor(slot: KunSemanticSlot, value: string): boolean {
        return setSlot(slot, value);
    },

    setNeutral(value: string): boolean {
        if (isNeutralCatalog(value)) {
            if (!catalogAvailable(value)) return false;
            state.neutral = value;
            applyNeutralAlias(value);
            persist(STORE_KEYS.neutral, value);
            return true;
        }
        if (isHex(value)) {
            const name = customPaletteName('neutral');
            if (!kunTheme.registerPalette(name, value)) return false;
            state.neutral = name;
            applyNeutralAlias(name);
            persist(STORE_KEYS.neutral, persistedValue(name));
            return true;
        }
        if (!paletteStops.has(value)) return false;
        state.neutral = value;
        applyNeutralAlias(value);
        persist(STORE_KEYS.neutral, persistedValue(value));
        return true;
    },

    /**
     * Publica una paleta completa como `--kun-palette-{name}-*`.
     * Atomica: con un HEX invalido o un set incompleto devuelve `false`
     * y no escribe ninguna variable. Los nombres del catalogo no se pisan.
     */
    registerPalette(name: string, stops: string | Record<number, string>): boolean {
        if (isCatalog(name)) return false;
        let list: string[] | null;
        if (typeof stops === 'string') {
            if (!isHex(stops)) return false;
            list = generateScale(stops);
        } else {
            const arr = STOPS.map((s) => stops[s]);
            if (arr.some((h) => typeof h !== 'string' || !isHex(h as string))) return false;
            list = arr as string[];
        }
        if (!list) return false;
        paletteStops.set(name, list);
        paletteSource.set(name, typeof stops === 'string' ? stops.trim() : list.join(','));
        const el = root();
        if (el) {
            for (let i = 0; i < STOPS.length; i++) {
                setVar(el, `--kun-palette-${name}-${STOPS[i]}`, list[i]!);
            }
            // Si la paleta recién publicada está en uso, refrescar alfas rgba.
            publishAlphaVars();
        }
        return true;
    },

    setRadius(radius: string): void {
        if (!radius || typeof radius !== 'string') return;
        state.radius = radius;
        const el = root();
        if (el) setVar(el, '--kun-radius', radius);
        persist(STORE_KEYS.radius, radius);
    },

    setFont(font: KunFontOptions): void {
        const el = root();
        if (font.sans) {
            state.font.sans = font.sans;
            if (el) setVar(el, '--kun-font-sans', font.sans);
        }
        if (font.mono) {
            state.font.mono = font.mono;
            if (el) setVar(el, '--kun-font-mono', font.mono);
        }
        persist(STORE_KEYS.font, JSON.stringify(state.font));
    },

    setColorMode(mode: KunColorMode): void {
        if (mode !== 'light' && mode !== 'dark' && mode !== 'system') return;
        state.colorMode = mode;
        applyColorMode(mode);
        persist(STORE_KEYS.colorMode, mode);
    },

    /** Repone lo persistido (nombre o `nombre:HEX` para customs). */
    restore(): void {
        const apply = (slot: KunSemanticSlot | 'neutral', raw: string | null) => {
            if (!raw) return;
            const decoded = decodePersisted(raw);
            if (decoded && kunTheme.registerPalette(decoded.name, decoded.payload)) {
                if (slot === 'neutral') {
                    state.neutral = decoded.name;
                    applyNeutralAlias(decoded.name);
                } else {
                    state[slot] = decoded.name;
                    applyAlias(slot, decoded.name);
                }
                return;
            }
            if (slot === 'neutral') kunTheme.setNeutral(raw);
            else setSlot(slot, raw);
        };
        apply('primary', readStore(STORE_KEYS.primary));
        for (const slot of SLOTS) {
            if (slot === 'primary') continue;
            apply(slot, readStore(`kun:theme:${slot}`));
        }
        apply('neutral', readStore(STORE_KEYS.neutral));
        const radius = readStore(STORE_KEYS.radius);
        if (radius) kunTheme.setRadius(radius);
        const font = readStore(STORE_KEYS.font);
        if (font) {
            try {
                kunTheme.setFont(JSON.parse(font) as KunFontOptions);
            } catch { /* valor corrupto */ }
        }
        const mode = readStore(STORE_KEYS.colorMode);
        if (mode === 'light' || mode === 'dark' || mode === 'system') kunTheme.setColorMode(mode);
        const defaults = readStore(STORE_KEYS.defaults);
        if (defaults) {
            try {
                const parsed = JSON.parse(defaults) as {
                    color?: KunColor;
                    variant?: KunVariant;
                    button?: { color?: KunColor; variant?: KunVariant };
                    list?: { color?: KunColor; variant?: KunVariant };
                    input?: { color?: KunColor; variant?: KunVariant };
                };
                if (parsed && typeof parsed === 'object') {
                    // Formato viejo (plano) y nuevo (por componente).
                    const button = parsed.button ?? parsed;
                    const list = parsed.list;
                    const input = parsed.input;
                    if (isButtonColor(button.color)) state.defaults.button.color = button.color;
                    if (isButtonVariant(button.variant)) state.defaults.button.variant = button.variant;
                    if (list) {
                        if (isButtonColor(list.color)) state.defaults.list.color = list.color;
                        if (isButtonVariant(list.variant)) state.defaults.list.variant = list.variant;
                    }
                    if (input) {
                        if (isButtonColor(input.color)) state.defaults.input.color = input.color;
                        if (isButtonVariant(input.variant)) state.defaults.input.variant = input.variant;
                    }
                }
            } catch { /* valor corrupto */ }
        }
    },
};

export function useKunTheme(): DeepReadonly<KunThemeState> {
    const injected = inject(KUN_THEME_KEY, null);
    if (injected) return injected;
    return kunTheme.current;
}
