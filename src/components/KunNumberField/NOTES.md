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

## Controles split centrados + `controlClass`

La variante `control-variant="split"` usa wrappers `flex self-stretch`
con botones `flex items-center justify-center` para que `−`/`+` queden
centrados verticalmente incluso con `rounded-full`.

La prop `controlClass` (default `''`) se combina después del padding por
`density` en todas las variantes (`default`/`stacked`/`split`).
Ej. pill con más aire horizontal:

```vue
<KunNumberField
  v-model="cantidad"
  control-variant="split"
  rounded="rounded-full"
  control-class="px-4"
  text-center
/>
```
