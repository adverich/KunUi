import { kunConfig } from '../config/kunConfig.js';
import { kunDocumentConfig } from '../config/kunDocumentConfig.js';

// --- Document formatting (masks and separators per country/format) ---
const docFormats = {
  doc_ar: {
    cuit:       { mask: [2, 8, 1] },
    cuil:       { mask: [2, 8, 1] },
    dni:        { thousandsSep: '.' },
  },
  doc_bo: {
    nit:        { mask: null },
    ci:         { mask: null },
  },
  doc_br: {
    cpf:        { mask: [3, 3, 3, 2],    separators: ['.', '.', '-'] },
    cnpj:       { mask: [2, 3, 3, 4, 2], separators: ['.', '.', '/', '-'] },
  },
  doc_cl: {
    rut:        { rutFormat: true, thousandsSep: '.' },
    run:        { rutFormat: true, thousandsSep: '.' },
  },
  doc_co: {
    nit:        { mask: [9, 1] },
  },
  doc_cr: {
    cedula:     { mask: [1, 4, 5] },
    dimex:      { mask: [1, 4, 5] },
    nite:       { mask: [1, 3, 6] },
  },
  doc_do: {
    cedula:     { mask: [3, 7, 1] },
  },
  doc_es: {
    dni:        { mask: [8, 1] },
    nie:        { mask: [1, 7, 1] },
  },
  doc_gb: {
    vat:        { mask: [2, 3, 4, 2], separators: [' ', ' ', ' '] },
    ni:         { mask: [2, 2, 2, 2, 1], separators: [' ', ' ', ' ', ' '] },
  },
  doc_de: {
    stnr:       { mask: [2, 3, 5], separators: ['/', '/'] },
  },
  doc_fr: {
    siret:      { mask: [3, 3, 3, 5],  separators: [' ', ' ', ' '] },
    siren:      { mask: [3, 3, 3],     separators: [' ', ' '] },
    tva:        { mask: [4, 9],        separators: [' '] },
  },
  doc_gt: {
    nit:        { mask: [8, 1] },
  },
  doc_hn: {
    dni:        { mask: [4, 4, 5] },
  },
  doc_ni: {
    cedula:     { mask: [9, 1] },
  },
  doc_pa: {
    cedula:     { mask: [1, 3, 4] },
    ruc:        { mask: [7, 1, 2] },
  },
  doc_py: {
    ruc:        { mask: [7, 1] },
  },
  doc_ve: {
    cedula:     { mask: [1, 8] },
    rif:        { mask: [1, 8, 1] },
  },
  doc_pt: {
    passaporte: { mask: [1, 8] },
  },
};

function cleanDoc(value) {
  return String(value || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
}

function formatThousandsDoc(digits, sep) {
  let result = '';
  for (let i = 0; i < digits.length; i++) {
    if (i > 0 && (digits.length - i) % 3 === 0) result += sep;
    result += digits[i];
  }
  return result;
}

function applyDocMask(clean, mask, separators) {
  let result = '';
  let idx = 0;
  for (let i = 0; i < mask.length && idx < clean.length; i++) {
    result += clean.substring(idx, idx + mask[i]);
    idx += mask[i];
    if (i < mask.length - 1 && idx < clean.length) {
      result += separators ? (separators[i] ?? '-') : '-';
    }
  }
  return result;
}

function formatDocValue(value, docCode, docFormat) {
  const clean = cleanDoc(String(value ?? ''));
  if (!clean) return value ?? '';
  const config = docFormats[docCode]?.[docFormat];
  if (!config) return clean;
  if (config.rutFormat) {
    if (clean.length < 2) return clean;
    return formatThousandsDoc(clean.slice(0, -1), config.thousandsSep || '.') + '-' + clean.slice(-1);
  }
  if (config.thousandsSep) return formatThousandsDoc(clean, config.thousandsSep);
  if (config.mask) return applyDocMask(clean, config.mask, config.separators ?? null);
  return clean;
}
// --- End document formatting ---

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

function formatDocValueByTypeId(value, documentTypeId, documentTypes, countries) {
    const clean = cleanDoc(String(value ?? ''));
    if (!clean) return clean;
    if (!documentTypeId || !documentTypes?.length) return clean;

    const docType = documentTypes.find(dt => dt.id == documentTypeId);
    if (!docType) return clean;

    const countryId = docType.country_id ?? docType.country?.id;
    let docCode = null;
    if (countryId && countries?.length) {
        const country = countries.find(c => c.id == countryId);
        const iso2 = country?.iso2 || country?.iso_code || country?.code;
        if (iso2) docCode = `doc_${iso2.toLowerCase()}`;
    }
    if (!docCode) {
        const iso2 = docType.country_iso2 || docType.country?.iso2;
        if (iso2) docCode = `doc_${iso2.toLowerCase()}`;
    }

    const docFormat = docType.short_name?.toLowerCase() || docType.name?.toLowerCase();

    if (!docCode || !docFormat) return clean;
    return formatDocValue(value, docCode, docFormat);
}

export function formatValue(header, value, item = null) {
    if (header.columnType === 'toComplete') return '';
    if (value === null || value === undefined) return 'Sin datos';

    if (header.columnType === 'dateTime') {
        const formatter = formatters[header.columnType] || formatters.default;
        return formatter(value);
    }

    if (header.columnType === 'date') {
        const formatter = formatters[header.columnType] || formatters.default;
        return formatter(value);
    }

    if (header.columnType === 'document') {
        const docTypeId = item?.document_type_id
            ?? item?.entity?.document_type_id
            ?? null;
        return formatDocValueByTypeId(value, docTypeId, kunDocumentConfig.documentTypes, kunDocumentConfig.countries);
    }

    // Backward compat: columnas configuradas con doc_XX directo
    if (header.columnType?.startsWith('doc_')) {
        return formatDocValue(value, header.columnType, header.columnFormat);
    }

    const formatter = formatters[header.columnFormat] || formatters.default;
    return formatter(value);
}

export const formatters = {
    default: value => value,
    // TEXTS
    text: value => String(value),
    activeOrInactive: value => value ? 'Activa' : 'Inactiva',

    composed: value => value, // ya está procesado por getComposedValue

    // NUMBERS - Usa config global directamente
    number: value => {
        const locale = kunConfig.locale;
        return Number(value).toLocaleString(locale);
    },

    money: value => {
        const config = kunConfig.current;
        const locale = config.locale;
        const precision = config.precision;
        const currency = config.currency;

        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency.value,
            minimumFractionDigits: precision,
            maximumFractionDigits: precision,
        }).format(value ?? 0);
    },

    noDecimal: value => parseFloat(value ?? 0).toFixed(0),
    withDecimals: (value, decimals = 2) => parseFloat(value ?? 0).toFixed(decimals),
    noCeros: value => parseFloat(value ?? 0),
    percentage: value => `${parseFloat(value ?? 0)}%`,

    date: value => {
        if (!value || value === "0000-00-00" || !isValidDate(value)) return "Nunca";
        // Crear fecha con mediodía para evitar problemas de timezone
        // Al usar hora 12, la conversión a zona horaria no cambia el día
        const [year, month, day] = value.split('-').map(Number);
        const date = new Date(year, month - 1, day, 12, 0, 0);
        const config = kunConfig.current;
        const locale = config.locale;

        return new Intl.DateTimeFormat(locale, {
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "2-digit",
            ...config.date?.dateFormat,
        }).format(date);
    },

    dateTime: value => {
        if (!value || value === "0000-00-00" || !isValidDate(value)) return "Nunca";
        const date = new Date(value);
        const config = kunConfig.current;
        const locale = config.locale;

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
        }).format(date);
    },

    secondsToTime: value => convertirSegundosATiempo(value ?? 0),
};

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