export function normalizeNumber(val, separator = ',') {
    const cleanedVal = val.replace(/[^\d.,]/g, '');
    return separator === ',' ? cleanedVal.replace(/\./g, ',') : cleanedVal.replace(/,/g, '.');
}

export function parseNumber(val, separator = ',') {
    const normalized = val.replace(new RegExp(`\\${separator}`, 'g'), '.');
    const parsed = parseFloat(normalized);
    return isNaN(parsed) ? null : parsed;
}

export function formatNumber(num, separator = ',', precision = 2) {
    if (num === null || isNaN(num)) return '';
    const fixed = Number(num).toFixed(precision);
    return separator === ',' ? fixed.replace('.', ',') : fixed;
}

// export function normalizeNumber(val, separator = ',') {
//     // Permitir solo números, separadores y borrar caracteres
//     const cleanedVal = val.replace(/[^\d.,]/g, '');

//     // Reemplazar el separador incorrecto
//     if (separator === ',') {
//         return cleanedVal.replace(/\./g, ',');
//     } else {
//         return cleanedVal.replace(/,/g, '.');
//     }
// }

// export function parseNumber(val, separator = ',') {
//     // Reemplazar el separador decimal con el definido en props
//     const normalized = val.replace(new RegExp(`\\${separator}`, 'g'), '.');

//     // Convertir a número flotante
//     const parsed = parseFloat(normalized);

//     // Si es un número válido, devolverlo con el separador correcto
//     return isNaN(parsed) ? null : parsed.toString().replace('.', separator);
// }
