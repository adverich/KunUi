## Íconos: `@iconify/vue` + colección `lucide`

KunUI resuelve los íconos con [`@iconify/vue`](https://iconify.design/docs/icon-components/vue/),
que viene como **dependencia de la librería**: no hay que instalar nada aparte.

Formas aceptadas por la prop `icon`:

- **Nombre Iconify**: `i-mdi-home` (prefijo `i-`) o `mdi:home` (`prefijo:nombre`).
  Para colecciones con guion se usa `:` → `i-simple-icons:github` o `simple-icons:github`.
- **Alias `$nombre`**: mapeado por la librería a un nombre Iconify (`$close`,
  `$menuUpOutline`, `$search`, …). El mapa canónico es `kunIconAliases`.
- **Clase CSS**, **SVG inline**, **componente Vue** o **slot** (como siempre).

### Íconos propios: subconjunto `lucide` offline

Los alias por defecto apuntan a `lucide`. La librería **empaqueta solo los
íconos que usa** (`src/icons/lucide.generated.ts`, generado con
`pnpm run generate:icons`) y los registra al cargar el runtime, así que los
íconos internos **no dependen de la red**.

El resto de nombres Iconify se cargan **on-demand** desde la API de Iconify.

### Carga perezosa y precarga

`@iconify/vue` se importa de forma perezosa (chunk aparte). `install()` lo
**precalienta** (`preloadKunIcons()`) para que los íconos internos aparezcan en
el primer render sin parpadeo. El chunk solo se descarga si se usa un nombre
Iconify; nunca entra al bundle base.

### Sobrescribir íconos (global o por instancia)

Prioridad de resolución de un `$alias`:

1. Prop `aliases` de la instancia (puede ser componente/SVG/clase/nombre).
2. Config global `kunConfig.icons` (mismo nombre de alias → nombre Iconify).
3. Mapa propio `kunIconAliases`.

```ts
import { kunConfig } from 'adverich-kun-ui'
kunConfig.configure({ icons: { close: 'i-mdi-close', menuDownOutline: 'i-mdi-chevron-down' } })
// o puntual:
kunConfig.setIcon('close', 'i-mdi-close')
```

### Colecciones offline del consumidor

Para servir colecciones propias sin red (o SSR), instalá el set y registralo:

```bash
pnpm add @iconify-json/lucide
```

```ts
import { registerKunIcons } from 'adverich-kun-ui'
import lucide from '@iconify-json/lucide/icons.json'
import mdi from '@iconify-json/mdi/icons.json'
await registerKunIcons([lucide, mdi])
```

### Color y tamaño

`KunIcon` no tiene prop `color`: el ícono pinta con `currentColor` y hereda el
color del contexto. La `class` del consumidor va al elemento del ícono, por eso
`text-…` y `size-…` funcionan directo. `size` acepta clase Tailwind
(`size-5`, `text-xl`) o número (`px`).
