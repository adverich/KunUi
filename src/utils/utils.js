export function isObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function isArray(value) {
    return Array.isArray(value);
}

export function isString(value) {
    return typeof value === 'string';
}

export function isNotEmpty(value) {
    if (isObject(value)) {
        return Object.keys(value).length > 0;
    }

    if (isArray(value) || isString(value)) {
        return value.length > 0;
    }
    return false;
}

export function debounce(fn, delay = 100) {
    let timeout
    return (...args) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => fn(...args), delay)
    }
}

export function fullCopy(item) {
    return JSON.parse(JSON.stringify(item));
}