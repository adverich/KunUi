# KunTextarea

> Multiline textarea with validation.
>
> Área de texto multilínea con validación.

## Uso · Usage

```vue
<script setup>
import { KunTextarea } from 'adverich-kun-ui'
</script>

<template>
  <KunTextarea />
</template>
```

> Con `app.use(KunUI)` el componente queda registrado globalmente y no hace falta importarlo. · With `app.use(KunUI)` the component is globally registered, no import needed.

## Props

| Propiedad · Prop | Tipo · Type | Defecto · Default | Descripción · Description |
|---|---|---|---|
| `modelValue` | `String \| Number \| Object` | `-` | Valor del campo (v-model). Con formatModel='json' acepta objetos. |
| `label` | `String` | `-` | Etiqueta flotante. |
| `hint` | `String` | `-` | Texto de ayuda. |
| `persistentHint` | `Boolean` | `false` | Muestra el hint siempre. |
| `class` | `String` | `-` | Clase extra del textarea. |
| `textAlign` | `KunTextareaTextAlign` | `'left'` | Alineación del texto.<br/>Valores · Values: `left` `center` `right` |
| `formatModel` | `KunTextareaFormatModel` | `'auto'` | Formato del modelo: 'auto' (detecta JSON) \| 'json' \| 'plain'.<br/>Valores · Values: `auto` `json` `plain` |
| `loading` | `Boolean` | `-` | Muestra barra de carga superior. |
| `prependIcon` | `String \| Object \| Function` | `-` | Ícono externo al inicio. |
| `appendIcon` | `String \| Object \| Function` | `-` | Ícono externo al final. |
| `prependInnerIcon` | `String \| Object \| Function` | `-` | Ícono interno al inicio. |
| `appendInnerIcon` | `String \| Object \| Function` | `-` | Ícono interno al final. |
| `clearable` | `Boolean` | `-` | Muestra botón limpiar. |
| `persistentClear` | `Boolean` | `-` | El botón limpiar siempre visible (no solo con valor). |
| `loader` | `Boolean` | `-` | Muestra loader (reservado, actualmente sin efecto; usar `loading`). |
| `hideDetails` | `Boolean \| String` | `-` | Oculta el área de detalles ('auto' = solo si hay mensajes/hint). |
| `disabled` | `Boolean` | `-` | Deshabilita el campo. |
| `readonly` | `Boolean` | `-` | Solo lectura. |
| `blurValidation` | `Boolean` | `-` | Valida al perder el foco. |
| `rules` | `Array` | `-` | Reglas de validación: `(valor) => true \| string`. |
| `errorMessages` | `String \| Array` | `-` | Mensajes de error externos. |
| `maxErrors` | `Number` | `3` | Cantidad máxima de errores visibles. |
| `error` | `Boolean` | `-` | Estado de error visual. |
| `counter` | `Boolean` | `-` | Muestra contador de caracteres. |
| `persistentCounter` | `Boolean` | `-` | Contador siempre visible (no solo en foco). |
| `maxLength` | `Number \| String` | `-` | Máximo de caracteres (`maxlength` nativo; también limita el contador). |
| `autoGrow` | `Boolean` | `-` | Ajusta la altura al contenido automáticamente. |
| `noResize` | `Boolean` | `-` | Deshabilita el resize manual. |
| `maxRows` | `Number \| String` | `-` | Filas máximas con `autoGrow`. |
| `placeholder` | `String` | `-` | Placeholder. |
| `name` | `String` | `-` | Nombre del textarea nativo. |
| `id` | `String` | `-` | Id del textarea nativo. |
| `autocomplete` | `String` | `-` | Autocomplete nativo. |
| `rows` | `Number \| String` | `5` | Filas visibles iniciales. |
| `dirty` | `Boolean` | `-` | Marca el campo como tocado (flota el label). |
| `variant` | `KunTextareaVariant` | `'outlined'` | Variante visual: 'filled' \| 'outlined' \| 'underlined' \| 'solo'.<br/>Valores · Values: `filled` `outlined` `underlined` `solo` |
| `density` | `KunTextareaDensity` | `'default'` | Densidad del padding.<br/>Valores · Values: `default` `comfortable` `compact` |
| `inputClass` | `String \| Array` | `-` | Clase extra del textarea. |
| `wrapperClass` | `String \| Array` | `-` | Clase extra del contenedor. |
| `tile` | `Boolean` | `-` | Sin redondeo. |
| `rounded` | `String` | `'rounded-md'` | Redondeo (clase de escala, `rounded-md` por defecto). |
| `flat` | `Boolean` | `-` | Sin sombra. |
| `loadingColor` | `String` | `-` | Color de la barra de carga (clase `bg-*` del theme). |
| `clearIcon` | `Boolean` | `-` | Muestra el botón limpiar (requiere `clearable` con valor). |
| `debounceTime` | `Number` | `300` | Debounce en ms para emitir el modelo. |

## Eventos · Events

- `update:modelValue`
- `click:clear`
- `click:control`
- `update:focused`
- `mousedown:control`

## Slots

- `#label`
- `#prepend`
- `#prepend-inner`
- `#clear`
- `#append-inner`
- `#append`
- `#loader`
- `#details`
- `#message`
- `#hint`
- `#counter`

## Métodos expuestos · Exposed

- `validate()`
- `reset()`
- `resetValidation()`
- `errorMessages()`
- `displayedMessages()`
- `isValid()`
- `focus()`
- `rootRef()`
- `textareaRef()`

## Notas · Notes

## Muesca del label flotante + desplazamiento por `rounded` (variante outlined)

Igual que `KunTextField`/`KunNumberField`, vía el composable compartido
`useKunFieldNotch` (`src/utils/useKunFieldNotch.ts`): el overlay dibuja el
borde nativo completo (respeta cualquier `rounded`, pill incluida;
`roundedClass` = `fieldsetRoundedClass`) y la muesca se recorta con `mask`
sobre la caja real del label (medida por JS + `ResizeObserver`). Hueco real
en cualquier fondo, sin `fieldset`/`legend`. El label flotante se desplaza
2px por escalón de `rounded`.

## Bordes y radio

- Default de `rounded`: `'rounded-md'` (antes `'rounded'` pelado).
- `textareaClasses` y el borde del fieldset derivan ahora de
  `fieldsetRoundedClass`, sin claves `rounded` / `rounded-none` paralelas.
- La barra de carga interna usa `rounded-md`.
- Contorno por rol: `filled` → `bg-default border-accented`; `outlined`/`underlined`
  → `border-accented`; `solo` → `bg-elevated ring ring-inset ring-accented`; notch
  `border-accented` (fin del hack `dark:border-muted`).

---

_Generado por · Generated by `scripts/generate-docs.ts`. No editar a mano · Do not edit by hand._

Machine-readable: `registry.json` → `KunTextarea`.
