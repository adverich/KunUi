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
| `rounded` | `String` | `'rounded'` | Redondeo del contenedor. |
| `borderColor` | `String` | `'border-ui'` | Color del borde. |
| `textColor` | `String` | `'text-ui'` | Color del texto del valor. |
| `labelColor` | `String` | `'text-ui'` | Color del label en reposo. |
| `floatingLabelColor` | `string \| null` | `null` | Color del label flotando (null = usa `labelColor`). |
| `labelSize` | `String` | `'text-sm'` | Tamaño del label en reposo. |
| `floatingLabelSize` | `String` | `'text-xs'` | Tamaño del label flotando. |
| `labelOpacity` | `String` | `'opacity-60'` | Opacidad del label en reposo. |
| `floatingLabelOpacity` | `String` | `'opacity-80'` | Opacidad del label flotando. |
| `labelLeft` | `string \| null` | `null` | Offset izquierdo del label en reposo (null = automático según iconos). |
| `floatingLabelLeft` | `String` | `'left-2'` | Offset izquierdo del label flotando. |
| `floatingLabelTop` | `String` | `'-top-2'` | Posición superior del label flotando. |
| `labelClass` | `String` | `''` | Clase libre para el label. |
| `placeholderColor` | `String` | `'placeholder-ui'` | Color del placeholder. |
| `inputTextSize` | `string \| null` | `null` | Tamaño del texto del valor (null = 'text-sm'). |
| `inputWeight` | `string \| null` | `null` | Peso del texto del valor (null = hereda). |
| `placeholderTextSize` | `string \| null` | `null` | Tamaño del placeholder ('text-lg' o 'placeholder:text-lg'). |
| `bgInput` | `String` | `'bg-field-background'` | Color de fondo del contenedor. |
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

## Sistema de iconos y slots

- Externos (fuera del borde): `prependIcon` / `appendIcon`.
- Internos: `prependInnerIcon` / `appendInnerIcon`.
- Nombre de slot = nombre del prop sin `Icon` (`prependIcon` → `#prepend`),
  más `#prepend-inner`, `#prepend-input-content`, `#default`,
  `#append-inner`, `#append`.

---

_Generado por · Generated by `scripts/generate-docs.ts`. No editar a mano · Do not edit by hand._

Machine-readable: `registry.json` → `KunTextField`.
