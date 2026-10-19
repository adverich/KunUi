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
| `labelSize` | `String` | `'text-sm'` | Tamaño del label en reposo. |
| `floatingLabelSize` | `String` | `'text-xs'` | Tamaño del label flotando. |
| `labelOpacity` | `String` | `'opacity-60'` | Opacidad del label en reposo. |
| `floatingLabelOpacity` | `String` | `'opacity-80'` | Opacidad del label flotando. |
| `labelLeft` | `string \| null` | `null` | Offset izquierdo en reposo (null = automático según iconos). |
| `floatingLabelLeft` | `String` | `'left-2'` | Offset izquierdo flotando. |
| `floatingLabelTop` | `String` | `'top-[-2px]'` | Posición superior flotando ('top-[-2px]' + `-translate-y-1/2` = centrado sobre el borde). |
| `labelClass` | `String` | `''` | Clase libre para el label. |
| `dirty` | `Boolean` | `false` | Marca el campo como tocado (flota el label). |
| `prefix` | `String` | `''` | Texto fijo al inicio. |
| `suffix` | `String` | `''` | Texto fijo al final. |
| `prependIcon` | `String` | `-` | Ícono externo al inicio (fuera del borde). Legacy: ver `prependInnerIcon`. |
| `appendIcon` | `String` | `-` | Ícono externo al final (fuera del borde). Legacy: ver `appendInnerIcon`. |
| `prependInnerIcon` | `string \| Record<string, any> \| Function \| unknown[] \| null` | `null` | Ícono interno al inicio. |
| `appendInnerIcon` | `string \| Record<string, any> \| Function \| unknown[] \| null` | `null` | Ícono interno al final. |
| `prependInnerClass` | `String` | `-` | Clase del contenedor del ícono interno inicial. |
| `appendInnerClass` | `String` | `-` | Clase del contenedor del ícono interno final. |
| `rounded` | `String` | `'rounded-md'` | Redondeo del contenedor (clase de escala, `rounded-md` por defecto). |
| `inputTextSize` | `string \| null` | `null` | Tamaño del texto del valor (null = 'text-sm'). |
| `inputWeight` | `string \| null` | `null` | Peso del texto del valor (null = hereda). |
| `placeholderTextSize` | `string \| null` | `null` | Tamaño del placeholder ('text-lg' o 'placeholder:text-lg'). |
| `inputStyle` | `String` | `''` | Clase libre para el input. |
| `textCenter` | `Boolean` | `false` | Centra el texto del valor. |
| `controlVariant` | `KunNumberFieldControlVariant` | `'default'` | Variante de botones de incremento: 'default' \| 'stacked' \| 'split'.<br/>Valores · Values: `default` `stacked` `split` |
| `noArrows` | `Boolean` | `false` | Oculta los botones ▲▼ (quedan `onIncrement`/`onDecrement` por slot). |
| `controlClass` | `String` | `''` | Clase libre para los botones de incremento/decremento (ej. `px-4` para más padding horizontal). Se combina con el padding por `density`. Aplica a ambas variantes; para `split` se puede refinar por extremo con `controlStartClass` / `controlEndClass`. |
| `controlStartClass` | `String` | `''` | Clase libre solo para el botón inicial (−, izquierda en LTR) en `control-variant="split"` (ej. `pl-4` para aire solo en el extremo externo sin deformar el divisor interno). Se combina después de `controlClass`. |
| `controlEndClass` | `String` | `''` | Clase libre solo para el botón final (+, derecha en LTR) en `control-variant="split"` (ej. `pr-4` para aire solo en el extremo externo sin deformar el divisor interno). Se combina después de `controlClass`. |
| `density` | `KunNumberFieldDensity` | `'default'` | Densidad del padding y alturas (misma escala que KunTextField).<br/>Valores · Values: `default` `comfortable` `compact` |
| `error` | `Boolean` | `false` | Estado de error visual. |
| `errorMessages` | `String \| Array` | `-` | Mensajes de error externos. |
| `rules` | `Array` | `() => []` | Reglas de validación: `(valor) => true \| string`. |
| `id` | `string \| null` | `null` | Id del input nativo. |
| `name` | `string \| null` | `null` | Nombre del input nativo. |
| `autocomplete` | `String` | `'off'` | Autocomplete nativo. |
| `inputmode` | `KunNumberFieldInputmode` | `'decimal'` | Teclado virtual en móvil ('decimal' muestra teclado numérico).<br/>Valores · Values: `none` `text` `decimal` `numeric` `tel` `search` `email` `url` |
| `required` | `Boolean` | `false` | Requerido (nativo + validación). |
| `disabled` | `Boolean` | `false` | Deshabilita el campo. |
| `readonly` | `Boolean` | `false` | Solo lectura. |
| `clearable` | `Boolean` | `false` | Muestra botón limpiar. |
| `maxlength` | `number \| string \| null` | `null` | Longitud máxima nativa (activa el counter). |
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
| `formatMode` | `KunNumberFieldFormatMode` | `'natural'` | Modo de entrada: 'natural' (libre) \| 'bank' (estricto, cursor controlado).<br/>Valores · Values: `natural` `bank` |
| `hideZero` | `Boolean` | `true` | Oculta el cero en reposo y muestra el placeholder/label en su lugar (el v-model sigue siendo `0`). Sin placeholder ni label en reposo (o con `dirty`), muestra el `0` formateado (fallback automático). |

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

- `#prepend`
- `#prepend-icon`
- `#prepend-inner`
- `#append-inner`
- `#append`
- `#append-icon`

## Métodos expuestos · Exposed

- `numberInput()`
- `rootRef()`
- `focus()`

## Notas · Notes

## Muesca del label flotante + desplazamiento por `rounded`

Igual que `KunTextField`, vía el composable compartido `useKunFieldNotch`
(`src/utils/useKunFieldNotch.ts`): el overlay dibuja el borde nativo
completo (respeta cualquier `rounded`, pill incluida) y la muesca se recorta
con `mask` sobre la caja real del label (medida por JS + `ResizeObserver`).
Hueco real en cualquier fondo, sin `fieldset`/`legend`. El label flotante se
desplaza 2px por escalón de `rounded` (`margin-left`; `margin-right` si flota
anclado a la derecha con `floatingLabelLeft: 'right-*'`).

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

## Controles split centrados + `controlClass` / extremos independientes

La variante `control-variant="split"` usa wrappers `flex self-stretch`
con botones `flex items-center justify-center` para que `−`/`+` queden
centrados verticalmente incluso con `rounded-full`. Cada botón split
hereda el redondeo del contenedor solo en su extremo externo
(`rounded-l/r-[inherit]`), así el pill no se deforma y el divisor interno
sigue recto.

- `controlClass` (default `''`): base para ambas variantes, después del
  padding por `density`. `px-*` afecta ambos lados de cada botón.
- `controlStartClass` / `controlEndClass` (default `''`, solo `split`):
  override independiente por extremo, después de `controlClass`.
  Para dar aire solo hacia afuera sin ensanchar el divisor interno:

```vue
<KunNumberField
  v-model="cantidad"
  control-variant="split"
  rounded="rounded-full"
  control-start-class="pl-4"
  control-end-class="pr-4"
  text-center
/>
```

## `hideZero` (default `true`) con fallback automático

El **v-model nunca cambia**: el vacío se normaliza a `0` al blurear y los
cálculos en tiempo real siguen operando sobre `0`. Solo cambia el **display**:
en reposo, el cero se muestra vacío (`inputValue = ''`) para dejar ver el
`placeholder` o el label en reposo.

Fallback: si no hay nada que mostrar (sin `placeholder` y sin label en
reposo, o con `dirty` que flota el label al borde), se muestra el `0`
formateado para no dejar una caja fantasma. Con `hideZero: false` siempre
se muestra el `0` formateado (comportamiento histórico).

## Bordes y radio

- Default `'rounded-md'` (antes `'rounded'` pelado, 4px fijos).
- El `<input>` ya no lleva un `rounded` pelado redundante: el radio lo aplica la
  prop del contenedor.
- Lados lógicos: `border-e` / `border-s` y `rounded-s/e-[inherit]` en los botones
  split (antes `border-l/r` físicos).
- Contorno por rol: contenedor `bg-default` y notch `border-accented` (antes
  `bg-muted` + `border-default`, invisible en dark).

---

_Generado por · Generated by `scripts/generate-docs.ts`. No editar a mano · Do not edit by hand._

Machine-readable: `registry.json` → `KunNumberField`.
