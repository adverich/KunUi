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
| `placeholder` | `string \| number` | `''` | Placeholder. Si existe, el label flota siempre. |
| `label` | `string` | `''` | Etiqueta flotante (mismo sistema que KunTextField). |
| `labelColor` | `string` | `'text-ui'` | Color del label en reposo. |
| `floatingLabelColor` | `string \| null` | `null` | Color del label flotando (null = usa `labelColor`). |
| `labelSize` | `string` | `'text-sm'` | Tamaño del label en reposo. |
| `floatingLabelSize` | `string` | `'text-xs'` | Tamaño del label flotando. |
| `labelOpacity` | `string` | `'opacity-60'` | Opacidad del label en reposo. |
| `floatingLabelOpacity` | `string` | `'opacity-80'` | Opacidad del label flotando. |
| `labelLeft` | `string \| null` | `null` | Offset izquierdo en reposo (null = automático según iconos). |
| `floatingLabelLeft` | `string` | `'left-2'` | Offset izquierdo flotando. |
| `floatingLabelTop` | `string` | `'-top-2'` | Posición superior flotando. |
| `labelClass` | `string` | `''` | Clase libre para el label. |
| `dirty` | `boolean` | `false` | Marca el campo como tocado (flota el label). |
| `prefix` | `string` | `''` | Texto fijo al inicio. |
| `suffix` | `string` | `''` | Texto fijo al final. |
| `prependIcon` | `string` | `-` | Ícono externo al inicio (fuera del borde). Legacy: ver `prependInnerIcon`. |
| `appendIcon` | `string` | `-` | Ícono externo al final (fuera del borde). Legacy: ver `appendInnerIcon`. |
| `prependInnerIcon` | `string \| Record<string, any> \| Function \| unknown[] \| null` | `null` | Ícono interno al inicio. |
| `appendInnerIcon` | `string \| Record<string, any> \| Function \| unknown[] \| null` | `null` | Ícono interno al final. |
| `prependInnerClass` | `string` | `-` | Clase del contenedor del ícono interno inicial. |
| `appendInnerClass` | `string` | `-` | Clase del contenedor del ícono interno final. |
| `rounded` | `string` | `'rounded'` | Redondeo del contenedor. |
| `borderColor` | `string` | `'border-ui'` | Color del borde. |
| `textColor` | `string` | `'text-ui'` | Color del texto del valor. |
| `inputTextSize` | `string \| null` | `null` | Tamaño del texto del valor (null = 'text-sm'). |
| `inputWeight` | `string \| null` | `null` | Peso del texto del valor (null = hereda). |
| `placeholderColor` | `string` | `'placeholder-ui'` | Color del placeholder. |
| `placeholderTextSize` | `string \| null` | `null` | Tamaño del placeholder ('text-lg' o 'placeholder:text-lg'). |
| `inputStyle` | `string` | `''` | Clase libre para el input. |
| `bgInput` | `string` | `'bg-field-background'` | Color de fondo del contenedor. |
| `textCenter` | `boolean` | `false` | Centra el texto del valor. |
| `controlVariant` | `KunNumberFieldControlVariant` | `'default'` | Variante de botones de incremento: 'default' \| 'stacked' \| 'split'.<br/>Valores · Values: `default` `stacked` `split` |
| `noArrows` | `boolean` | `false` | Oculta los botones ▲▼ (quedan `onIncrement`/`onDecrement` por slot). |
| `density` | `KunNumberFieldDensity` | `'default'` | Densidad del padding y alturas (misma escala que KunTextField).<br/>Valores · Values: `default` `comfortable` `compact` |
| `error` | `boolean` | `false` | Estado de error visual. |
| `errorMessages` | `string \| string[]` | `-` | Mensajes de error externos. |
| `rules` | `Array<(value: any) => boolean \| string>` | `() => []` | Reglas de validación: `(valor) => true \| string`. |
| `id` | `string \| null` | `null` | Id del input nativo. |
| `name` | `string \| null` | `null` | Nombre del input nativo. |
| `autocomplete` | `string` | `'off'` | Autocomplete nativo. |
| `inputmode` | `KunNumberFieldInputmode` | `'decimal'` | Teclado virtual en móvil ('decimal' muestra teclado numérico).<br/>Valores · Values: `none` `text` `decimal` `numeric` `tel` `search` `email` `url` |
| `required` | `boolean` | `false` | Requerido (nativo + validación). |
| `disabled` | `boolean` | `false` | Deshabilita el campo. |
| `readonly` | `boolean` | `false` | Solo lectura. |
| `clearable` | `boolean` | `false` | Muestra botón limpiar. |
| `maxlength` | `number \| string \| null` | `null` | Longitud máxima nativa (activa el counter). |
| `counter` | `boolean` | `false` | Muestra contador (requiere `maxlength`). |
| `debounce` | `number` | `300` | Debounce en ms para emitir el modelo. |
| `hint` | `string` | `''` | Texto de ayuda. |
| `persistentHint` | `boolean` | `false` | Muestra el hint siempre. |
| `hideDetails` | `boolean` | `false` | Oculta el área de detalles. |
| `validateOnBlur` | `boolean` | `false` | Valida solo al perder el foco. |
| `min` | `number \| string` | `-Infinity` | Valor mínimo (clamp + flechas). Acepta -Infinity. |
| `max` | `number \| string` | `Infinity` | Valor máximo (clamp + flechas). Acepta Infinity. |
| `step` | `number \| string` | `1` | Paso de incremento/decremento. |
| `locale` | `string \| null` | `null` | Locale de formato (null = global, default 'es-AR'). |
| `separator` | `string` | `','` | Separador decimal de entrada (típico ',' o '.'). |
| `useGrouping` | `boolean` | `true` | Agrupa miles al mostrar. |
| `precision` | `number \| string` | `2` | Decimales de formato y edición. |
| `formatMode` | `KunNumberFieldFormatMode` | `'natural'` | Modo de entrada: 'natural' (libre) \| 'bank' (estricto, cursor controlado).<br/>Valores · Values: `natural` `bank` |

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
