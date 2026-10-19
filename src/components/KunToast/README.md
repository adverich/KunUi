# KunToast

> Toast notification (use with useToast).
>
> Notificación toast (usar con useToast).

## Uso · Usage

```vue
<script setup>
import { KunToast } from 'adverich-kun-ui'
</script>

<template>
  <KunToast />
</template>
```

> Con `app.use(KunUI)` el componente queda registrado globalmente y no hace falta importarlo. · With `app.use(KunUI)` the component is globally registered, no import needed.

## Props

### `kunToastProps.ts`

| Propiedad · Prop | Tipo · Type | Defecto · Default | Descripción · Description |
|---|---|---|---|
| `toastId` | `string \| number \| null` | `null` | Id único (lo genera KunToaster si se omite; `useToast().add()` acepta `id` o `toastId`). |
| `title` | `String \| Object \| Function` | `''` | Título (string o VNode). |
| `description` | `String \| Object \| Function` | `''` | Descripción (string o VNode). |
| `avatar` | `String` | `''` | URL de imagen para el avatar (tiene prioridad visual sobre `icon`). Ignorado si el slot `#leading` está presente. |
| `icon` | `string \| Record<string, any> \| Function \| unknown[] \| boolean \| null` | `null` | Ícono principal (null = según `color`). Acepta alias `$`, componente, SVG, clase o `[icono, tamaño]`. |
| `color` | `KunToastColor` | `'primary'` | Variante de color.<br/>Valores · Values: `primary` `success` `error` `warning` `info` `neutral` |
| `orientation` | `KunToastOrientation` | `'vertical'` | Layout: acciones abajo ('vertical') o al costado ('horizontal').<br/>Valores · Values: `vertical` `horizontal` |
| `duration` | `number \| null` | `null` | Duración en ms (0 = sin auto-dismiss; null = duración global del Toaster). |
| `progress` | `Boolean` | `true` | Barra de progreso del timeout. |
| `progressColor` | `string \| null` | `null` | Color de la barra de progreso (null = según `color`). |
| `closable` | `Boolean` | `true` | Botón de cierre. |
| `closeIcon` | `string \| Record<string, any> \| Function \| unknown[] \| boolean \| null` | `null` | Ícono del botón de cierre (null = default). Acepta alias `$`, componente, SVG, clase o `[icono, tamaño]`. |
| `actions` | `ToastAction[]` | `() => [] as ToastAction[]` | Botones de acción `{ label, icon, variant, onClick, closeOnClick }`. |
| `isPaused` | `Boolean` | `false` | Estado interno: pausa el auto-dismiss (gestionado por KunToaster). No pasar manualmente. |
| `isPulsing` | `Boolean` | `false` | Estado interno: aplica `animate-pulse` al aparecer/actualizar (gestionado por useToast). No pasar manualmente. |
| `remainingTime` | `Number` | `0` | Estado interno: ms restantes del auto-dismiss; de aquí se deriva la barra de progreso (gestionado por KunToaster). No pasar manualmente. |
| `ui` | `Record<string, string>` | `() => ({
      root: '',
      wrapper: '',
      title: '',
      descriptio...` | Clases por slot: root, wrapper, title, description, icon, actions, progress, close. |

### `kunToasterProps.ts`

| Propiedad · Prop | Tipo · Type | Defecto · Default | Descripción · Description |
|---|---|---|---|
| `position` | `KunToasterPosition` | `'bottom-right'` | Posición de los toasts en el viewport.<br/>Valores · Values: `top-left` `top-center` `top-right` `bottom-left` `bottom-center` `bottom-right` |
| `duration` | `Number` | `5000` | Duración global por defecto (ms) para toasts creados sin `duration` propio. Reactiva: reconfigura el sistema en caliente. |
| `max` | `Number` | `5` | Máximo de toasts retenidos simultáneamente. Reactiva. |
| `expand` | `Boolean` | `true` | Muestra todos los toasts apilados. Si es `false`, se colapsa al más nuevo y se expande al hacer hover (patrón Nuxt UI). |
| `progress` | `Boolean` | `true` | Valor por defecto de la barra de progreso para toasts creados sin `progress` propio. Reactiva. |
| `portal` | `boolean \| string \| HTMLElement` | `true` | Renderiza los toasts en un portal. `true` = `<body>`, `false` = en su lugar, o un selector/HTMLElement destino. |
| `containerClass` | `String` | `''` | Clase personalizada del contenedor. |

## Eventos · Events

- `close`
- `pause`
- `resume`

## Slots

- `#leading`
- `#title`
- `#description`
- `#actions`
- `#close`

## Notas · Notes

## Flujo programático (patrón Nuxt UI)

```ts
import { useToast } from 'adverich-kun-ui'
const toast = useToast()

toast.add({ title: 'Éxito', description: 'OK', color: 'success' })
toast.add({
  title: 'Archivo eliminado', color: 'warning',
  avatar: 'https://…/me.png',
  actions: [{ label: 'Deshacer', variant: 'ghost', onClick: () => {} }],
  onClick: (t) => console.log('click', t.id),
})
const t = toast.add({ title: 'Cargando…', duration: 0 }) // duration 0 = persistente
toast.update(t.id, { title: '¡Completado!', color: 'success' })
toast.remove(id)
toast.clear()
```

## Estado global (por qué funciona en cualquier parte)

`useToast()` devuelve un **singleton a nivel de módulo** (`getKunToast()`), NO un
`provide/inject` local de `<KunToaster>`. Así el flujo programático funciona en
cualquier componente de la app, sin que `<KunToaster>` sea ancestro.

- Si existe un `provideKunToast(system)` ancestro (uso avanzado/scoped), se usa ese.
- `app.use(KunUI)` también provee el sistema global (`KUN_TOAST_KEY`).
- `<KunToaster>` **consume** el sistema (ya no lo crea ni lo provee): solo renderiza.

## Montar KunToaster (una vez en App.vue)

```vue
<KunToaster position="bottom-right" :duration="5000" :max="5" :expand="true" :progress="true" />
```

## Temporizador, hover y progreso

- Un único reloj en el sistema descuenta `remainingTime` cada 50 ms. La barra de
  progreso de `KunToast` se **deriva** de `remainingTime` (ya no hay un segundo
  timer en el componente) → sin desincronización.
- `@mouseenter`/`@focusin` sobre el **toaster** → `pauseAll()`; `@mouseleave`/`@focusout`
  → `resumeAll()`. Congela el temporizador de **todos** los toasts a la vez (patrón
  Reka/Nuxt), para poder leer cada mensaje. Es a nivel de viewport, no por toast.
- Hover y focus se trackean por separado y solo se reanuda cuando **ambos** cesan.
  Cerrar un toast con la cruz dispara `focusout` (el botón se elimina del DOM): sin
  esta separación se reanudaba aunque el puntero siguiera encima. Además, `mouseleave`
  se re-verifica con `elementFromPoint` en el siguiente frame por si el disparo es
  espurio (toast eliminado bajo el puntero).
- `duration: 0` = persistente (no descuenta y no pausa su barra).

## Props relevantes

- `KunToaster`: `position`, `duration`, `max`, `expand`, `progress`, `portal`
  (`true` = `<body>`, `false` = in situ, o selector/`HTMLElement`), `containerClass`.
  `duration`/`max`/`progress` son **reactivos** (reconfiguran el sistema en caliente).
- `KunToast`: `title`, `description`, `avatar`, `icon`, `color`, `orientation`,
  `duration`, `progress`, `progressColor`, `closable`, `closeIcon`, `actions`,
  `type`, `ui`. Internos (no pasar a mano): `isPaused`, `isPulsing`, `remainingTime`.

## Diferencia con Nuxt UI

Nuxt usa Reka `ToastProvider` y un apilado colapsado por medición de altura.
KunUI no depende de Reka: mantiene la implementación propia. `expand: false`
colapsa al toast **más nuevo** y expande al hover (aproximación sin medición, en
lugar del "peek" apilado de Nuxt).

## Bordes y radio

- El lado de color va en **lógico**: `border-s-4` (antes `border-l-4`), correcto en RTL.
- Botón de cierre `rounded-md`; barra de progreso `rounded-b-[inherit]` (hereda el
  radio del contenedor).
- El chrome de la tarjeta (bg, sombra, radio, borde) **no** es de la librería: lo
  define el consumidor vía `ui.root` (ver `kunToastProps.ts`).

---

_Generado por · Generated by `scripts/generate-docs.ts`. No editar a mano · Do not edit by hand._

Machine-readable: `registry.json` → `KunToast`.
