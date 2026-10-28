# KunTextField

> Text input with floating label, validation and icons.
>
> Campo de texto con label flotante, validación e iconos.

## Uso · Usage

```vue
<script setup>
import { KunTextField } from 'adverich-kun-ui'
</script>

<template>
  <KunTextField />
</template>
```

> Con `app.use(KunUI)` el componente queda registrado globalmente y no hace falta importarlo. · With `app.use(KunUI)` the component is globally registered, no import needed.

## Props

| Propiedad · Prop | Tipo · Type | Defecto · Default | Descripción · Description |
|---|---|---|---|
| `modelValue` | `String \| Number` | `''` | Valor del campo (v-model). |
| `placeholder` | `String \| Number` | `''` | Placeholder. Si existe, el label flota siempre. |
| `label` | `String` | `''` | Etiqueta flotante (centrada en reposo, arriba en foco/valor). |
| `dirty` | `Boolean` | `false` | Marca el campo como tocado (flota el label). |
| `prefix` | `String` | `''` | Texto fijo al inicio. |
| `suffix` | `String` | `''` | Texto fijo al final. |
| `prependIcon` | `String` | `-` | Ícono externo al inicio (fuera del borde). |
| `appendIcon` | `String` | `-` | Ícono externo al final (fuera del borde). |
| `prependInnerIcon` | `string \| Record<string, any> \| Function \| unknown[] \| null` | `null` | Ícono interno al inicio. |
| `appendInnerIcon` | `string \| Record<string, any> \| Function \| unknown[] \| null` | `null` | Ícono interno al final. |
| `prependInnerClass` | `String` | `-` | Clase del contenedor del ícono interno inicial. |
| `appendInnerClass` | `String` | `-` | Clase del contenedor del ícono interno final. |
| `rounded` | `String` | `'rounded-md'` | Redondeo del contenedor (clase de escala, `rounded-md` por defecto). |
| `bgInput` | `string \| null` | `null` | Color de fondo del contenedor (clase Tailwind, p. ej. `bg-success/20`). `null` = `bg-default`, con `bg-error/10` automático en estado de error. Si se define, reemplaza el fondo (y el automático de error). |
| `labelSize` | `String` | `'text-sm'` | Tamaño del label en reposo. |
| `floatingLabelSize` | `String` | `'text-xs'` | Tamaño del label flotando. |
| `labelOpacity` | `String` | `'opacity-60'` | Opacidad del label en reposo. |
| `floatingLabelOpacity` | `String` | `'opacity-80'` | Opacidad del label flotando. |
| `labelLeft` | `string \| null` | `null` | Offset izquierdo del label en reposo (null = automático según iconos). |
| `floatingLabelLeft` | `String` | `'left-2'` | Offset izquierdo del label flotando. |
| `floatingLabelTop` | `String` | `'top-[-2px]'` | Posición superior del label flotando ('top-[-2px]' + `-translate-y-1/2` = centrado sobre el borde). |
| `labelClass` | `String` | `''` | Clase libre para el label. |
| `inputTextSize` | `string \| null` | `null` | Tamaño del texto del valor (null = 'text-sm'). |
| `inputWeight` | `string \| null` | `null` | Peso del texto del valor (null = hereda). |
| `placeholderTextSize` | `string \| null` | `null` | Tamaño del placeholder ('text-lg' o 'placeholder:text-lg'). |
| `inputStyle` | `String` | `''` | Clase libre para el input. |
| `textCenter` | `Boolean` | `false` | Centra el texto del valor. |
| `density` | `KunTextFieldDensity` | `'default'` | Densidad del padding y alturas.<br/>Valores · Values: `default` `comfortable` `compact` |
| `error` | `Boolean` | `false` | Estado de error visual. |
| `errorMessage` | `String` | `''` | Mensaje de error externo. |
| `rules` | `Array` | `() => []` | Reglas de validación: `(valor) => true \| string`. |
| `id` | `string \| null` | `null` | Id del input nativo. |
| `name` | `string \| null` | `null` | Nombre del input nativo. |
| `autocomplete` | `String` | `'off'` | Autocomplete nativo. |
| `required` | `Boolean` | `false` | Requerido (nativo + validación). |
| `disabled` | `Boolean` | `false` | Deshabilita el campo. |
| `readonly` | `Boolean` | `false` | Solo lectura. |
| `inputmode` | `string \| null` | `null` | Teclado virtual en móvil. |
| `minlength` | `number \| string \| null` | `null` | Longitud mínima nativa. |
| `clearable` | `Boolean` | `false` | Muestra botón limpiar. |
| `maxlength` | `number \| string \| null` | `null` | Longitud máxima nativa (activa el counter). |
| `pattern` | `string \| null` | `null` | Patrón regex nativo. |
| `spellcheck` | `boolean \| string \| null` | `null` | Corrector ortográfico nativo. |
| `counter` | `Boolean` | `false` | Muestra contador (requiere `maxlength`). |
| `debounce` | `Number` | `300` | Debounce en ms para emitir el modelo. |
| `hint` | `String` | `''` | Texto de ayuda. |
| `persistentHint` | `Boolean` | `false` | Muestra el hint siempre. |
| `hideDetails` | `Boolean` | `false` | Oculta el área de detalles. |
| `validateOnBlur` | `Boolean` | `false` | Valida solo al perder el foco. |
| `showPasswordToggle` | `Boolean` | `true` | Muestra toggle ver/ocultar con `type="password"`. |

## Eventos · Events

- `update:modelValue`
- `focus`
- `blur`
- `handleClick`
- `keyDown`
- `keyUp`
- `enter`
- `input`

## Slots

- `#prepend`
- `#prepend-inner`
- `#prepend-input-content`
- `#default`
- `#append-inner`
- `#append`

## Métodos expuestos · Exposed

- `validate()`
- `reset()`
- `resetValidation()`
- `inputField()`
- `rootRef()`
- `focus()`

## Notas · Notes

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

## Bordes y radio

- Default de `rounded`: `'rounded-md'` (antes `'rounded'` pelado, 4px fijos que no
  seguían `--kun-radius`).
- La escala de desplazamiento del label (`src/utils/useKunFieldNotch.ts`) se
  alineó a los pasos reales de Tailwind: con `rounded-md` el label se mueve 4px
  (antes 6px). Detalle en `docs/refactor/borders-radius.md`.
- Contorno por rol: contenedor `bg-default` y notch `border-accented` (foco
  `border-primary`, error `border-error`). Antes `bg-muted` + `border-default`,
  invisible en dark (`--kun-border == --kun-bg-muted == neutral-800`).

---

_Generado por · Generated by `scripts/generate-docs.ts`. No editar a mano · Do not edit by hand._

Machine-readable: `registry.json` → `KunTextField`.
