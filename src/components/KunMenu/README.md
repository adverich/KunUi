# KunMenu

> Dropdown menu anchored to an activator.
>
> Menú desplegable anclado a un activador.

## Uso · Usage

```vue
<script setup>
import { KunMenu } from 'adverich-kun-ui'
</script>

<template>
  <KunMenu />
</template>
```

> Con `app.use(KunUI)` el componente queda registrado globalmente y no hace falta importarlo. · With `app.use(KunUI)` the component is globally registered, no import needed.

## Props

| Propiedad · Prop | Tipo · Type | Defecto · Default | Descripción · Description |
|---|---|---|---|
| `class` | `String \| Array \| Object` | `-` | Clase extra del contenido. |
| `modelValue` | `Boolean` | `-` | Apertura (v-model). |
| `activator` | `String \| Object` | `-` | Selector o elemento que dispara el menú (reservado, sin efecto; usar el slot `activator`). |
| `activatorProps` | `Object` | `() => ({})` | Props que se pasan al activador (reservado, sin efecto; usar el slot `activator`). |
| `parentRef` | `Object` | `-` | Ref del elemento padre para posicionar. |
| `attach` | `Boolean \| String \| Object` | `-` | Dónde montar el contenido (Teleport). |
| `openOnClick` | `Boolean` | `-` | Abrir al hacer click en el activador. |
| `openOnHover` | `Boolean` | `-` | Abrir al pasar el mouse. |
| `openOnFocus` | `Boolean` | `-` | Abrir al enfocar. |
| `closeOnContentClick` | `Boolean` | `true` | Cerrar al hacer click en el contenido. |
| `closeOnBack` | `Boolean` | `true` | Cerrar con el botón atrás del navegador. |
| `contained` | `Boolean` | `-` | Contenido limitado al padre (sin Teleport). |
| `disabled` | `Boolean` | `-` | Deshabilita el menú. |
| `eager` | `Boolean` | `-` | Renderiza el contenido aunque esté cerrado. |
| `minHeight` | `String \| Number` | `-` | Altura mínima. |
| `height` | `String \| Number` | `-` | Altura fija. |
| `maxHeight` | `String \| Number` | `-` | Altura máxima. |
| `width` | `String \| Number` | `'w-fit'` | Ancho del contenido (clase o px). |
| `minWidth` | `String \| Number` | `-` | Ancho mínimo. |
| `maxWidth` | `String \| Number` | `-` | Ancho máximo. |
| `offset` | `String \| Number \| Array` | `-` | Desplazamiento respecto al activador. |
| `openDelay` | `String \| Number` | `100` | Retraso en ms antes de abrir (hover). |
| `closeDelay` | `String \| Number` | `100` | Retraso en ms antes de cerrar (hover). |
| `location` | `KunMenuLocation` | `'bottom'` | Lado de apertura respecto al activador.<br/>Valores · Values: `top` `bottom` `left` `right` |
| `origin` | `KunMenuOrigin` | `'auto'` | Origen de la animación ('auto' = según `location`). |
| `transition` | `KunMenuTransition` | `'fade-scale'` | Animación de apertura/cierre.<br/>Valores · Values: `fade` `fade-scale` `slide-down` `slide-up` `slide-left` `slide-right` `none` |
| `persistent` | `Boolean` | `-` | No cierra al hacer click fuera ni con Escape. |
| `submenu` | `Boolean` | `-` | Comportamiento de submenú (reservado, sin efecto). |
| `label` | `String` | `'Menú contextual'` | Etiqueta accesible del menú. |
| `keyboardNavigation` | `Boolean` | `true` | Navegación con teclado (reservado, sin efecto). |
| `hideDetails` | `Boolean` | `true` | Oculta el área de detalles. |
| `anchor` | `Boolean` | `true` | Usa CSS Anchor Positioning cuando el navegador lo soporta (sin lag al scrollear). `false` fuerza el posicionamiento JS. |

## Eventos · Events

- `update:modelValue`
- `click:outside`
- `handleEscape`

## Slots

- `#default`
- `#activator`

## Notas · Notes

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
- **Orígenes horizontales `right` y `center` no usan el motor nativo.** El
  path nativo alinea el borde derecho/centro con `translate: -100%/-50%`, pero
  el fallback `flip-inline` evalúa la caja sin ese translate: en un viewport
  angosto (ancla cerca del borde derecho) el navegador cree que desborda,
  voltea el eje y vuelve a aplicar el translate, dejando el menú cientos de px
  a la izquierda del activador. Esos orígenes van por el path JS (que clampea
  al viewport). El motor nativo queda para `left`/`auto`.
- La detección es solo-cliente (`onMounted`); en SSR el menú nace cerrado
  con el estilo oculto, sin mismatch de hidratación.

## Bordes y radio

- Panel `rounded-md` (antes `rounded-b`: redondeaba solo abajo y no seguía la
  escala global `--kun-radius`).
- Superficie flotante: `bg-default` + `ring ring-default` (antes `bg-elevated` +
  `border border-default`, invisible en dark porque `--kun-border == --kun-bg-elevated`).

---

_Generado por · Generated by `scripts/generate-docs.ts`. No editar a mano · Do not edit by hand._

Machine-readable: `registry.json` → `KunMenu`.
