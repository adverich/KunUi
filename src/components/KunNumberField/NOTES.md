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
