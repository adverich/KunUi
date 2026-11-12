# Íconos: `@iconify/vue` + colección `lucide` (paridad Nuxt UI)

Estado: implementado (pendiente de publicar al escribir esta nota).

## Objetivo

Alinear el sistema de íconos de KunUI con Nuxt UI (integración Vue):

- Renderizar **cualquier** ícono vía [`@iconify/vue`](https://iconify.design).
- Mantener el **set propio offline** (lo que antes eran SFCs `Icon*.vue`)
  servido desde la colección `lucide`.
- Permitir **override global** estilo `ui.icons` de Nuxt UI.
- Carga **lazy** de Iconify + **precalentado** en `install()`.
- **Sin** set local de SVGs (`src/icons/Icon*.vue` eliminados).

## Modelo

`src/icons/index.ts`:

- `KUN_ICON_COLLECTION = 'lucide'`.
- `kunIconAliases: Record<string, string>` — mapa `alias → 'lucide:nombre'`
  (30 alias → 29 íconos únicos). Antes: `$alias → componente Vue`.
- `icons` — export histórico; hoy es el mismo mapa de alias.

Los componentes **nunca** usan el nombre Iconify directo: pasan `"$alias"`.
Así `kunConfig.icons` puede pisar cualquier ícono interno sin tocar el
componente.

Prioridad de resolución en `KunIcon`:

1. Prop `aliases` de la instancia.
2. `kunConfig.icons` (global).
3. `kunIconAliases`.
4. Nombre Iconify directo (`i-mdi-home`, `mdi:home`, `prefix:name`).

Fallback si nada resuelve: alias `info` + `console.warn` en DEV.

## Empaquetado (decisión)

`@iconify/vue` es **dependencia** de la lib (no peer opcional) y está en
`external` del build.

Motivo: `KunIcon` usa **import dinámico** y el build usa
`preserveModules: true`. Bundlear emite chunks bajo
`dist/node_modules/.pnpm/...`, que npm/pnpm **excluyen del tarball**. Como
external + dependencia, el consumidor lo resuelve desde su `node_modules`
(npm/pnpm/yarn lo instalan) y el import dinámico genera el chunk en su bundle.

Costo en el dist: ~30 bytes (`import("@iconify/vue")`). El runtime de Iconify
(≈13,8 KB gzip) solo se descarga si aparece un nombre Iconify.

## Offline

`scripts/generate-icons.ts` (`pnpm run generate:icons`) lee
`@iconify-json/lucide/icons.json`, filtra por los alias usados y escribe
`src/icons/lucide.generated.ts` (`lucideSubset`).

`src/icons/loader.ts`:

- `ensureKunIcons()` — import perezoso de `@iconify/vue` + `addCollection`,
  una sola vez; devuelve el componente `Icon`.
- `preloadKunIcons()` — invoca a `ensureKunIcons()` sin bloquear (se llama en
  `install()`).
- `registerKunIcons(collections)` — registra colecciones extra (consumidor
  SSR/offline).

Al agregar/editar un alias: **regenerar** con `pnpm run generate:icons`.

## Migración de usos internos

Reemplazos `Icon*.vue` → `$alias` en: `KunAppbar`, `KunFileInput`, `KunSelect`,
`KunTable`, `KunTableFilter`, `KunTableServerSide`, `KunTableHeaders`,
`KunTableRow`, `KunDatePicker`, `KunNumberField`, `KunToast`. Los `*Props.ts`
con defaults `$menuUpOutline` / `$menuDownOutline` / `$radiobox*` siguen
válidos (el mapa los resuelve).

`KunCheckbox`, `KunRadio`, `KunAutocomplete`, `KunTextField` siguen
importando `{ icons }` y pasando `icons.x` a `:icon` — ahora son strings
`lucide:*` que `KunIcon` resuelve. Sin cambios de comportamiento.

## Compatibilidad

Ruptura posible para quien importaba los SFCs `Icon*.vue` o usaba `icons` como
mapa de componentes. Verificado: NeoPosPos y NeoPosEcommerce **no** importan
`icons` ni usan literales `$alias`; el riesgo real es nulo en esos consumidores.

## Verificación

- `pnpm run typecheck` → 0.
- `pnpm run build` → OK; `dist/` sin `dist/node_modules`; `import("@iconify/vue")`
  bare en `dist/icons/loader.js`; `lucide.generated.js` presente.
- Smoke test: los 30 alias existen en el subset y resuelven vía `getIcon()`
  de `@iconify/vue` tras `ensureKunIcons()`.
- Dev server: `/examples/KunIcon` y el módulo del ejemplo compilan (200).
