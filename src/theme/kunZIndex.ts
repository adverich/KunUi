/**
 * kunZIndex.ts - Escala z-index unica de KunUI (patron Nuxt/Reka).
 *
 * Fuente de verdad de las capas de superposicion. Los valores viven en
 * `src/styles/theme.css` como `--kun-z-*`; aqui solo se exponen helpers
 * tipados para consumirlos (inline style o `var()`).
 *
 * Diseno: todo overlay flotante se TELETRANSPORTA a `<body>` y comparte la
 * capa `overlay`; el anidamiento (menu dentro de un modal, modal desde un
 * menu) se resuelve por orden de montaje en el DOM, no por un numero por
 * componente. Alert y toast NO son overlays interactivos: usan la capa
 * `notification`, por encima de cualquier menu/modal/drawer/tooltip.
 * No usar valores sueltos de z-index en componentes.
 */
export const KUN_Z_LAYERS = [
    'docked',
    'overlay',
    'notification',
    'loader',
] as const;

export type KunZLayer = (typeof KUN_Z_LAYERS)[number];

/** Valor CSS de la capa: `var(--kun-z-<layer>)`. */
export function zIndexVar(layer: KunZLayer): string {
    return `var(--kun-z-${layer})`;
}

/** Estilo inline para asignar el z-index de una capa. */
export function zIndexStyle(layer: KunZLayer): { zIndex: string } {
    return { zIndex: zIndexVar(layer) };
}
