import { nextTick } from 'vue';

/**
 * Corrige el caret al hacer click en el padding vertical de un `<input>`.
 *
 * Los inputs de KunUI tienen padding vertical amplio (`py-3` en density
 * default): la línea de texto ocupa solo una banda centrada. Chromium (con
 * editing behavior Unix/Mac: Linux y macOS) manda el caret al **inicio** si el
 * click cae por encima de esa banda y al **final** si cae por debajo, ignorando
 * la X. Este handler (para `@mousedown` del `<input>`) deja intacto el
 * comportamiento nativo dentro de la banda y, fuera de ella, enfoca el input y
 * ubica el caret según la X del click (medida con canvas sobre la fuente
 * computada).
 *
 * El caret se fija en `nextTick` para correr después del reformateo que algunos
 * campos hacen al recibir foco (p. ej. `KunNumberField`: `3.500,00` → `3500`).
 */
export function handlePaddingMouseDown(e: MouseEvent): void {
    const input = e.currentTarget;
    if (!(input instanceof HTMLInputElement)) return;
    // Doble/triple click (selección de palabra/línea), modificadores (shift
    // extiende la selección) y botones no primarios: comportamiento nativo.
    if (e.button !== 0 || e.detail > 1 || e.shiftKey || e.ctrlKey || e.metaKey || e.altKey) return;
    if (input.disabled) return;

    const cs = getComputedStyle(input);
    if (cs.direction === 'rtl') return;

    const rect = input.getBoundingClientRect();
    const borderTop = px(cs.borderTopWidth);
    const borderBottom = px(cs.borderBottomWidth);
    const contentTop = rect.top + borderTop + px(cs.paddingTop);
    const contentH = rect.height - borderTop - borderBottom - px(cs.paddingTop) - px(cs.paddingBottom);
    const lineH = cs.lineHeight === 'normal' ? px(cs.fontSize) * 1.2 : px(cs.lineHeight);

    // Banda de la línea de texto (el navegador la centra en el content box).
    const bandTop = contentTop + Math.max(0, (contentH - lineH) / 2);
    const bandBottom = bandTop + Math.min(lineH, Math.max(contentH, 0));
    if (e.clientY >= bandTop && e.clientY <= bandBottom) return;

    e.preventDefault();
    if (document.activeElement !== input) input.focus({ preventScroll: true });

    const clientX = e.clientX;
    nextTick(() => {
        const index = caretIndexFromX(input, clientX);
        try {
            input.setSelectionRange(index, index);
        } catch { /* tipos de input sin selección */ }
    });
}

function px(v: string): number {
    return parseFloat(v) || 0;
}

let measureCtx: CanvasRenderingContext2D | null = null;

function caretIndexFromX(input: HTMLInputElement, clientX: number): number {
    const value = input.value ?? '';
    if (!value) return 0;

    measureCtx ??= document.createElement('canvas').getContext('2d');
    const ctx = measureCtx;
    if (!ctx) return value.length;

    const cs = getComputedStyle(input);
    ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    const spacingCtx = ctx as CanvasRenderingContext2D & { letterSpacing?: string };
    if ('letterSpacing' in spacingCtx) {
        spacingCtx.letterSpacing = cs.letterSpacing === 'normal' ? '0px' : cs.letterSpacing;
    }

    const text = input.type === 'password' ? '•'.repeat(value.length) : value;
    const rect = input.getBoundingClientRect();
    const contentLeft = rect.left + px(cs.borderLeftWidth) + px(cs.paddingLeft);
    const contentW = rect.width - px(cs.borderLeftWidth) - px(cs.borderRightWidth)
        - px(cs.paddingLeft) - px(cs.paddingRight);
    const total = ctx.measureText(text).width;

    // Alineación: solo desplaza si el texto entra (si desborda, manda scrollLeft).
    let alignOffset = 0;
    if (total < contentW) {
        if (cs.textAlign === 'center') alignOffset = (contentW - total) / 2;
        else if (cs.textAlign === 'right' || cs.textAlign === 'end') alignOffset = contentW - total;
    }

    const x = clientX - contentLeft + input.scrollLeft - alignOffset;
    if (x <= 0) return 0;
    if (x >= total) return value.length;

    let prev = 0;
    for (let i = 1; i <= text.length; i++) {
        const w = ctx.measureText(text.slice(0, i)).width;
        if (w >= x) return x - prev < w - x ? i - 1 : i;
        prev = w;
    }
    return value.length;
}
