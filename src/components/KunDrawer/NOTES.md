## Bordes y superficies

- Superficie `bg-default` (antes `bg-elevated`), como el `sidebar` de Nuxt UI.
- `border` pasa a **default `true`** y es **consciente del lado**: `start`/`left`
  → `border-e`, `end`/`right` → `border-s`, `top` → `border-b`, `bottom` →
  `border-t` (todo `border-default`). Con `floating` el contorno es
  `ring ring-default` (panel despegado). Antes un `border border-default`
  completo, invisible en dark sobre `bg-elevated`.
- Se eliminó el `border-none` del modo `floating` (ahora lo resuelve
  `borderClass`).
