export function isObject(value: unknown): value is Record<string, unknown> {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function isArray(value: unknown): value is unknown[] {
    return Array.isArray(value);
}

export function isString(value: unknown): value is string {
    return typeof value === 'string';
}

export function isNotEmpty(value: unknown): boolean {
    if (isObject(value)) {
        return Object.keys(value).length > 0;
    }

    if (isArray(value) || isString(value)) {
        return value.length > 0;
    }
    return false;
}

export function debounce<T extends (...args: never[]) => void>(fn: T, delay = 100): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout> | undefined;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
    };
}

export function fullCopy<T>(item: T): T {
    return JSON.parse(JSON.stringify(item)) as T;
}
