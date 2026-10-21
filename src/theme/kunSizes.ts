/**
 * Escala única de tamaños de KunUI.
 *
 * Todos los componentes que exponen `size` comparten estos siete pasos:
 * `xxs | xs | sm | md | lg | xl | xxl`.
 *
 * Regla de consistencia: un contenedor cuadrado (avatar, botón icon-only)
 * mide exactamente lo mismo que la altura de un control del mismo `size`, y
 * su ícono ocupa el 50% del lado.
 */

export const KUN_SIZE_ORDER = ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const;

export type KunSize = (typeof KUN_SIZE_ORDER)[number];

/** Lado de un elemento cuadrado (avatar, botón icon-only) en px. */
export const KUN_SIZE_PX: Record<KunSize, number> = {
  xxs: 24,
  xs: 28,
  sm: 32,
  md: 36,
  lg: 40,
  xl: 48,
  xxl: 56,
};

/** Tamaño de ícono en px (siempre 50% del lado del contenedor). */
export const KUN_ICON_PX: Record<KunSize, number> = {
  xxs: 12,
  xs: 14,
  sm: 16,
  md: 18,
  lg: 20,
  xl: 24,
  xxl: 28,
};

/** Contenedor cuadrado: avatar, botón icon-only, slots cuadrados. */
export const KUN_SQUARE_SIZE: Record<KunSize, string> = {
  xxs: 'size-6',
  xs: 'size-7',
  sm: 'size-8',
  md: 'size-9',
  lg: 'size-10',
  xl: 'size-12',
  xxl: 'size-14',
};

/** Altura de controles (botones, inputs, selects). Coincide con el cuadrado. */
export const KUN_CONTROL_HEIGHT: Record<KunSize, string> = {
  xxs: 'h-6',
  xs: 'h-7',
  sm: 'h-8',
  md: 'h-9',
  lg: 'h-10',
  xl: 'h-12',
  xxl: 'h-14',
};

/** Clase del ícono (equivalente a `KUN_ICON_PX`). */
export const KUN_ICON_SIZE: Record<KunSize, string> = {
  xxs: 'size-3',
  xs: 'size-3.5',
  sm: 'size-4',
  md: 'size-4.5',
  lg: 'size-5',
  xl: 'size-6',
  xxl: 'size-7',
};

/** Tipografía compartida por controles y avatares. */
export const KUN_TEXT_SIZE: Record<KunSize, string> = {
  xxs: 'text-xs',
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-lg',
  xxl: 'text-xl',
};

/** Padding horizontal de botones de texto. */
export const KUN_CONTROL_PADDING: Record<KunSize, string> = {
  xxs: 'px-2',
  xs: 'px-2',
  sm: 'px-2.5',
  md: 'px-3',
  lg: 'px-4',
  xl: 'px-5',
  xxl: 'px-6',
};

/** Separación entre íconos y texto dentro de un control. */
export const KUN_CONTROL_GAP: Record<KunSize, string> = {
  xxs: 'gap-1',
  xs: 'gap-1',
  sm: 'gap-1.5',
  md: 'gap-2',
  lg: 'gap-2',
  xl: 'gap-2.5',
  xxl: 'gap-3',
};

/** Grosor del loader circular según el tamaño del control. */
export const KUN_LOADER_WIDTH: Record<KunSize, number> = {
  xxs: 2,
  xs: 3,
  sm: 3,
  md: 4,
  lg: 4,
  xl: 5,
  xxl: 5,
};

export function isKunSize(value: unknown): value is KunSize {
  return typeof value === 'string' && (KUN_SIZE_ORDER as readonly string[]).includes(value);
}

export function resolveKunSize(value: unknown, fallback: KunSize = 'md'): KunSize {
  return isKunSize(value) ? value : fallback;
}

/** Desplaza un tamaño dentro de la escala, con piso en `xxs` y techo en `xxl`. */
export function shiftKunSize(size: KunSize, offset: number): KunSize {
  const index = KUN_SIZE_ORDER.indexOf(size);
  const next = Math.min(KUN_SIZE_ORDER.length - 1, Math.max(0, index + offset));
  return KUN_SIZE_ORDER[next];
}
