# KunCheckbox

> Single/multiple checkbox with validation.
>
> Casilla de verificación simple o múltiple con validación.

## Uso · Usage

```vue
<script setup>
import { KunCheckbox } from 'adverich-kun-ui'
</script>

<template>
  <KunCheckbox />
</template>
```

> Con `app.use(KunUI)` el componente queda registrado globalmente y no hace falta importarlo. · With `app.use(KunUI)` the component is globally registered, no import needed.

## Props

| Propiedad · Prop | Tipo · Type | Defecto · Default | Descripción · Description |
|---|---|---|---|
| `modelValue` | `boolean \| unknown[] \| string \| number \| Record<string, unknown> \| null` | `-` | Valor del checkbox (v-model). En modo `multiple` es el array de seleccionados. Acepta `null` (sin valor). |
| `trueValue` | `unknown` | `true as unknown` | Valor que representa el estado activo (cualquier tipo; el default no estrecha la inferencia). |
| `falseValue` | `unknown` | `false as unknown` | Valor que representa el estado inactivo (cualquier tipo; el default no estrecha la inferencia). |
| `value` | `unknown` | `undefined as unknown` | Valor de esta opción (para grupos con `multiple`). Acepta cualquier tipo. |
| `indeterminate` | `Boolean` | `-` | Estado indeterminado (guion medio). |
| `multiple` | `Boolean` | `-` | Permite selección múltiple (usa `value` por opción). |
| `disabled` | `Boolean` | `-` | Deshabilita el checkbox. |
| `readonly` | `Boolean` | `-` | Solo lectura (no cambia el valor). |
| `error` | `Boolean` | `-` | Estado de error visual. |
| `label` | `String` | `-` | Etiqueta al lado del checkbox. |
| `hint` | `String` | `-` | Texto de ayuda bajo el campo. |
| `persistentHint` | `Boolean` | `-` | Muestra el hint siempre (no solo al enfocar). |
| `errorMessages` | `String \| Array` | `-` | Mensajes de error externos. |
| `rules` | `Array` | `-` | Reglas de validación: `(valor) => true \| string`. |
| `validateOn` | `KunCheckboxValidateOn` | `-` | Cuándo validar: 'input' valida al escribir.<br/>Valores · Values: `blur` `input` |
| `ripple` | `Boolean \| Object` | `true` | Efecto ripple al hacer click. |
| `density` | `KunCheckboxDensity` | `'default'` | Densidad del padding (escala el tamaño como KunAvatar: comfortable/compact reducen).<br/>Valores · Values: `default` `comfortable` `compact` |
| `direction` | `KunCheckboxDirection` | `'horizontal'` | Dirección del layout (label al lado o debajo).<br/>Valores · Values: `horizontal` `vertical` |
| `color` | `KunColor \| null` | `null` | Color semántico de la caja activa; `null` usa el default (`bg-primary text-highlighted`). |
| `iconColor` | `KunColor \| null` | `null` | Color semántico del glifo (✓) sobre la caja; gana sobre el texto heredado de `color`. |
| `baseColor` | `KunColor \| null` | `null` | Color semántico de la caja inactiva (tinte suave); `null` usa `bg-elevated`. |
| `trueIcon` | `string \| Record<string, unknown> \| Function \| null` | `-` | Ícono personalizado para el estado activo. Acepta alias `$`, componente o clase CSS. |
| `falseIcon` | `string \| Record<string, unknown> \| Function \| null` | `-` | Ícono personalizado para el estado inactivo. Acepta alias `$`, componente o clase CSS. |
| `indeterminateIcon` | `string \| Record<string, unknown> \| Function \| null` | `-` | Ícono personalizado para el estado indeterminado. Acepta alias `$`, componente o clase CSS. |
| `prependIcon` | `string \| Record<string, unknown> \| Function \| null` | `-` | Ícono externo al inicio. Acepta alias `$`, componente o clase CSS. |
| `appendIcon` | `string \| Record<string, unknown> \| Function \| null` | `-` | Ícono externo al final. Acepta alias `$`, componente o clase CSS. |
| `name` | `String` | `-` | Nombre del input nativo (agrupa radios/checkboxes). |
| `id` | `String` | `-` | Id del input nativo. |
| `glow` | `Boolean` | `-` | Resplandor decorativo. |
| `hideDetails` | `Boolean \| String` | `-` | Oculta el área de detalles (errores/hint). Acepta 'auto'. |
| `centerAffix` | `Boolean` | `true` | Centra el afijo verticalmente. |
| `valueComparator` | `Function` | `-` | Comparador custom para igualdad de valores: `(a, b) => boolean`. |
| `validationValue` | `unknown` | `undefined as unknown` | Valor usado para validar (por defecto el modelValue). Acepta cualquier tipo. |
| `focused` | `Boolean` | `-` | Estado de foco controlado. |
| `maxErrors` | `String \| Number` | `1` | Cantidad máxima de errores visibles. |
| `width` | `String \| Number` | `-` | Ancho del campo. |
| `minWidth` | `String \| Number` | `-` | Ancho mínimo del campo. |
| `maxWidth` | `String \| Number` | `-` | Ancho máximo del campo. |
| `size` | `KunCheckboxSize` | `'md'` | Tamaño: 'sm' \| 'md' \| 'lg'.<br/>Valores · Values: `sm` `md` `lg` |

## Eventos · Events

- `update:modelValue`
- `update:focused`
- `click:append`
- `click:prepend`

## Slots

- `#prepend`
- `#input`
- `#label`
- `#append`
- `#details`
- `#message`

## Métodos expuestos · Exposed

- `validate()`

## Notas · Notes

## Color alineado a `KunColor` (anula párrafos de arriba que hagan referencia a clases libres)

`color`, `iconColor` y `baseColor` ya **no** aceptan clases Tailwind crudas:

- `color`: `KunColor | null` → caja activa con `KUN_SURFACE_BG[color].solid` +
  `text-highlighted`; `null` conserva `bg-primary text-highlighted`.
- `iconColor`: `KunColor | null` → glifo con `KUN_TEXT_COLORS[color]` (literal,
  en `src/theme/kunVariants.ts`); con `iconColor` la caja queda neutra
  (`bg-elevated`).
- `baseColor`: `KunColor | null` → caja inactiva con tinte suave
  (`KUN_SURFACE_BG[color].soft`); `null` conserva `bg-elevated`.

El validador sólo acepta la unión `KunColor`; los strings libres
(`bg-success text-highlighted`, `text-green-500`) son inválidos. Consumidores
anteriores (`KunRelationMatrix`, `KunTable`) ya están migrados.

## Control con caja (rediseño)Antes el estado estaba dibujado por el glifo (`lucide:square` /
`square-check` / `square-minus`) y `color`/`baseColor` pintaban el **texto** del
root.

Ahora el control es una **caja** con el patrón de Nuxt UI:

- contorno `ring-1 ring-inset ring-accented`, `rounded-sm`;
- inactiva: `bg-elevated` (se lee sobre fondos oscuros; `bg-default` se
  confundía con la página en dark), con `baseColor` opcional;
- activa/indeterminada: `bg-primary text-highlighted` por defecto, salvo que
  el consumidor pase `color` (clases libres, p. ej. `bg-success text-highlighted`);
- con `iconColor` la caja queda neutra (`bg-elevated`) y el glifo se pinta con
  ese color: así un check verde/rojo no cae sobre `bg-primary` (verde sobre
  celeste era ilegible en dark);
- error: `ring-error`.

El glifo ya no lleva `opacity-70`: se dibuja a opacidad completa (`glow` suma
un `drop-shadow` al enfocar). Tamaño interno: sm `w-3 h-3`, md `w-3.5 h-3.5`,
lg `w-4 h-4`.

Los glifos por defecto pasan a `lucide:check` (activo), `lucide:minus`
(indeterminado) y **ninguno** (inactivo): el `square` propio ya no se dibuja
(la caja lo reemplaza). `trueIcon`/`falseIcon`/`indeterminateIcon` siguen
overrideando el glifo interior.

Ruptura: el estado activo ya no hereda el color del texto como color de glifo;
para colorear la caja pasar una clase de fondo en `color`
(ej. `color="bg-success text-highlighted"`, como en `KunRelationMatrix`).
La librería no aplica `text-inverted`; si el consumidor quiere ese
comportamiento, debe pasarlo manualmente en `color` o `class`.

---

_Generado por · Generated by `scripts/generate-docs.ts`. No editar a mano · Do not edit by hand._

Machine-readable: `registry.json` → `KunCheckbox`.
