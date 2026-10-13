## Muesca del label flotante (borde segmentado medido)

El borde visible lo dibuja un overlay `div` (`absolute inset-0`) con **borde
nativo completo** (los cuatro lados): el navegador traza el rectángulo
redondeado y respeta cualquier `rounded`, pill incluida, sin costuras ni
arcos incompletos. La muesca del label flotante se recorta con `mask`:
capa 1 = `linear-gradient(#000 0 0)` a caja completa, capa 2 = rectángulo
negro sobre la caja real del label (`offsetLeft/offsetWidth/offsetHeight`
+ `ResizeObserver`) que se resta con `mask-composite: exclude`
(`-webkit-mask-composite: xor` para WebKit legacy). Hueco real en cualquier
fondo y sin `fieldset`/`legend`: render idéntico en todos los navegadores.
El recorte baja hasta el pie del label para limpiar también el arco cuando
el label flota dentro de la zona de curva (pill / radios grandes). Sin
flotar, el recorte se cierra (tamaño 0) y el borde queda continuo; la
apertura se anima transicionando `mask-position`/`mask-size`.

> Historial: antes el borde superior se dibujaba a mano con segmentos que
> "abrazaban" el label y cuyos extremos redondeados intentaban completar los
> arcos. Se descartó porque un `div` con solo `border-t` no pinta la curva
> de la esquina (la mitad curva pertenece al borde adyacente de ancho 0):
> la línea recta se pasaba del inicio del arco y las esquinas quedaban
> cortadas o escaladas con radios que no coincidían.

El glow de foco es `drop-shadow` sobre el overlay (sigue la forma pintada:
respeta muesca y curvas, a diferencia del `box-shadow` rectangular). El
label flotante usa `top-[-2px]` + `-translate-y-1/2` (centrado óptico sobre
el borde).

## Desplazamiento del label flotante según el `rounded`

El label flotante se separa de la curva con 2px por escalón de la escala
(`rounded-none` = 0 … `rounded-full` = 16), partiendo de su posición actual
en `rounded-none`. La detección es por nombre de clase; clases no listadas
(p. ej. `rounded-[10px]` o radios por esquina) usan fallback al radio
superior izquierdo medido → paso estándar más cercano (un radio que
desborda la caja se comporta como pill → último escalón).

- El desplazamiento viaja como `margin-left` (anclaje `left-*`); como el
  label tiene `transition-all`, el cambio se anima junto con la flotación.
- Si el label flota anclado a la derecha (`floatingLabelLeft: 'right-*'`),
  el desplazamiento espeja con `margin-right`: 2px a la izquierda por
  escalón.
- Solo aplica en flotación; en reposo el label no se mueve.
- Como el margen mueve la caja, la muesca se re-mide tras aplicarlo
  (`watch(labelShift)` → `updateNotch()` en `nextTick`; el valor se
  estabiliza en dos pasadas y el `ResizeObserver` no entra en loop porque
  solo observa tamaño, no posición).
- La medición en `nextTick` puede caer a mitad de las transiciones del label
  (`transition-all`: margen, tamaño al flotar) y dejar la muesca corrida
  hasta el próximo reflow: por eso se re-mide al terminar cada transición
  (`transitionend` sobre el label) y cuando el field cambia de tamaño
  (`ResizeObserver` sobre label + overlay).

## Sistema de iconos y slots

- Externos (fuera del borde): `prependIcon` / `appendIcon`.
- Internos: `prependInnerIcon` / `appendInnerIcon`.
- Nombre de slot = nombre del prop sin `Icon` (`prependIcon` → `#prepend`),
  más `#prepend-inner`, `#prepend-input-content`, `#default`,
  `#append-inner`, `#append`.
