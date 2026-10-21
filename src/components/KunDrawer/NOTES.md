## Bordes y superficies

- Superficie `bg-default` (antes `bg-elevated`), como el `sidebar` de Nuxt UI.
- `border` pasa a **default `true`** y es **consciente del lado**: `start`/`left`
  → `border-e`, `end`/`right` → `border-s`, `top` → `border-b`, `bottom` →
  `border-t` (todo `border-default`). Con `floating` el contorno es
  `ring ring-default` (panel despegado). Antes un `border border-default`
  completo, invisible en dark sobre `bg-elevated`.
- Se eliminó el `border-none` del modo `floating` (ahora lo resuelve
  `borderClass`).

## Fallthrough de attrs (`inheritAttrs: false`)

- La raíz del template es un `Teleport`; Vue **no** aplica attrs heredados a
  través de Teleport (en dev advierte `Extraneous non-props attributes`, en
  prod la clase se pierde silenciosamente).
- Se reenvía `v-bind="attrs"` manualmente sobre el panel (`<component :is="tag">`),
  como primer binding: `class`/`style` de `$attrs` se fusionan con las internas
  y los bindings explícitos del componente (`@click.stop`, touch handlers,
  `drawerStyle`) ganan ante conflictos.
- Alcanza al panel: `class`, `style`, `id`, `aria-*`, `data-*` y listeners de
  interacción (`@keydown`, etc.).

