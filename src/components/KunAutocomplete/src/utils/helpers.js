// src/utils/helpers.js
export function isObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function isArray(value) {
    return Array.isArray(value);
}

export function isString(value) {
    return typeof value === 'string';
}