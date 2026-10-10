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

- **Estilo con clases Tailwind**: `bgColor`, `textColor`, `rounded`,
  `inputTextSize`, etc. Tamaños: `xxs|xs|sm|md|lg|xl|xxl`.
  Densidad: `default|comfortable|compact`.
- **Slots de iconos**: prop `*Icon` → slot sin sufijo
  (`prependIcon` → `#prepend`, `appendInnerIcon` → `#append-inner`).
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

## Flujo de trabajo

### Modificar un componente

1. Edita el `.vue` y/o su `*Props.ts` (TSDoc obligatorio por prop).
2. Si el cambio afecta comportamiento no trivial, documenta en su `NOTES.md`.
3. `pnpm run dev` → verifica en `/examples/<Nombre>`.
4. `pnpm run typecheck` (cero) + `pnpm run build`.
5. Si agregaste props/eventos/slots: `pnpm run generate:docs`.

### Agregar un componente

1. Carpeta `src/components/KunNuevo/` con `src/components/KunNuevo.vue`,
   `src/composables/kunNuevoProps.ts` y `examples/Default.vue`.
2. Uniones literales para valores cerrados (ver reglas TS).
3. `pnpm run generate:barrel` (65→66 componentes, `GlobalComponents`).
4. `pnpm run generate:docs` + blurbs ES/EN en `BLURBS` de
   `scripts/generate-docs.ts`.
5. NO documentes el componente aquí: su README se genera solo.

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
