// kunConfig.js - Global configuration for KunUi
import { reactive, readonly, inject } from 'vue';

// Valores por defecto de la librería
const defaultConfig = {
    locale: 'es-AR',
    currency: {
        code: 'ARS',
        symbol: '$',
        precision: 2,
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
function deepMerge(target, source) {
    const result = { ...target };
    for (const key of Object.keys(source)) {
        if (
            source[key] !== null &&
            typeof source[key] === 'object' &&
            !Array.isArray(source[key]) &&
            target[key] !== null &&
            typeof target[key] === 'object' &&
            !Array.isArray(target[key])
        ) {
            result[key] = deepMerge(target[key], source[key]);
        } else {
            result[key] = source[key];
        }
    }
    return result;
}

// Estado reactivo interno
const configState = reactive({ ...defaultConfig });

// Symbol para injection key
export const KUN_CONFIG_KEY = Symbol('kunConfig');

// API pública del config
export const kunConfig = {
    // Acceso readonly para evitar mutaciones directas
    get current() {
        return readonly(configState);
    },

    // Acceso directo a valores (reactivo)
    get locale() {
        return configState.locale;
    },

    get currency() {
        return configState.currency;
    },

    get date() {
        return configState.date;
    },

    // Configurar (merge profundo)
    configure(options = {}) {
        const merged = deepMerge(configState, options);
        Object.assign(configState, merged);
    },

    // Reset a valores por defecto
    reset() {
        Object.assign(configState, deepMerge({}, defaultConfig));
    },

    // Setters individuales para configuración dinámica
    setLocale(locale) {
        configState.locale = locale;
    },

    setCurrency(currency) {
        if (typeof currency === 'string') {
            configState.currency.code = currency;
        } else if (typeof currency === 'object') {
            Object.assign(configState.currency, currency);
        }
    },
};

// Composable para usar en componentes
export function useKunConfig() {
    // Intentar obtener del inject (si está en contexto de Vue app)
    const injected = inject(KUN_CONFIG_KEY, null);
    if (injected) {
        return injected;
    }
    // Fallback al singleton global
    return kunConfig.current;
}

// Helper para resolver valores con fallback (prop > global > default)
export function resolveConfigValue(propValue, configPath, defaultValue) {
    // Si el prop tiene valor, usarlo
    if (propValue !== null && propValue !== undefined) {
        return propValue;
    }

    // Navegar el path en config
    const pathParts = configPath.split('.');
    let value = configState;
    for (const part of pathParts) {
        if (value && typeof value === 'object' && part in value) {
            value = value[part];
        } else {
            return defaultValue;
        }
    }

    return value ?? defaultValue;
}
