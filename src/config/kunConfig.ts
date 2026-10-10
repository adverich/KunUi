// kunConfig.ts - Global configuration for KunUi
import { reactive, readonly, inject, type InjectionKey, type DeepReadonly } from 'vue';

export interface KunCurrencyConfig {
    value: string;
    name: string;
    symbol: string;
}

export interface KunDateConfig {
    dateFormat: Intl.DateTimeFormatOptions;
    dateTimeFormat: Intl.DateTimeFormatOptions;
}

export interface KunConfig {
    locale: string;
    precision: number;
    currency: KunCurrencyConfig;
    date: KunDateConfig;
}

export type KunConfigOptions = Partial<{
    locale: string;
    precision: number;
    currency: Partial<KunCurrencyConfig> | string;
    date: Partial<KunDateConfig>;
}> & Record<string, unknown>;

// Valores por defecto de la librería
const defaultConfig: KunConfig = {
    locale: 'es-AR',
    precision: 2,
    currency: {
        value: 'ARS',
        name: 'Pesos Argentinos',
        symbol: '$',
    },
    date: {
        dateFormat: {
            weekday: 'short',
            day: '2-digit',
            month: 'short',
            year: '2-digit',
        },
        dateTimeFormat: {
            weekday: 'short',
            day: '2-digit',
            month: 'short',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hourCycle: 'h23',
        },
    },
};

// Deep merge helper
function deepMerge<T extends Record<string, unknown>>(target: T, source: Record<string, unknown>): T {
    const result = { ...target } as Record<string, unknown>;
    for (const key of Object.keys(source)) {
        const sourceVal = source[key];
        const targetVal = (target as Record<string, unknown>)[key];
        if (
            sourceVal !== null &&
            typeof sourceVal === 'object' &&
            !Array.isArray(sourceVal) &&
            targetVal !== null &&
            typeof targetVal === 'object' &&
            !Array.isArray(targetVal)
        ) {
            result[key] = deepMerge(
                targetVal as Record<string, unknown>,
                sourceVal as Record<string, unknown>,
            );
        } else {
            result[key] = sourceVal;
        }
    }
    return result as T;
}

// Estado reactivo interno
const configState = reactive<KunConfig>({ ...defaultConfig });

// Symbol para injection key
export const KUN_CONFIG_KEY: InjectionKey<DeepReadonly<KunConfig>> = Symbol('kunConfig');

// API pública del config
export const kunConfig = {
    // Acceso readonly para evitar mutaciones directas
    get current(): DeepReadonly<KunConfig> {
        return readonly(configState);
    },

    // Acceso directo a valores (reactivo)
    get locale(): string {
        return configState.locale;
    },

    get precision(): number {
        return configState.precision;
    },

    get currency(): KunCurrencyConfig {
        return configState.currency;
    },

    get date(): KunDateConfig {
        return configState.date;
    },

    // Configurar (merge profundo)
    configure(options: KunConfigOptions = {}): void {
        const merged = deepMerge(configState as unknown as Record<string, unknown>, options as Record<string, unknown>);
        Object.assign(configState, merged);
    },

    // Reset a valores por defecto
    reset(): void {
        Object.assign(configState, deepMerge({}, defaultConfig as unknown as Record<string, unknown>));
    },

    // Setters individuales para configuración dinámica
    setLocale(locale: string): void {
        configState.locale = locale;
    },

    setPrecision(precision: number): void {
        configState.precision = precision;
    },

    setCurrency(currency: string | Partial<KunCurrencyConfig>): void {
        if (typeof currency === 'string') {
            configState.currency.value = currency;
        } else if (typeof currency === 'object') {
            Object.assign(configState.currency, currency);
        }
    },
};

// Composable para usar en componentes
export function useKunConfig(): DeepReadonly<KunConfig> {
    // Intentar obtener del inject (si está en contexto de Vue app)
    const injected = inject(KUN_CONFIG_KEY, null);
    if (injected) {
        return injected;
    }
    // Fallback al singleton global
    return kunConfig.current;
}

// Helper para resolver valores con fallback (prop > global > default)
export function resolveConfigValue<T>(propValue: T | null | undefined, configPath: string, defaultValue: T): T {
    // Si el prop tiene valor, usarlo
    if (propValue !== null && propValue !== undefined) {
        return propValue;
    }

    // Navegar el path en config
    const pathParts = configPath.split('.');
    let value: unknown = configState;
    for (const part of pathParts) {
        if (value && typeof value === 'object' && part in (value as Record<string, unknown>)) {
            value = (value as Record<string, unknown>)[part];
        } else {
            return defaultValue;
        }
    }

    return (value as T | null | undefined) ?? defaultValue;
}
