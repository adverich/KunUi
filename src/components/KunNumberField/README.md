# KunNumberField

> Localized numeric input (natural/bank modes).
>
> Campo numérico con formato localizado (modos natural/bank).

## Uso · Usage

```vue
<script setup>
import { KunNumberField } from 'adverich-kun-ui'
</script>

<template>
  <KunNumberField />
</template>
```

> Con `app.use(KunUI)` el componente queda registrado globalmente y no hace falta importarlo. · With `app.use(KunUI)` the component is globally registered, no import needed.

## Props

| Propiedad · Prop | Tipo · Type | Defecto · Default | Descripción · Description |
|---|---|---|---|
| `modelValue` | `number \| string \| null` | `null` | Valor numérico (v-model). `null` = vacío (también lo emite `onClear`). |
| `placeholder` | `String \| Number` | `''` | Placeholder. Si existe, el label flota siempre. |
| `label` | `String` | `''` | Etiqueta flotante (mismo sistema que KunTextField). |
| `labelColor` | `String` | `'text-ui'` | Color del label en reposo. |
| `floatingLabelColor` | `String` | `null` | Color del label flotando (null = usa `labelColor`). |
| `labelSize` | `String` | `'text-sm'` | Tamaño del label en reposo. |
| `floatingLabelSize` | `String` | `'text-xs'` | Tamaño del label flotando. |
| `labelOpacity` | `String` | `'opacity-60'` | Opacidad del label en reposo. |
| `floatingLabelOpacity` | `String` | `'opacity-80'` | Opacidad del label flotando. |
| `labelLeft` | `String` | `null` | Offset izquierdo en reposo (null = automático según iconos). |
| `floatingLabelLeft` | `String` | `'left-2'` | Offset izquierdo flotando. |
| `floatingLabelTop` | `String` | `'-top-2'` | Posición superior flotando. |
| `labelClass` | `String` | `''` | Clase libre para el label. |
| `dirty` | `Boolean` | `false` | Marca el campo como tocado (flota el label). |
| `prefix` | `String` | `''` | Texto fijo al inicio. |
| `suffix` | `String` | `''` | Texto fijo al final. |
| `prependIcon` | `String` | `-` | Ícono externo al inicio (fuera del borde). Legacy: ver `prependInnerIcon`. |
| `appendIcon` | `String` | `-` | Ícono externo al final (fuera del borde). Legacy: ver `appendInnerIcon`. |
| `prependInnerIcon` | `String \| Object \| Function \| Array` | `null` | Ícono interno al inicio. |
| `appendInnerIcon` | `String \| Object \| Function \| Array` | `null` | Ícono interno al final. |
| `prependInnerClass` | `String` | `-` | Clase del contenedor del ícono interno inicial. |
| `appendInnerClass` | `String` | `-` | Clase del contenedor del ícono interno final. |
| `rounded` | `String` | `'rounded'` | Redondeo del contenedor. |
| `borderColor` | `String` | `'border-ui'` | Color del borde. |
| `textColor` | `String` | `'text-ui'` | Color del texto del valor. |
| `inputTextSize` | `String` | `null` | Tamaño del texto del valor (null = 'text-sm'). |
| `inputWeight` | `String` | `null` | Peso del texto del valor (null = hereda). |
| `placeholderColor` | `String` | `'placeholder-ui'` | Color del placeholder. |
| `placeholderTextSize` | `String` | `null` | Tamaño del placeholder ('text-lg' o 'placeholder:text-lg'). |
| `inputStyle` | `String` | `''` | Clase libre para el input. |
| `bgInput` | `String` | `'bg-field-background'` | Color de fondo del contenedor. |
| `textCenter` | `Boolean` | `false` | Centra el texto del valor. |
| `controlVariant` | `String` | `'default'` | Variante de botones de incremento: 'default' \| 'stacked' \| 'split'. |
| `noArrows` | `Boolean` | `false` | Oculta los botones ▲▼ (quedan `onIncrement`/`onDecrement` por slot). |
| `density` | `KunNumberFieldDensity` | `'default'` | Densidad del padding y alturas (misma escala que KunTextField).<br/>Valores · Values: `default` `comfortable` `compact` |
| `error` | `Boolean` | `false` | Estado de error visual. |
| `errorMessages` | `String \| Array` | `-` | Mensajes de error externos. |
| `rules` | `Array` | `() => []` | Reglas de validación: `(valor) => true \| string`. |
| `id` | `String` | `null` | Id del input nativo. |
| `name` | `String` | `null` | Nombre del input nativo. |
| `autocomplete` | `String` | `'off'` | Autocomplete nativo. |
| `inputmode` | `String` | `'decimal'` | Teclado virtual en móvil ('decimal' muestra teclado numérico). |
| `required` | `Boolean` | `false` | Requerido (nativo + validación). |
| `disabled` | `Boolean` | `false` | Deshabilita el campo. |
| `readonly` | `Boolean` | `false` | Solo lectura. |
| `clearable` | `Boolean` | `false` | Muestra botón limpiar. |
| `maxlength` | `Number \| String` | `null` | Longitud máxima nativa (activa el counter). |
| `counter` | `Boolean` | `false` | Muestra contador (requiere `maxlength`). |
| `debounce` | `Number` | `300` | Debounce en ms para emitir el modelo. |
| `hint` | `String` | `''` | Texto de ayuda. |
| `persistentHint` | `Boolean` | `false` | Muestra el hint siempre. |
| `hideDetails` | `Boolean` | `false` | Oculta el área de detalles. |
| `validateOnBlur` | `Boolean` | `false` | Valida solo al perder el foco. |
| `min` | `Number \| String` | `-Infinity` | Valor mínimo (clamp + flechas). Acepta -Infinity. |
| `max` | `Number \| String` | `Infinity` | Valor máximo (clamp + flechas). Acepta Infinity. |
| `step` | `Number \| String` | `1` | Paso de incremento/decremento. |
| `locale` | `string \| null` | `null` | Locale de formato (null = global, default 'es-AR'). |
| `separator` | `String` | `','` | Separador decimal de entrada. |
| `useGrouping` | `Boolean` | `true` | Agrupa miles al mostrar. |
| `precision` | `Number \| String` | `2` | Decimales de formato y edición. |
| `formatMode` | `String` | `'natural'` | Modo de entrada: 'natural' (libre) \| 'bank' (estricto, cursor controlado). |

## Eventos · Events

- `update:modelValue`
- `focus`
- `input`
- `blur`
- `handleClick`
- `keyDown`
- `keyUp`
- `enter`

## Slots

- `#prepend-icon`
- `#prepend-inner`
- `#append-inner`
- `#append-icon`

## Métodos expuestos · Exposed

- `numberInput()`
- `rootRef()`
- `focus()`

## Notas · Notes

## Input siempre `type="text"`

La prop `type` está declarada pero **sin efecto**: el formateo custom es
incompatible con `number` nativo (lo sanearía a vacío y mostraría
spinners). No la cambies ni la bindees a `number`.

## Modos de entrada

- `natural` (default): entrada libre con formato al confirmar.
- `bank`: estricto tipo homebanking, cursor controlado.

## Paridad con KunTextField

Mismo sistema de 4 iconos (`prepend`/`append` externos + `prepend-inner` /
`append-inner`), label flotante, densidades y eventos (más `input` crudo).
Los slots `prepend`/`append` externos aún no existen en NF (solo en TF).

---

_Generado por · Generated by `scripts/generate-docs.ts`. No editar a mano · Do not edit by hand._

Machine-readable: `registry.json` → `KunNumberField`.
