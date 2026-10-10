---
name: kun-ui
description: Build UIs with KunUI (adverich-kun-ui), the Vue 3 + Tailwind CSS component library. Use when importing Kun* components, wiring v-model forms with validation, tables, toasts, drag-and-drop or carousels.
---

# KunUI Skill

KunUI (`adverich-kun-ui`, MIT) is a Vue 3 + Tailwind CSS component library:
60+ typed components with IDE autocompletion (`.d.ts` + `GlobalComponents`),
rules-based form validation, data tables, programmatic toasts, drag-and-drop
lists and an Embla-style carousel.

## Doc map (read in this order)

1. `llms.txt` — component map, when-to-use, entry points.
2. `registry.json` — machine-readable props/events/slots per component
   (generated from source; prefer it over guessing).
3. `src/components/<Name>/README.md` — full reference + usage per component.
4. `dist/index.d.ts` (published package) — exact TS types. Closed value sets
   are string-literal unions (`KunBtnVariant`, `KunBtnSize`, …): use the
   union values, never invent new ones.

## Install & setup

```bash
pnpm add adverich-kun-ui
```

```ts
import { createApp } from 'vue'
import KunUI from 'adverich-kun-ui'
import 'adverich-kun-ui/dist/adverich-kun-ui.css'

const app = createApp(App)
app.use(KunUI) // global registration: no imports needed in SFCs
```

Top-level imports also work: `import { KunBtn, KunTextField } from 'adverich-kun-ui'`.
Peer deps: `vue@^3.5`, `tailwindcss@^4`. Package manager is **pnpm**
(never npm/yarn in this repo).

## Conventions (hard rules)

- **Styling via Tailwind classes.** Colors, rounding, sizes are props that take
  Tailwind classes (`bgColor`, `textColor`, `rounded`, `inputTextSize`, …).
  Sizes: `xxs | xs | sm | md | lg | xl | xxl`. Density:
  `default | comfortable | compact`.
- **Icon slots.** A prop named `*Icon` maps to a slot without the suffix:
  `prependIcon` → `#prepend`, `appendInnerIcon` → `#append-inner`.
- **`v-model` nullability.** Selection inputs accept `null` as "empty":
  `KunRadio`/`KunRadioGroup`, `KunCheckbox`, `KunFileInput` (its `clearable`
  emits `null` in single mode), `KunSelect`/`KunAutocomplete`
  (`defineModel<any>({ default: null })`). Type refs accordingly
  (`ref<string | null>(null)`), don't default them to `''`.
- **`KunNumberField` is always `type="text"`** under the hood (custom
  formatting is incompatible with native `number`); keep the declared `type`
  prop untouched. Modes: `natural` (free input) vs `bank` (strict,
  cursor-controlled). Never use `type="number"` with it.
- **Table columns.** `headers: [{ key, value, label, sortable }]`;
  `value` supports paths (`'user.name'`). Stable row identity via `rowKey`
  (default `'id'`, accepts a function). Filters: OR inside one filter,
  AND across filters; M2M array cells use includes-any on `item-value`.
- **Toast flow.** `const toast = useToast()` → `toast.add/update/remove/clear()`.
  Mount `<KunToaster position="bottom-right" />` once in App. For
  loading→success, `add({ duration: 0 })` then `update(id, …)`.
- **Internal imports keep the `.js` suffix** (`'../composables/x.js'` → `x.ts`
  via `moduleResolution: bundler`). Never rewrite to `.ts`. This applies when
  editing the library itself, not when consuming it.

## Component selection

| Need | Use |
|---|---|
| Button / link-button | `KunBtn` (`variant: default \| tonal \| plain \| outlined \| soft \| text`) |
| Text input + validation | `KunTextField` (`:rules="[v => !!v \|\| 'Requerido']"`, `validate()` via ref) |
| Numeric / currency input | `KunNumberField` / `KunCurrency` |
| Single dropdown (no search) | `KunSelect` (readonly field + menu) |
| Searchable dropdown | `KunAutocomplete` (`item-value`, `item-title`, `returnObject`, `multiple`) |
| Radio group | `KunRadioGroup` + `KunRadio` |
| Checkbox (single/array) | `KunCheckbox` (`multiple` + `value` per option) |
| Toggle | `KunSwitch` |
| File(s) | `KunFileInput` (`multiple`, `clearable`, chips) |
| Date / time / range | `KunDatePicker` (`mode`, `range`, `only-icon` + `#icon`) |
| Color | `KunColorPicker` (`original-color`, `allow-transparent`, `color-type`) |
| Data table | `KunTable` (slots `#item.<key>`, `#item.actions`, `#expand`); server-driven → `KunTableServerSide` |
| Modal | `KunDialog` (`persistent`, `x-position`, `y-position`) |
| Toasts | `useToast` + `KunToast`/`KunToaster` |
| Sortable list / kanban | `KunDragAndDrop` (`v-model`, `group`, `drag-handle`); headless → `useKunDragAndDrop` |
| Carousel | `KunCarousel` + `KunCarouselSlide` (Embla-like API: `goToNext/goToPrev/goTo`, `loop`, `autoplay`); inner content → `useKunCarousel()` |
| Tooltip | `KunTooltip` (`location`, `openOn: hover \| click \| focus`) |
| Long lists | `KunVirtualScroller` (`items`, `estimated-item-height`) / `KunInfiniteScroll` |
| Tabs | `KunTabs` + `KunTabWindow` (`#item.<value>`) |
| Form wrapper | `KunForm` (`v-model` validity, `validate/reset/resetValidation`, `@submit`) |

## Recipes

**Validated form:**
```vue
<script setup>
import { ref } from 'vue'
const form = ref()
const valid = ref(false)
const name = ref('')
const required = (v: string) => !!v || 'Requerido'
const submit = () => form.value?.validate() && console.log(name.value)
</script>
<template>
  <KunForm ref="form" v-model="valid" @submit="submit">
    <KunTextField v-model="name" label="Nombre" :rules="[required]" />
    <KunBtn text="Guardar" type="submit" />
  </KunForm>
</template>
```

**Table with actions:**
```vue
<KunTable :items="users" :headers="headers" searchable filterable
  :show-select="true" v-model:selected-items="sel" has-actions>
  <template #item.actions="{ item, loading }">
    <KunBtn icon="mdi-pencil" size="xs" :loading="loading" @click="edit(item)" />
  </template>
</KunTable>
```

**Toast loading → success:**
```ts
const toast = useToast()
const t = toast.add({ title: 'Guardando…', duration: 0 })
await save()
toast.update(t.id, { title: 'Guardado', color: 'success' })
```

## When contributing (library repo)

- `pnpm run typecheck` must stay at zero; `pnpm run build` must pass.
- New component: folder `src/components/KunX/` with
  `src/components/KunX.vue` + `src/composables/kunXProps.ts`, then
  `pnpm run generate:barrel` and `pnpm run generate:docs` (READMEs,
  `registry.json`, `llms.txt`, `llms-full.txt` regenerate — never hand-edit).
- Closed value sets: type as literal unions
  (`type: String as PropType<'a' | 'b'>` + exported type), keep the
  `validator`.
- Every prop gets a leading TSDoc comment (verified against the `.vue`);
  mark reserved-but-unused props as such instead of inventing behavior.
- Bilingual docs: Spanish-first (matches TSDoc), English summaries.
  Prop tables: bilingual headers, Spanish descriptions.
