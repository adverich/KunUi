## Auto-cierre por `timeout`

El temporizador es **reactivo**, no de montaje. Un `watch` sobre
`[modelValue, timeout, persistent]` (con `immediate`) arma/cancela el `setTimeout`:

- `modelValue` pasa a `true` → se arma el timer con `timeout` ms.
- `modelValue` pasa a `false` (cierre por cruz, self-click, Esc o el propio timer)
  → se cancela.
- `timeout` o `persistent` cambian en vivo → se reinicia/limpia.
- `onBeforeUnmount` → `clearTimeout` (sin emits fantasma).
- `timeout: 0` o `persistent: true` → sin auto-cierre.

Antes el timer se armaba en `onMounted`, es decir **una sola vez** al montar el
componente. Como el componente suele quedar montado y solo se conmuta el
`v-model`, el timer disparaba una vez (a veces con la alerta oculta) y nunca se
re-armaba → el auto-cierre no volvía a funcionar.

## Sin apilado (por diseño)

Cada `KunAlert` teleporta su propio `div` `fixed` (`<Teleport to="body">`) en la
posición elegida (`position` + `margin`). **No hay** manager, grupo, contenedor ni
`useAlert` global: dos alertas visibles en la misma `position` se **superponen**
(la última montada queda encima por orden de DOM). No es una regresión; siempre
fue así. Para notificaciones apilables usar `KunToast` / `useToast`.

## Capa z-index

Se monta en la capa `notification` (`zIndexStyle('notification')`), la misma que
`KunToaster`, por encima de `overlay` (menús/selects/modales) y `docked` (appbar).
