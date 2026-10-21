# KunUI — Instrucciones para agentes de IA

KunUI (`adverich-kun-ui`) es una librería de componentes Vue.js 3 + Tailwind CSS.

> Referencia de componentes: **no dupliques tablas de props aquí**.
> - Índice breve: `llms.txt` (mapa, when-to-use, entry points).
> - Máquina-legible: `registry.json` (props, eventos, slots por componente).
> - Referencia completa: `src/components/<Nombre>/README.md` (generado).
> - Tipos exactos: `dist/index.d.ts` (uniones literales con autocompletado).
> - Skill de agente: `.well-known/skills/kun-ui/SKILL.md` (convenciones,
>   selección de componentes y recetas).

---

## Package manager: pnpm (obligatorio)

No uses npm ni yarn.

| Comando | Descripción |
|---------|-------------|
| `pnpm install` | Instala dependencias |
| `pnpm run dev` | Servidor de desarrollo (Vite, playground en `/examples/...`) |
| `pnpm run build` | Build de producción (JS + `.d.ts`) |
| `pnpm run typecheck` | `vue-tsc --noEmit` (debe estar en cero) |
| `pnpm run generate:barrel` | Regenera `src/components/index.ts` + `GlobalComponents` |
| `pnpm run generate:icons` | Regenera `src/icons/lucide.generated.ts` (subset lucide offline) |
| `pnpm run generate:docs` | Regenera READMEs + `registry.json` + `llms.txt` + `llms-full.txt` |

---

## TypeScript (reglas duras)

- Todo `src/` es TS (`allowJs/checkJs: false`). SFC con
  `<script setup lang="ts">`; composables `.ts` con interfaces exportadas.
- Los imports internos conservan el sufijo `.js` (`'../composables/x.js'`
  resuelve a `x.ts` con `moduleResolution: bundler`); no los cambies a `.ts`.
- `defineModel<unknown>({ default: null })` no infiere: usa
  `defineModel<any>({ default: null })` (intencional y documentado).
- Conjuntos cerrados de valores: unión literal
  (`type: String as PropType<'a' | 'b'>` + export del tipo) + `validator`.
  Nunca `String` pelado.
- Cada prop lleva comentario TSDoc inicial verificado contra su `.vue`.
  Props reservadas sin efecto se marcan como tales (no inventes
  comportamiento).

---

## Convenciones de la librería

- **Estilo con clases Tailwind**: los props de clase (`inputTextSize`,
  `fontWeight`, `rounded`, `borderColor`, …) reciben **utilidades Tailwind**;
  los colores semánticos van por `color`
  (`primary|secondary|success|info|warning|error|neutral`) y `variant`
  (`solid|outline|soft|subtle|ghost|link`), nunca como clase.
  Tamaños: `xxs|xs|sm|md|lg|xl|xxl` (fuente única: `src/theme/kunSizes.ts`).
  Mismo `size` = mismo px en todos los componentes: cuadrado/altura
  `24|28|32|36|40|48|56` e ícono 50% del cuadrado (`12|14|16|18|20|24|28`).
  Excepciones de forma: `KunSwitch` (track rectangular) y `KunCheckbox` (caja).
  KunAvatar admite además los alias legacy `3xs|2xs|2xl|3xl`.
  Densidad: `default|comfortable|compact`.
- **Bordes y radio** (detalle en `docs/refactor/borders-radius.md`):
  - **Color**: siempre un rol de token — `border-default|muted|accented|inverted`.
    Nunca `border-gray-200` ni `border` pelado (salvo `border-current` /
    `border-white` intencionales). Tokens en `src/styles/theme.css`
    (`--kun-border*`, valores alineados con Nuxt UI).
  - **Radio**: **nunca `rounded` pelado** (Tailwind lo fija en 4px y no sigue
    `--kun-radius`). Escala: `rounded-sm` (badge, tooltip, kbd), `rounded-md`
    (controles e ítems), `rounded-lg` (contenedores y paneles), `rounded-full`
    (avatar, chip, switch, radio, slider).
  - **Lados direccionales** en lógico: `border-s/e`, `rounded-s/e`, `ps/pe`
    (excepción: flecha de `KunTooltip`, aristas físicas por rotación).
  - **Ubicación del contorno** (en dark `--kun-border == --kun-bg-muted ==
    --kun-bg-elevated == neutral-800`): nunca `border-default`/`ring-default`
    sobre `bg-muted`/`bg-elevated` (mismo color ⇒ invisible). Superficies
    flotantes y chrome → `bg-default` + `ring ring-default` / `border-*`;
    controles → `ring ring-inset ring-accented` (o notch `border-accented`);
    separadores dentro de superficies elevadas → `border-muted`.
- **Slots de iconos**: prop `*Icon` → slot sin sufijo
  (`prependIcon` → `#prepend`, `appendInnerIcon` → `#append-inner`).
- **Íconos**: se resuelven con `@iconify/vue` (dependencia de la lib) contra
  la colección `lucide`. Los alias van en `kunIconAliases`
  (`src/icons/index.ts`, valor `lucide:*`); los componentes usan `"$alias"`
  (nunca el nombre Iconify directo) para que `kunConfig.icons` pueda
  pisarlos. Al agregar/editar alias: `pnpm run generate:icons`. No re-crear
  SFCs `Icon*.vue`.
- **`v-model` acepta `null`** como "vacío" en `KunRadio`/`KunRadioGroup`,
  `KunCheckbox`, `KunFileInput` (su `clearable` emite `null` en modo simple),
  `KunSelect`/`KunAutocomplete`. Tipea `ref<string | null>(null)`.
- **`KunNumberField` es siempre `type="text"`** (el formateo custom es
  incompatible con `number` nativo). Modos: `natural` | `bank`.

---

## Estructura del proyecto

```
kun-ui/
├── src/
│   ├── components/KunX/        # KunX.vue + composables + examples/ + README.md (generado) + NOTES.md (manual)
│   │   ├── src/components/KunX.vue
│   │   ├── src/composables/kunXProps.ts
│   │   ├── examples/Default.vue  # Playground (auto-ruteado a /examples/KunX)
│   │   ├── README.md             # Generado: no editar a mano
│   │   └── NOTES.md              # Opcional: contenido curado que el generador anexa
│   ├── config/                   # kunConfig (global)
│   ├── directives/ icons/ plugins/ styles/ utils/
│   └── index.ts                  # Entry: barrel + GlobalComponents + composables
├── scripts/
│   ├── generate-barrel.ts        # Barrel + GlobalComponents
│   └── generate-docs.ts          # Docs: READMEs + registry.json + llms.txt/full
├── registry.json                 # Índice máquina-legible (generado)
├── llms.txt / llms-full.txt      # Índice breve / referencia completa (generados)
├── .well-known/skills/kun-ui/SKILL.md  # Skill de agente
├── dist/                         # Build (generado)
└── package.json
```

---

## Examples / Playground (contrato obligatorio)

Todo componente debe exponer un playground funcional en
`src/components/KunX/examples/Default.vue` (auto-ruteado a
`/examples/KunX`). Es el harness de verificación visual y funcional;
mantenerlo es parte del cambio, no un extra opcional.

- **Al crear un componente:** scaffoldear `examples/Default.vue` con
  `v-model` operativo, todos los `props` configurables bindeados y
  controles del playground implementados con la propia librería
  (`KunTextField` para `String`, `KunSelect` para uniones literales,
  `KunSwitch` para `Boolean`). Debe permitir ejercer cada variante,
  densidad, estado (`disabled`/`readonly`/`error`) y slot documentado.
- **Al modificar un componente:** auditar su `examples/Default.vue`
  antes de cerrar el cambio:
  1. Cada prop nueva/modificada/eliminada en `*Props.ts` debe tener su
     `ref`/`computed`, su binding (`:nueva-prop`) y su control visible
     en el panel de configuración. Sin bindings huérfanos ni props sin
     control.
  2. Verificar tipos del example (`ref<Tipo>` alineado a la unión
     literal del prop, `null` donde el `v-model` lo admite) e imports
     internos con sufijo `.js`.
  3. Validar con `pnpm run dev` en `/examples/<Nombre>` que el cambio
     es ejercitable visualmente.
- Un example desactualizado (prop sin binding/control o binding a prop
  inexistente) se considera cambio incompleto y bloquea `typecheck`/
  `build` en revisión.

---

## Flujo de trabajo

### Modificar un componente

1. Edita el `.vue` y/o su `*Props.ts` (TSDoc obligatorio por prop).
2. Si el cambio afecta comportamiento no trivial, documenta en su `NOTES.md`.
3. Sincroniza `examples/Default.vue` según el contrato de Examples /
   Playground (nueva prop → `ref` + binding + control).
4. `pnpm run dev` → verifica en `/examples/<Nombre>`.
5. `pnpm run typecheck` (cero) + `pnpm run build`.
6. Si agregaste props/eventos/slots: `pnpm run generate:docs`.

### Agregar un componente

1. Carpeta `src/components/KunNuevo/` con `src/components/KunNuevo.vue`,
   `src/composables/kunNuevoProps.ts` y `examples/Default.vue`.
2. Uniones literales para valores cerrados (ver reglas TS).
3. Implementa `examples/Default.vue` según el contrato de Examples /
   Playground (cobertura total de props/variantes/slots).
4. `pnpm run generate:barrel` (65→66 componentes, `GlobalComponents`).
5. `pnpm run generate:docs` + blurbs ES/EN en `BLURBS` de
   `scripts/generate-docs.ts`.
6. NO documentes el componente aquí: su README se genera solo.

---

## Patrones rápidos

```js
// Validación
const required = v => !!v || 'Este campo es requerido'
// Config global
import { kunConfig } from 'adverich-kun-ui'
kunConfig.configure({ locale: 'es-AR', currency: { value: 'ARS', name: 'Pesos', symbol: '$' } })
// Toast programático
import { useToast } from 'adverich-kun-ui'
const toast = useToast()
toast.add({ title: 'Éxito', color: 'success' })
```
