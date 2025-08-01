// numberFormatUtils.js

export function clamp(value, min, max) {
    return Math.min(Math.max(value, Number(min)), Number(max));
}

export function format(value, { precision, locale = 'en-US', useGrouping = true }) {
    // Asegurarnos que value es un número
    const numValue = typeof value === 'number' ? value : parseFloat(value);

    // Manejo especial para precisión 0 (enteros)
    if (precision === 0) {
        return new Intl.NumberFormat(locale, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
            useGrouping: useGrouping
        }).format(Math.round(numValue));
    }

    // Para precisión > 0, forzar exactamente esa cantidad de decimales
    const fixedValue = numValue.toFixed(precision);
    return new Intl.NumberFormat(locale, {
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
        useGrouping: useGrouping
    }).format(parseFloat(fixedValue));
}

export function toRawNumberString(value, precision) {
    const numValue = typeof value === 'number' ? value : parseFloat(value);

    if (precision === 0) {
        return Math.round(numValue).toString();
    }

    // Forzar exactamente la precisión especificada
    const fixed = numValue.toFixed(precision);
    return fixed.replace('.', '').replace(',', '');
}

export function fromRawString(raw, precision) {
    if (!raw || raw.length === 0) return 0;

    if (precision === 0) {
        return parseInt(raw, 10) || 0;
    }

    const padded = raw.padStart(precision + 1, '0');
    const intPart = padded.slice(0, -precision);
    const decimalPart = padded.slice(-precision);

    const numStr = `${intPart}.${decimalPart}`;
    return parseFloat(numStr);
}

export function parse(val, separator) {
    if (typeof val === 'string') {
        val = val.replace(new RegExp(`\\${separator}`, 'g'), '.');
    }
    return parseFloat(val);
}
