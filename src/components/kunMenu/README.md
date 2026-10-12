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
| `bgColor` | `String` | `'bg-menu'` | Color de fondo. |
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
| `zIndex` | `String \| Number` | `-` | Z-index del contenido. |
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
  `position-try-fallbacks: flip-block flip-inline` (flip arriba/abajo
  nativo). El navegador sigue al ancla en el compositor: **cero lag al
  scrollear** (el menú sale de vista junto con su campo; nunca flota
  despegado). `position-visibility: anchors-visible` queda como mejora
  progresiva para anclas inválidas.
- En modo anchor `repositionMenu` solo refresca `smartMaxHeight` (cap =
  máximo entre espacio superior e inferior, porque el navegador elige el
  lado con flip; el lado flipeado no debe nacer recortado).
- `location: 'left' | 'right'` y navegadores sin soporte usan el path JS
  (`fixed` + `getBoundingClientRect` + scroll-tracking). `:anchor="false"`
  fuerza el path JS (kill-switch determinista).
- La detección es solo-cliente (`onMounted`); en SSR el menú nace cerrado
  con el estilo oculto, sin mismatch de hidratación.

---

_Generado por · Generated by `scripts/generate-docs.ts`. No editar a mano · Do not edit by hand._

Machine-readable: `registry.json` → `KunMenu`.
