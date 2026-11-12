// Detección de autofill del navegador para los fields con label flotante.
//
// Chrome/Edge/Safari rellenan `input`/`textarea` (datos de contacto, dirección,
// tarjetas, passwords) aplicando `:-webkit-autofill` sin disparar eventos
// `input` que Vue pueda escuchar: el estado interno (`inputValue`,
// `internalValue`) queda en `''` y el label no sube, quedando solapado con el
// texto autocompletado. Firefox sí dispara `input`/`change` en ese caso.
//
// El mecanismo (estándar en la industria) es una animación CSS mínima aplicada
// solo bajo `:-webkit-autofill` (ver `src/styles/style.css`): al aplicarse, el
// navegador emite `animationstart` y cada field sincroniza el valor nativo al
// estado. Como respaldo, los fields también sincronizan en `change`, `blur`,
// `focus` y al montar.

/** Nombre de la animación declarada en `style.css` para `:-webkit-autofill`. */
export const KUN_AUTOFILL_ANIMATION = 'kun-autofill-start';

/** Indica si un evento `animationstart` corresponde al autofill del navegador. */
export function isAutofillAnimation(e: Event): boolean {
    const name = (e as AnimationEvent)?.animationName ?? '';
    return typeof name === 'string' && name.indexOf('kun-autofill') === 0;
}

/** Lee el valor nativo actual de un input/textarea (null si no hay elemento). */
export function readNativeValue(
    el: { value?: unknown } | null | undefined,
): string | null {
    if (!el || typeof el.value !== 'string') return null;
    return el.value;
}
