## Posicionamiento en apertura (invariante)

El contenido vive en un `Teleport` a `body` y solo se monta al abrir
(`v-if="eager || menuVisible"`). El `watch(menuVisible)` corre en
pre-flush, **antes** del mount: posicionar ahí es un no-op silencioso que
deja el menú como bloque estático al fondo del body. Por eso la rama de
apertura se difiere con `nextTick` (post-mount) y `repositionMenu`
reintenta por `rAF` en vez de retornar en silencio si el `contentEl` aún
no existe.

El estilo inicial es oculto (`fixed`, `opacity: 0`, sin pointer events);
el estilo posicionado setea `opacity: 1`. Al cerrar se resetea al oculto
para que una reapertura nunca pinte un frame con coordenadas viejas.

## CSS Anchor Positioning (motor nativo)

Cuando el navegador lo soporta (`CSS.supports('position-anchor: …')`) y
la prop `anchor` es `true` (default), el menú se ancla de forma nativa:

- Al abrir se registra `anchor-name: --kun-menu-<id>` en el activador
  (`parentRef` o slot `activator`); se remueve en `onUnmounted`.
- El estilo usa `position-anchor` + `anchor()`/`anchor-size()` con
  `position-try-fallbacks: flip-block, flip-inline, flip-block flip-inline`.
  Las opciones van **separadas por coma**: `flip-block flip-inline`
  (sin coma) es un único tactic que voltea ambos ejes a la vez, y con el
  ancla pegado a una esquina el resultado se descarta y el borde nunca se
  corrige (menú recortado). Con opciones separadas cada eje se intenta de
  forma independiente (borde derecho → se alinea a la derecha; borde
  inferior → abre arriba). El navegador sigue al ancla en el compositor:
  **cero lag al scrollear** (el menú sale de vista junto con su campo;
  nunca flota despegado). `position-visibility: anchors-visible` queda
  como mejora progresiva para anclas inválidas.
- En modo anchor `repositionMenu` solo refresca `smartMaxHeight` (cap =
  máximo entre espacio superior e inferior, porque el navegador elige el
  lado con flip; el lado flipeado no debe nacer recortado).
- `location: 'left' | 'right'` y navegadores sin soporte usan el path JS
  (`fixed` + `getBoundingClientRect` + scroll-tracking). `:anchor="false"`
  fuerza el path JS (kill-switch determinista).
- La detección es solo-cliente (`onMounted`); en SSR el menú nace cerrado
  con el estilo oculto, sin mismatch de hidratación.

## Bordes y radio

- Panel `rounded-md` (antes `rounded-b`: redondeaba solo abajo y no seguía la
  escala global `--kun-radius`).
- Superficie flotante: `bg-default` + `ring ring-default` (antes `bg-elevated` +
  `border border-default`, invisible en dark porque `--kun-border == --kun-bg-elevated`).
