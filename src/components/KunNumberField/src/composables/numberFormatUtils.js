// numberFormatUtils.js

export function clamp(value, min, max) {
    return Math.min(Math.max(value, Number(min)), Number(max));
}

export function format(value, props) {
    const formatter = new Intl.NumberFormat(props.locale, {
        minimumFractionDigits: props.precision,
        maximumFractionDigits: props.precision,
        useGrouping: props.useGrouping
    });
    return formatter.format(value);
}

export function toRawNumberString(value, precision) {
    const fixed = parseFloat(value).toFixed(precision);
    return fixed.replace('.', '').replace(',', '');
}

export function fromRawString(raw, precision) {
    if (!raw || raw.length === 0) return 0;

    const padded = raw.padStart(precision + 1, '0');
    const intPart = padded.slice(0, -precision);
    const decimalPart = padded.slice(-precision);

    const numStr = `${intPart}.${decimalPart}`;
    return parseFloat(numStr);
}

export function parse(val, separator) {
    if (typeof val === 'string') {
        val = val.replace(new RegExp(`\${separator}`, 'g'), '.');
    }
    return parseFloat(val);
}
