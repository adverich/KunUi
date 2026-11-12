// TODO-DEBUG-REMOVE: ayuda diagnóstica TEMPORAL para el issue de la muesca
// del label flotante. Eliminar este archivo y sus usos al cerrar el issue.
export function installKunNotchDebug(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  const w = window as unknown as Record<string, unknown>;
  if (w.__kunNotchInstalled) return;
  w.__kunNotchInstalled = true;
  w.__kunNotch = () => {
    const fields: unknown[] = [];
    document.querySelectorAll('[data-kun-notch]').forEach((ov) => {
      const wrap = ov.parentElement;
      const label = wrap ? wrap.querySelector(':scope > label') : null;
      const segs = ov.querySelectorAll(':scope > div > div');
      const row = ov.querySelector(':scope > div');
      const lr = label ? (label as HTMLElement).getBoundingClientRect() : null;
      const ocs = getComputedStyle(ov as HTMLElement);
      fields.push({
        component: (ov as HTMLElement).dataset.kunNotch,
        label: label ? (label.textContent || '').trim() : null,
        labelX: lr ? Math.round(lr.x * 10) / 10 : null,
        labelW: lr ? Math.round(lr.width * 10) / 10 : null,
        segL: segs[0] ? (segs[0] as HTMLElement).style.width : null,
        gap: segs[1] ? (segs[1] as HTMLElement).style.width : null,
        ovR: ocs.borderTopLeftRadius,
        rowTop: row ? getComputedStyle(row as HTMLElement).top : null,
        segLr: segs[0] ? getComputedStyle(segs[0] as HTMLElement).borderTopLeftRadius : null,
        segRr: segs[2] ? getComputedStyle(segs[2] as HTMLElement).borderTopRightRadius : null,
        overlayH: Math.round((ov as HTMLElement).getBoundingClientRect().height),
        wrapH: wrap ? Math.round(wrap.getBoundingClientRect().height) : null,
      });
    });
    return JSON.stringify(
      {
        code: 'seg-v4-explicit',
        ua: typeof navigator !== 'undefined' ? navigator.userAgent : null,
        dpr: window.devicePixelRatio,
        fieldsets: document.querySelectorAll('fieldset').length,
        fields,
      },
      null,
      1,
    );
  };
  console.log(
    '%c[kun-notch seg-v4-explicit]%c diagnóstico listo: ejecutá __kunNotch() en la consola y pegá el resultado',
    'font-weight:bold',
    '',
  );
}
