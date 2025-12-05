import { kunConfig, resolveConfigValue } from '../config/kunConfig.js';

export function getValue(header, item) {
    if (!header || !header.value) return undefined;

    if (header.columnType === 'relation') {
        const value = getNestedValue(item, header.relationPath);
        return safeValue(value);
    }

    if (header.columnType === 'function') {
        const value = header.columnFunction?.(item, header);
        return safeValue(value);
    }

    const value = item?.[header.value];
    return safeValue(value);
}

export function formatValue(header, value, options = {}) {
    if (header.columnType === 'toComplete') return '';
    if (value === null || value === undefined) return 'Sin datos';

    if (header.columnType === 'dateTime') {
        const formatter = formatters[header.columnType] || formatters.default;
        return formatter(value, options);
    }

    if (header.columnType === 'date') {
        const formatter = formatters[header.columnType] || formatters.default;
        return formatter(value, options);
    }

    const formatter = formatters[header.columnFormat] || formatters.default;
    return formatter(value, options);
}

export const formatters = {
    default: value => value,
    // TEXTS
    text: value => String(value),
    activeOrInactive: value => value ? 'Activa' : 'Inactiva',

    composed: value => value, // ya está procesado por getComposedValue

    // NUMBERS
    number: (value, options = {}) => {
        const locale = resolveConfigValue(options.locale, 'locale', 'es-AR');
        return Number(value).toLocaleString(locale);
    },

    money: (value, options = {}) => {
        const locale = resolveConfigValue(options.locale, 'locale', 'es-AR');
        const currencyCode = resolveConfigValue(options.currency, 'currency.code', 'ARS');
        const precision = resolveConfigValue(options.precision, 'currency.precision', 2);

        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currencyCode,
            minimumFractionDigits: precision,
            maximumFractionDigits: precision,
        }).format(value ?? 0);
    },

    noDecimal: value => parseFloat(value ?? 0).toFixed(0),
    withDecimals: (value, decimals = 2) => parseFloat(value ?? 0).toFixed(decimals),
    noCeros: value => parseFloat(value ?? 0),
    percentage: value => `${parseFloat(value ?? 0)}%`,

    date: (value, options = {}) => {
        if (!value || value === "0000-00-00" || !isValidDate(value)) return "Nunca";
        const date = new Date(value);
        const locale = resolveConfigValue(options.locale, 'locale', 'es-AR');
        const config = kunConfig.current;

        return new Intl.DateTimeFormat(locale, {
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "2-digit",
            ...config.date?.dateFormat,
            ...options.format,
        }).format(date);
    },

    dateTime: (value, options = {}) => {
        if (!value || value === "0000-00-00" || !isValidDate(value)) return "Nunca";
        const date = new Date(value);
        const locale = resolveConfigValue(options.locale, 'locale', 'es-AR');
        const config = kunConfig.current;

        return new Intl.DateTimeFormat(locale, {
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hourCycle: "h23",
            ...config.date?.dateTimeFormat,
            ...options.format,
        }).format(date);
    },

    secondsToTime: value => convertirSegundosATiempo(value ?? 0),
};

// Funciones helper adicionales para formateo con config global
export function formatMoney(value, options = {}) {
    return formatters.money(value, options);
}

export function formatDate(value, options = {}) {
    return formatters.date(value, options);
}

export function formatDateTime(value, options = {}) {
    return formatters.dateTime(value, options);
}

export function formatNumber(value, options = {}) {
    return formatters.number(value, options);
}

export function getNestedValue(obj, path) {
    if (!obj || !path) return obj;
    return path.split('.').reduce((acc, part) => acc?.[part], obj);
}

function convertirSegundosATiempo(segundos) {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segundosRestantes = segundos % 60;
    return `${horas} horas, ${minutos} minutos y ${segundosRestantes} segundos`;
};

function safeValue(value) {
    if (value === null || value === undefined) return undefined;
    if (value === 'null' || value === 'undefined') return undefined;
    return value;
}

function isValidDate(value) {
    const date = new Date(value);
    return !isNaN(date.getTime());
}