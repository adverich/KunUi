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
