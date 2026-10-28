# Plan de refactor: Theme global KunUI estilo Nuxt UI

> Solo planificación. No modifica código de `src/`.
> Alcance: tokens globales (color, radio, fuente, easing), dark/light opt-in, alias en runtime a una paleta Tailwind completa para `@pos`, y un contrato único de variantes para que la librería se vea igual en todas las apps.
> Icons: fuera de alcance.

Fecha: 2026-10-15
Revisión: 2026-10-15, alineada contra el repo y contra Nuxt UI v4 (MCP: Design System, CSS Variables, theme de Button; fuente: `src/runtime/index.css` y `src/templates.ts`). El color activo es un alias a una paleta Tailwind completa.
Estado: lineamientos aprobados, con correcciones de esta revisión. Ruptura total. Sin aliases legacy.

> **Actualización 2026-10-21 — `text-inverted` solo manual.** Se revierte el
> uso automático: los `solid` de color usan `text-highlighted` (`neutral-900` en
> light, blanco en dark); `neutral.solid` usa `text-white dark:text-neutral-900`.
> Ningún componente aplica `text-inverted`: el token queda exclusivamente para
> que el consumidor lo pase manualmente. La nota del 2026-10-18 queda como
> historial.
>
> **Actualización 2026-10-18 — paridad estricta de botones.** La decisión §0.5
> (`--kun-on-{color}` calculado por luminancia) quedó **eliminada**. Los botones
> sólidos usan `text-inverted` (blanco en light, `neutral-950` en dark), igual que
> Nuxt UI v3. Se removieron `--kun-on-*`, `--text-color-on-*` y las clases
> `text-on-*`; los usos internos migraron a `text-inverted`. Consecuencia asumida:
> un HEX de marca arbitrario (`setPrimary('#fde047')`) no ajusta el texto por
> contraste (mismo límite que Nuxt). `contrastOnWhite` se conserva como helper.
> Las secciones §0.5, §2/§3.4 y §7 que describen `--kun-on-*` se leen como
> historial, no como estado vigente.
>
> **Actualización 2026-10-18 — escala z-index única (patrón Nuxt/Reka).** Se
> estandarizaron todos los z-index en tokens `--kun-z-*`
> (`src/styles/theme.css`) con helper TS `src/theme/kunZIndex.ts`. Capas:
> `docked 1000 · overlay 2000 · notification 2100 · loader 2200`. **Todo overlay
> flotante se teletransporta a `<body>`** (alert, drawer, dialog, menu/select,
> autocomplete, tooltip, popover, date-picker, color-picker, modal-footer,
> toaster, loader) y los overlays interactivos comparten la capa `overlay`; su
> anidamiento (un menú dentro de un modal, un modal abierto desde un menú) se
> resuelve por **orden de montaje en el DOM**, no por un número por componente.
> Una escalera numérica fija no puede resolver overlays anidados (un dropdown
> dentro de un modal quedaría detrás si `dropdown < modal`). La capa
> `notification` (alert + toast) queda **por encima de todo overlay** para que
> un menú/select nunca tape una alerta; alert y toast empatan y se ordenan por
> montaje. Se eliminaron las props públicas `zIndex` de
> KunMenu/KunSelect/KunAutocomplete/KunAlert/KunToast/KunAppbar.
>
> **Referencia Nuxt UI (verificado):** Nuxt UI **no** define una escalera de
> z-index por componente; solo usa `z-50` en `Header`/`Banner` (docked) y
> `z-[100]` en el viewport del `Toaster`, y deja modal/slideover/popover/
> tooltip/dropdown **sin z-index** (se apoyan en portal a `<body>` + orden de
> montaje). Igual que Reka UI. KunUI agrega la capa intermedia `overlay` porque
> su appbar (`docked`) debe quedar **debajo** de los overlays, a diferencia del
> header de Nuxt (que con `z-50` sobre overlays `auto` queda por encima).

---

## 0. Decisiones cerradas

| # | Decisión | Valor |
|---|----------|-------|
| 1 | Compatibilidad | Ruptura total. Sin aliases de las clases viejas (`bg-button`, `text-ui`, `bg-surface`, …). |
| 2 | Variables | Namespace `--kun-*`. No usar `--ui-*`: colisiona si la app también monta Nuxt UI. |
| 3 | Utilidades | Nombres de Nuxt, sin prefijo: `bg-primary`, `text-default`, `bg-elevated`, `border-muted`. El prefijo vive solo en la variable. Ver §2. |
| 4 | Color | Igual que Nuxt: el semántico es un alias a una paleta Tailwind ya completa (`50–950`). `setPrimary('sky')` no calcula stops. Un HEX no tiñe nada hasta `registerPalette`, que publica los 11 stops de una vez o no escribe. |
| 5 | Texto sobre color | `--kun-on-{color}` se elige al fijar el color (blanco o `neutral-950`) por luminancia WCAG. No se recalcula en cada componente. |
| 6 | Radio | `--kun-radius: 0.25rem`. Con los multiplicadores de Nuxt, `rounded-lg` sigue en `0.5rem` (el default actual de `KunBtn`). |
| 7 | Dark | Opt-in light-only. Sin `configure`, la app queda en light y no registra listeners. |
| 8 | Variantes | Un solo par `KunColor` × `KunVariant`, clases literales. No se agrega `tailwind-variants` ni slots de `app.config` en esta entrega. |
| 9 | Config | `kunTheme` separado. `kunConfig` / `useKunConfig` siguen en locale, currency y date. |
| 10 | Icons | No se tocan. |
| 11 | Identidad | El CTA default pasa de violeta (`--button: #9a6ed8`) a la paleta Tailwind `sky`. `#20A0E0` deja de ser el default: no es `--color-sky-500`. `neutral` = `slate`. `--button` desaparece. |

---

## 1. Diagnóstico

### 1.1 Archivos evaluados

- `src/styles/colors.css` (~52 variables, 3 niveles mezclados)
- `src/styles/clases.css` (utilidades a mano; incluye `.bg-accent-button-icon` apuntando a una variable que no existe)
- `src/styles/style.css` (entry: `@import "tailwindcss"`, `@custom-variant dark`, body, ripple, autofill)
- `src/config/kunConfig.ts` (solo locale / precision / currency / date)
- `src/index.ts` (`install` provee `kunConfig`, importa `style.css`)
- `src/components/KunBtn` (`bgColor: 'bg-button'`, `variant` propia, `rounded: 'rounded-lg'`)
- `package.json`: el consumidor importa `adverich-kun-ui/dist/adverich-kun-ui.css`. No recompila el `@theme` de la librería.
- `base-styles.css` existe pero está vacío (0 líneas, muerto; se borra en Fase A).

### 1.2 Qué impide un theme sólido

1. No hay `@theme`. `clases.css` duplica a mano lo que Tailwind v4 debería emitir (`bg-primary`, `text-error`, `hover:bg-ui-hover`).
2. `colors.css` mezcla primitivo (`--primary`), layout (`--appbar`, `--drawer`, `--card`) y componente (`--button`, `--field-*`, `--select-background`).
3. Un HEX por rol, sin escala. Light y dark no son shades del mismo matiz (`--error: #D56C5D` vs `#9D2817`).
4. Faltan `info`, texto sobre el color, y los roles de Nuxt (`muted`, `elevated`, `accented`, `dimmed`, `toned`, `highlighted`).
5. `bgColor` / `textColor` / `rounded` son `String` libre. Una clase `` `bg-${x}` `` no existe para el scanner de Tailwind.
6. Nada resuelve color, radio, fuente o modo desde un theme global.
7. Dark tiene el selector correcto (`:root.dark, :root[data-theme="dark"]` + `@custom-variant dark`) pero no tiene `color-scheme`, persistencia ni anti-FOUC. El default no es light-only explícito.
8. Ejemplos y alguna pantalla usan paleta Tailwind directa (`bg-slate-50`, `bg-red-500`) y se salen del theme.
9. El CSS publicado ya viene compilado. Borrar `clases.css` y confiar en que “el `@theme` del consumidor lo genere” rompe el contrato actual de `import '…/adverich-kun-ui.css'`.

### 1.3 Cómo lo hace Nuxt UI v4

Verificado en la documentación y en el generador de `ui.css` (`src/templates.ts`):

- Paleta completa `50–950` en el theme. El runtime elige un **nombre** (`primary: 'blue'`), no un HEX.
- Variables de marca: light `--ui-primary: var(--ui-color-primary-500)`, dark `--ui-primary: var(--ui-color-primary-400)`. Igual para secondary, success, info, warning, error. Neutral alimenta texto, fondo y borde.
- Esas variables no son las utilidades. El puente es `@theme default inline`:

```css
--color-primary: var(--ui-primary);
--color-primary-500: var(--ui-color-primary-500);
--text-color-default: var(--ui-text);
--text-color-muted: var(--ui-text-muted);
--background-color-default: var(--ui-bg);
--background-color-muted: var(--ui-bg-muted);
--background-color-elevated: var(--ui-bg-elevated);
--border-color-default: var(--ui-border);
--radius-lg: calc(var(--ui-radius) * 2);
```

  `inline` hace que la utilidad guarde `var(...)`. Sin eso, Tailwind hornea el color y un cambio en runtime no repinta. `default` deja que la app lo pise después.
- `text-muted` y `bg-muted` no comparten token. Texto usa `--text-color-*`; fondo usa `--background-color-*`; borde usa `--border-color-*`. Si ambos salieran de `--color-muted`, serían el mismo color.
- Radio base en el CSS publicado: `--ui-radius: 0.25rem`. Multiplicadores `0.5, 1, 1.5, 2, 3, 4, 6` para `xs…3xl`.
- Body: `antialiased text-default bg-default scheme-light dark:scheme-dark`.
- La estética de un botón no es “fondo primary”. Es una matriz `color × variant` con alpha: `bg-primary hover:bg-primary/75`, `bg-primary/10`, `outline-primary/25`, `focus-visible:outline-3`. Variantes: `solid | outline | soft | subtle | ghost | link`.
- Foco: `outline-{color}/25`, no un `box-shadow` por componente.
- Movimiento: `--ease-out` retemporiza las transiciones de la librería. `prefers-reduced-motion` anula desplazamientos.

KunUI usa el mismo mecanismo. `@import "tailwindcss"` en `src/styles/style.css` deja `--color-sky-50` … `--color-sky-950` (y el resto de la paleta default) en el CSS compilado. El semántico apunta ahí. Un HEX de marca no es un alias: solo entra si antes se registró como paleta completa (§4).

---

## 2. Naming

Dos capas, a propósito distintas.

### 2.1 Variables `--kun-*`

Equivalencia 1:1 con `--ui-*`. Sirven para no chocar con Nuxt en las custom properties.

| Nuxt UI | KunUI |
|---|---|
| `--ui-primary` (y secondary, success, info, warning, error) | `--kun-primary` … |
| `--ui-color-{c}-{50..950}` | `--kun-color-{c}-{50..950}` |
| `--ui-bg` / `-muted` / `-elevated` / `-accented` / `-inverted` | `--kun-bg` … |
| `--ui-text` / `-dimmed` / `-muted` / `-toned` / `-highlighted` / `-inverted` | `--kun-text` … |
| `--ui-border` / `-muted` / `-accented` / `-inverted` | `--kun-border` … |
| `--ui-radius` | `--kun-radius` |
| `--ui-container` | `--kun-container` |

Extra de KunUI: `--kun-on-{color}` (texto sobre ese semántico) y, solo tras un registro válido, `--kun-palette-{name}-{50..950}` para una paleta que no está en Tailwind.

Convivir con Nuxt UI igual choca en las utilidades (`bg-primary` sale de `--color-primary` en las dos). El prefijo `--kun-*` solo salva las variables. Documentarlo en el README del theme.

### 2.2 Utilidades (nombre Nuxt, sin prefijo)

`@theme default inline` traduce la variable a la utilidad. Copiar los namespaces de Nuxt, cambiando `--ui-` por `--kun-`:

| Variable | Theme | Clases |
|---|---|---|
| `--kun-primary` | `--color-primary` | `bg-primary`, `text-primary`, `border-primary`, `ring-primary`, `outline-primary`, y sus `/10` `/75` |
| `--kun-color-primary-50` … `950` | `--color-primary-50` … | no las usan los componentes; `theme.css` emite las 22 paletas vía `@source inline` para el cambio de paleta en runtime (`setPrimary`) |
| `--kun-text` | `--text-color-default` | `text-default` |
| `--kun-text-dimmed` / `-muted` / `-toned` / `-highlighted` / `-inverted` | `--text-color-dimmed` … | `text-dimmed`, `text-muted`, `text-toned`, `text-highlighted`, `text-inverted` |
| `--kun-bg` | `--background-color-default` | `bg-default` |
| `--kun-bg-muted` / `-elevated` / `-accented` / `-inverted` | `--background-color-*` | `bg-muted`, `bg-elevated`, `bg-accented`, `bg-inverted` |
| `--kun-border` y variantes | `--border-color-*` | `border-default`, `border-muted`, `border-accented`, `border-inverted` |
| `--kun-on-primary` (y el resto de semánticos) | `--text-color-on-primary` | `text-on-primary` |
| `--kun-radius` | `--radius-xs` … `--radius-3xl` | `rounded-xs` … `rounded-3xl` |
| `--kun-font-sans` / `--kun-font-mono` | `--font-sans` / `--font-mono` | `font-sans`, `font-mono` |
| `--kun-ease-out` | `--ease-out` | `ease-out` |
| `--kun-overlay` | `--background-color-overlay` | `bg-overlay` |

También, como Nuxt, los aliases de anillo y división que los componentes de formulario van a usar: `--ring-color-default|muted|accented|inverted`, `--outline-color-default|inverted`, `--divide-color-default`. Salen de las mismas variables de borde y fondo, no de HEX nuevos.

Prohibido inventar `bg-kun-primary` o `text-kun`. Prohibido `` `bg-${color}` ``.

---

## 3. Semántica

### 3.1 Tres capas

```
Capa 1  --kun-color-{color}-{50,100,200,300,400,500,600,700,800,900,950}
Capa 2  --kun-{primary,secondary,success,info,warning,error}
        light = stop 500, dark = stop 400
Capa 3  --kun-bg-*, --kun-text-*, --kun-border-*, --kun-on-*
```

Los componentes consumen capa 2 (marca y estado) o capa 3 (neutros). La capa 1 es un alias a `--color-{paleta}-{stop}` (o a `--kun-palette-{name}-{stop}` si esa paleta se registró). Ningún `.vue` lleva HEX.

### 3.2 Semánticos

| Token | Light | Dark | Uso |
|---|---|---|---|
| `--kun-primary` | stop 500 | stop 400 | CTAs, activo, brand, links |
| `--kun-secondary` | 500 | 400 | Acciones secundarias |
| `--kun-success` | 500 | 400 | Éxito |
| `--kun-info` | 500 | 400 | Info, ayuda |
| `--kun-warning` | 500 | 400 | Aviso |
| `--kun-error` | 500 | 400 | Error, destructivo |

Defaults por nombre de paleta Tailwind. No se anclan a los HEX sueltos de `colors.css`.

- `primary` = `sky`. Los botones dejan el violeta `#9a6ed8`. `#20A0E0` no se conserva.
- `secondary` = `blue`, `success` = `green`, `info` = `blue`, `warning` = `yellow`, `error` = `red`. Son los defaults de Nuxt, salvo `primary`.
- `neutral` = `slate`. Gobierna texto, fondo y borde (§3.3). El gris lavanda de `--background` / `--surface` no se expande a escala.

### 3.3 Roles neutros

Misma matriz que Nuxt (`src/runtime/index.css`).

| Token | Light | Dark |
|---|---|---|
| `--kun-bg` | `white` | `neutral-900` |
| `--kun-bg-muted` | `neutral-50` | `neutral-800` |
| `--kun-bg-elevated` | `neutral-100` | `neutral-800` |
| `--kun-bg-accented` | `neutral-200` | `neutral-700` |
| `--kun-bg-inverted` | `neutral-900` | `white` |
| `--kun-text-dimmed` | `neutral-400` | `neutral-500` |
| `--kun-text-muted` | `neutral-500` | `neutral-400` |
| `--kun-text-toned` | `neutral-600` | `neutral-300` |
| `--kun-text` | `neutral-700` | `neutral-200` |
| `--kun-text-highlighted` | `neutral-900` | `white` |
| `--kun-text-inverted` | `white` | `neutral-900` |
| `--kun-border` | `neutral-300` | `neutral-600` |
| `--kun-border-muted` | `neutral-200` | `neutral-700` |
| `--kun-border-accented` | `neutral-300` | `neutral-500` |
| `--kun-border-inverted` | `neutral-900` | `white` |

> Corregido 2026-10-17: con `campo = bg-muted + border-default` (ver §"Pasan a capa 2/3"),
> el dark previo (`border` = `neutral-800`) coincidía con `bg-muted`/`bg-elevated`
> (también `neutral-800`) y el borde del campo desaparecía. Igual en light, `border`
> (`neutral-200`) se fundía con `bg-accented` (`neutral-200`). El borde por defecto
> ahora es siempre más visible que `muted` y nunca igual a una superficie (`bg-muted`,
> `bg-elevated`, `bg-accented`). Nuxt no sufre esto porque sus campos usan `bg-default`.

Esos roles no apuntan a `--color-slate-*` directo. Apuntan a la capa 1 de neutral, que es la que cambia:

```css
--kun-color-neutral-50: var(--color-slate-50);
--kun-bg-muted: var(--kun-color-neutral-50);
--kun-text: var(--kun-color-neutral-700);
--kun-border: var(--kun-color-neutral-300);
```

`setNeutral('zinc')` solo reescribe `--kun-color-neutral-50` … `950` a `var(--color-zinc-*)`. Los roles se repintan solos. Si un rol quedara en `var(--color-slate-50)`, cambiar de neutral no movería fondos, textos ni bordes.

Excepción documentada: `--kun-overlay` (scrim de dialog/drawer). No es un componente, no entra en la escala y no sigue a `setNeutral`. Light `rgba(9, 13, 28, .5)`, dark `rgba(0, 0, 0, .6)`, utilidad `bg-overlay`.

### 3.4 Texto sobre el color

`--kun-on-{color}` es blanco si el contraste del stop contra blanco es al menos 4.5; si no, `neutral-950`. Light usa el stop 500 y dark el 400. El componente solo usa `text-on-primary` (o el `on-*` de su color). No se recalcula en cada render.

El valor compilado corresponde al default (`sky` para primary). No alcanza con dejarlo fijo: `sky-500` no llega a 4.5 contra blanco, así que el default es texto oscuro, y ese texto heredado en `setPrimary('green')` o `setPrimary('yellow')` puede quedar ilegible. Cada `setPrimary` / `setColor` exitoso reescribe `--kun-on-{color}` para los dos modos. En el catálogo Tailwind alcanza una tabla fija por nombre y por modo. En una paleta registrada, se usa el cálculo de §4.2.

Un amarillo muy claro puede no llegar a AA ni con texto oscuro. El playground Theme muestra el ratio; v1 no rechaza el registro si los 11 stops son válidos.

### 3.5 Qué se elimina

Variables sueltas: `--appbar`, `--appbar-darken`, `--toolbar`, `--toolbar-dark`, `--footer`, `--drawer`, `--drawer-dark`, `--card`, `--menu`, `--button`, `--button-hover`, `--button-disabled`, `--accent-button`, `--icon`, `--accent-icon`, `--select-background`, `--select-hover`, `--textarea-outline-focus`, `--field-*`, y los `--on-color*` / `--surface*` / `--error-soft` actuales.

Pasan a capa 2/3. Appbar, drawer, card y menu = `bg-elevated` + `border-default`. Campo = `bg-muted` + `border-default`, foco `outline-primary/25`. Botón = matriz de §6, no una variable `--button`.

`clases.css` se borra entero. Las grillas `bg-neopos-*` y `bg-shell-grid*` no tienen usos en `src/`: se caen con el archivo, no se mudan.

---

## 4. Runtime: alias a una paleta completa

Lo que pinta la UI es un nombre, no un HEX. `setPrimary('sky')`, `setColor('success', 'green')`, `setNeutral('slate')` o `configure({ primary: 'sky', neutral: 'slate' })`.

### 4.1 Alias

En `theme.css`, antes de cualquier JS:

```css
--kun-color-primary-50: var(--color-sky-50);
--kun-color-primary-950: var(--color-sky-950);
--kun-primary: var(--kun-color-primary-500);
```

La misma cadena para `secondary` (`blue`), `success` (`green`), `info` (`blue`), `warning` (`yellow`) y `error` (`red`). Neutral apunta a `slate` solo en la capa 1 (`--kun-color-neutral-*: var(--color-slate-*)`). Los roles de §3.3 cuelgan de esa capa (`--kun-bg-muted: var(--kun-color-neutral-50)`), nunca de `--color-slate-*` directo. `setNeutral` reescribe únicamente `--kun-color-neutral-*`.

En dark solo cambia el semántico: `--kun-primary: var(--kun-color-primary-400)`. Los stops no se regeneran.

`setPrimary('blue')` reescribe los 11 alias `--kun-color-primary-*` a `var(--color-blue-*)`. Cero matemática de color. El primer chequeo del build es que `dist/adverich-kun-ui.css` contenga `--color-sky-500`: sin esa variable el alias no resuelve.

Catálogo cerrado, los nombres de Tailwind con escala `50–950`: `red`, `orange`, `amber`, `yellow`, `lime`, `green`, `emerald`, `teal`, `cyan`, `sky`, `blue`, `indigo`, `violet`, `purple`, `fuchsia`, `pink`, `rose`, `slate`, `gray`, `zinc`, `neutral`, `stone`. `black` y `white` no entran, igual que en Nuxt.

`neutral` solo acepta `slate`, `gray`, `zinc`, `neutral`, `stone`.

Si el nombre no está en el catálogo ni fue registrado, no se escribe ninguna variable. Sigue el alias anterior o, si nunca hubo uno, el compilado en `theme.css`.

Además, antes de aliasar un nombre del catálogo se verifica presencia real
(`--color-{nombre}-500` en el CSS efectivo): si falta, `set*` devuelve `false`
sin escribir. `theme.css` emite el catálogo completo (22 paletas × 11 paradas,
vía `@source inline`, §8), así que en la práctica todos los nombres están
presentes; el chequeo protege contra un CSS recortado a mano.
En SSR (sin documento) la verificación es optimista.

### 4.2 HEX: registro atómico, no fallback

Un HEX no es una paleta de Tailwind y no se aliasa. `registerPalette('brand', hex)` es el equivalente a declarar los 11 shades en `@theme` antes de poder usar el nombre.

1. Parsear el HEX a oklch en JS. La conversión es matemática; no depende de que el navegador implemente `oklch()`.
2. Generar los 11 stops con una curva de L estrictamente decreciente con el índice, sin tocar el 500 (en marcas casi-blancas los claros colapsan al HEX exacto: nada es más claro que el brand). El stop 500 es el color de la marca. El matiz no se rota. El croma se atenúa hacia los stops claros para no producir pasteles neón.
3. Al volver a sRGB, bajar el croma hasta que cada stop entre en gamut. Un clip directo de RGB desplaza el matiz; no se usa.
4. Solo entonces escribir `--kun-palette-brand-50` … `950` y recalcular `--kun-on-{color}-light` (stop 500) y `--kun-on-{color}-dark` (stop 400) (§3.4). El split light/dark es necesario: una sola var inline pisaría el switch de modo.
5. Después, y solo después, `setPrimary('brand')` aliasa `--kun-color-primary-*` a `var(--kun-palette-brand-*)`, igual que con `sky`.

Si el HEX no parsea, `registerPalette` devuelve `false` y no hay `setProperty`. `color-mix` no rescata ese string: también necesita un color válido. Una paleta `{50..950}` usa la misma regla: si falta un stop o uno no parsea, no se publica el nombre.

`registerPalette('sky', hex)` también devuelve `false`. Un nombre del catálogo Tailwind no se pisa: `sky` sigue siendo `var(--color-sky-*)`.

`setPrimary('#3B82F6')` es azúcar de las dos llamadas con nombre `custom-primary`
(`custom-{slot}` por slot, para no pisarse entre sí). Si el registro falla, el alias no corre. Nunca queda un stop nuevo al lado de stops viejos.

`@pos`: si el negocio elige un nombre, `setPrimary('blue')`. Si trae un HEX, `registerPalette('brand', hex)` y, solo si respondió `true`, `setPrimary('brand')`. Si el valor es basura, la UI sigue en `sky`.

Costo de un alias: 11 escrituras de `var()`, sin listeners ni `MutationObserver`. Objetivo: menos de 16 ms. La pintura la hace el navegador porque las utilidades quedaron en `var()`.

### 4.3 Persistencia y FOUC

Claves `kun:theme:primary`, `kun:theme:neutral`, `kun:theme:radius`, `kun:theme:font`, `kun:theme:colorMode`, `kun:theme:defaults`. Para un nombre del catálogo (`sky`, `blue`) se guarda solo el nombre: `--color-sky-*` ya está en el CSS y el alias se repone al arrancar.

Para una paleta custom el nombre no alcanza. Se guarda `nombre:HEX` (o `nombre:stop1,…,stop11` si se registró por set completo) junto al nombre. Al arrancar, `registerPalette` y después el alias. El snippet anti-FOUC hace las dos cosas antes del primer paint. La librería no inyecta ese script sola.

Nota: `install` siempre ejecuta `restore()`. Apps distintas bajo el mismo origen comparten `localStorage`: una preferencia guardada por una app se repone en la otra. Es el comportamiento documentado de la persistencia, no un default.

---

## 5. Radio, fuente, movimiento

### 5.1 Radio

```css
:root { --kun-radius: 0.25rem; }
```

Dentro de `@theme default inline`:

```css
--radius-xs: calc(var(--kun-radius) * 0.5);
--radius-sm: var(--kun-radius);
--radius-md: calc(var(--kun-radius) * 1.5);
--radius-lg: calc(var(--kun-radius) * 2);
--radius-xl: calc(var(--kun-radius) * 3);
--radius-2xl: calc(var(--kun-radius) * 4);
--radius-3xl: calc(var(--kun-radius) * 6);
```

Con la base en `0.25rem`, `rounded-lg` = `0.5rem`, igual que el botón de hoy. Una base de `0.5rem` lo llevaría a `1rem`. `0.5rem` y `0.75rem` quedan como presets del playground, no como default.

Los componentes usan `rounded-md` / `rounded-lg` / … sin un valor propio. Excepción: `KunBtn` y los contenedores circulares (avatar, icon button) aceptan `rounded` cerrado `'full' | 'none' | undefined`. `undefined` hereda la escala.

Cambiar `--kun-radius` también afecta el `rounded-*` del markup de la app y de terceros, igual que en Nuxt. El CSS compilado tiene que seguir mostrando `var(--kun-radius)`, no un rem horneado.

### 5.2 Fuente

`--kun-font-sans` y `--kun-font-mono` con stack de sistema. Cero fuentes descargadas. `@theme default inline` las publica como `--font-sans` / `--font-mono`, así `setFont({ sans, mono })` repinta. Los componentes no fijan `font-family`. `fontWeight` y `textSize` siguen como están. La escala `--text-*` no entra en esta entrega.

### 5.3 Movimiento

`--ease-out: cubic-bezier(0.16, 1, 0.3, 1)` (el de Nuxt) en el theme, para que overlays y fades compartan una curva. Transición de theme, si se quiere: solo `background-color`, `color` y `border-color` a 120 ms en `body`, apagada con `prefers-reduced-motion`. Prohibido `* { transition }`.

---

## 6. Variantes (la estética compartida)

Un mapa en `src/theme/kunVariants.ts`. Es la única fuente de clases de color. `KunBtn` lo usa primero; Alert, Badge, Chip y los fields lo reutilizan.

```ts
type KunColor = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral'
type KunVariant = 'solid' | 'outline' | 'soft' | 'subtle' | 'ghost' | 'link'
```

Cada par es un string literal de clases, al estilo del theme de `UButton`:

- `solid`: `text-on-{color} bg-{color} hover:bg-{color}/75 active:bg-{color}/75 outline-{color}/25 focus-visible:outline-3`
- `outline`: anillo `ring-{color}/50`, texto `text-{color}`, hover `bg-{color}/10`
- `soft`: `text-{color} bg-{color}/10 hover:bg-{color}/15`
- `subtle`: soft + `ring-{color}/25`
- `ghost`: texto del color, hover `bg-{color}/10`, sin fondo en disabled
- `link`: solo texto, hover `text-{color}/75`
- `neutral` no usa `bg-neutral`: solid = `bg-inverted text-white dark:text-neutral-900`; el resto usa `bg-elevated`, `text-default`, `ring-accented`.
- Ningún `solid` aplica `text-inverted`; ese token es solo para uso manual del consumidor.

`disabled` es opacidad (`disabled:opacity-75`), no un HEX `--button-disabled`.

Ruptura de `KunBtn` (hoy `default | tonal | plain | outlined | soft | text`):

| Actual | Nuevo |
|---|---|
| `default` | `solid` |
| `outlined` | `outline` |
| `soft` | `soft` |
| `tonal` | `subtle` |
| `text`, `plain` | `ghost` |

Defaults globales en `kunTheme.configure({ defaults: { button: { color, variant, size } } })`. No hay override de slots por componente en esta entrega.

Foco de controles: `outline-{color}/25` y `focus-visible:outline-3`. Sin `shadow-ui-focus`.

---

## 7. Dark / light

Default: light. `color-scheme: light`. Cero listeners.

Activación: `setColorMode('light' | 'dark' | 'system')` o `configure({ colorMode })`. `system` usa `matchMedia('(prefers-color-scheme: dark)')`, guarda la preferencia y se desuscribe en `reset`.

Selectores, los que ya están en `style.css`. No usar un descendiente `:root[data-theme="dark"] .dark`.

```css
:root.dark,
:root[data-theme="dark"] { /* swaps de capa 2 y 3 */ }
```

```css
@custom-variant dark (&:where(.dark, .dark *, [data-theme="dark"], [data-theme="dark"] *));
```

Body, como Nuxt: `scheme-light dark:scheme-dark`, para scrollbars y controles nativos.

Una app que no llama a `kunTheme` queda en light.

---

## 8. Cómo se publica el CSS

Contrato principal (vía fuente, como Nuxt UI): la app importa
`@import "adverich-kun-ui/theme.css"` en su propio CSS compilado con Tailwind
v4. El build de la app tiene la paleta default completa y emite los stops que
los alias referencien: todo el catálogo funciona. Las apps `@pos` ya compilan
Tailwind v4 propio, así que migran cambiando una línea de import.

Contrato legacy (quick-start standalone): `import 'adverich-kun-ui/dist/adverich-kun-ui.css'`.
Ya viene compilado con el catálogo completo (22 paletas) más customs vía
`registerPalette` (valores concretos, siempre resuelven). Cualquier nombre del
catálogo funciona; uno desconocido devuelve `false` en `set*` (ver §4.1).

Por eso:

1. `src/styles/theme.css` es el fuente (`@theme default inline`, `:root`, dark, body no va aquí).
2. `style.css` importa `theme.css`, deja ripple y autofill, y pone el `body`: `antialiased font-sans text-default bg-default scheme-light dark:scheme-dark`.
3. El build de la librería emite en el dist las utilidades que los `.vue` usan como strings literales. Eso mantiene vivo el import legacy.
4. El fuente (`adverich-kun-ui/theme.css`) es la vía principal para apps con Tailwind v4 (autocomplete y tree-shaking propios, catálogo completo).
5. `theme.css` emite una safelist acotada vía `@source inline` con las 22 paletas × 11 paradas (`bg-{...}-{...}`); sin ella Tailwind v4 tree-shakea `--color-*` y `setPrimary`/`setNeutral` no podrían aliasar un nombre no referenciado (decisión 2026-10-17, ver §8). No se safelistean opacidades (`/10`, `/75`): usan `color-mix` sobre `--color-primary` y no necesitan stops extra.

`/10` y `/75` funcionan en runtime solo si la utilidad compilada usa `color-mix` sobre `var(--color-primary)` (lo que hace Tailwind v4 con `@theme inline`). Verificarlo en el CSS emitido de `KunBtn` antes de migrar el resto.

---

## 9. Mapa de ruptura de clases

Sin alias en runtime. Guía para la migración y para `@pos`.

| Clase actual | Pasa a |
|---|---|
| `bg-background` | `bg-default` |
| `bg-appbar`, `bg-toolbar`, `bg-footer`, `bg-drawer`, `bg-card`, `bg-menu`, `bg-surface-dark`, `bg-ui-surface-raised` | `bg-elevated` |
| `bg-appbar-darken`, `bg-toolbar-dark` | `bg-accented` |
| `bg-surface`, `bg-surface-light`, `bg-ui-surface`, `bg-ui-surface-subtle`, `bg-field-background`, `bg-select-background` | `bg-muted` |
| `bg-ui-hover`, `hover:bg-ui-hover`, `hover:bg-select-hover`, `bg-ui-selection` | `bg-accented` / `hover:bg-accented` |
| `bg-ui-overlay` | `bg-overlay` |
| `bg-primary`, `bg-ui-primary` | `bg-primary` |
| `bg-button`, `hover:bg-button-hover` | variante `solid` (`bg-primary` + `hover:bg-primary/75`) |
| `bg-accent-button`, `bg-accent-button-icon`, `bg-button-disabled` | se eliminan |
| `bg-error`, `bg-ui-error`, `bg-ui-error-soft` | `bg-error`, `bg-error/10` |
| `text-ui` | `text-default` |
| `text-ui-muted`, `placeholder-ui` | `text-muted` |
| `text-ui-disabled` | `text-dimmed` |
| `text-ui-inverse` | `text-inverted` |
| `text-ui-selection` | `text-highlighted` |
| `border-ui` | `border-default` |
| `border-ui-subtle`, `border-surface` | `border-muted` |
| `field-border-focus`, `ring-ui-focus`, `shadow-ui-focus`, `textarea-outline-focus` | `focus-visible:outline-primary/25` |
| `bg-neopos-*`, `bg-shell-grid*` | se eliminan (sin usos) |

---

## 10. Performance

1. Cero JS por render. `kunTheme` solo escribe variables en `configure` / `set*`.
2. El camino estándar no calcula color: reescribe alias `var(--color-sky-*)`. La matemática oklch corre solo dentro de `registerPalette`, y un HEX ilegible no escribe stops.
3. Sin `* { transition }`.
4. Medir `dist/adverich-kun-ui.css` antes y después, y el tiempo de `setPrimary` (`performance.now`, objetivo < 16 ms).

---

## 11. Fases

### Fase A — CSS

> Implementada 2026-10-15. Puerta superada: el dist contiene `--color-sky-500` (Tailwind siguió la cadena `var()` y emitió los stops en oklch), `var(--kun-primary)` ×16 / `var(--kun-radius)` ×16 sin HEX horneado, `.rounded-lg{border-radius:calc(var(--kun-radius)*2)}`, body con `var(--kun-bg)/var(--kun-text)` + `color-scheme:light`, cero vars viejas (`--background/--button/--on-color/--surface`). CSS: 74.93 kB (gzip 14.11 kB); baseline previo no disponible (dist no versionado).

- [x] Crear `src/styles/theme.css` con §2, §3, §5 y §7.
- [x] Dejar `style.css` en imports + body + ripple + autofill.
- [x] Borrar `colors.css`, `clases.css` y `base-styles.css` (vacío).
- [x] `pnpm run build`. En el dist: `--color-sky-500`, `var(--kun-primary)`, `var(--kun-radius)`, y ninguna utilidad con el HEX horneado.

### Fase B — `kunTheme`

> Implementada 2026-10-15. Harness con DOM simulado: 26/26 pass. Escala `#3B82F6` con L `0.980→0.181` estrictamente decreciente, 500 exacto, atomicidad verificada (HEX inválido/catálogo/set incompleto/nombre desconocido no escriben), `setPrimary` 0.51ms. Corrección respecto al plan: matriz M1 combinada linear-sRGB→LMS (la primera versión usaba por error la matriz XYZ→LMS y generaba C≈0.35 para un azul).

- [x] `src/theme/kunTheme.ts`: `configure`, `reset`, `setPrimary`, `setColor`, `setNeutral`, `registerPalette`, `setRadius`, `setFont`, `setColorMode`, `useKunTheme`.
- [x] Alias por nombre (§4.1). `registerPalette` (§4.2) con luminancia de `on-*` solo si el registro publica la paleta.
- [x] Inyectarlo en `install` sin mezclarlo con `kunConfig`.
- [x] Exportar en `src/index.ts`: `kunTheme`, `useKunTheme` (`KunColor`/`KunVariant` llegan en Fase C con `kunVariants.ts`).
- [x] Extender `KunUIInstallOptions.config` con `theme: KunThemeOptions` para `app.use(KunUI, { config: { theme } })`.
- [x] Persistencia `kun:theme:*` y modo `system`.
- [x] `pnpm run typecheck` en cero.

### Fase C — Variantes y componentes

> Implementada 2026-10-15. Todos los componentes migrados (props + templates +
> examples). Desvíos documentados respecto al plan: `KunCard` conserva sus 6
> variantes con roles (`tonal→bg-muted`); `KunTooltip` invertido fijo;
> `KunTabs` conserva `sliderColor`/`selectedClass` con defaults del theme;
> `KunTextarea.loadingColor` se conserva como acento opt-in; `rounded` de
> `KunListItem`/`KunToolbar`/`KunDrawer` pasa a booleano de escala.

- [x] `src/theme/kunVariants.ts` y tipos exportados.
- [x] `KunBtn` como referencia, con el mapa de §6. TSDoc, unión literal y `validator`.
- [x] Seguir con Alert, Badge, Chip, Card, Dialog, Drawer, Tooltip, TextField, Select, Autocomplete. Después el resto.
- [x] Layout (appbar, drawer, card, menu, field) solo con roles de §3.3.
- [x] Quitar `bg-slate-*`, `bg-blue-*`, `bg-red-*` y HEX de `src/`. Los slides de demo del Carousel usan la escala semántica.
- [x] Cada tanda: `examples/Default.vue` (ref, binding y control) y `/examples/<Nombre>`.

`rounded` string libre desaparece, salvo `'full' | 'none'` en `KunBtn` y contenedores circulares.

### Fase D — Playground y docs

> Implementada 2026-10-15. `generate:docs` regeneró 65 READMEs + registry +
> llms. Chrome de los 93 examples migrado a roles (`bg-muted`, `text-muted`,
> `border-default`).

- [x] Playground en `src/components/KunTheme/examples/Default.vue` (ruta real `/examples/KunTheme`): primary, neutral, fuente, radio, light/dark, ratio de contraste, y un snippet de `configure()`. Sin `src/components/KunTheme.vue` para que `generate:barrel` y `generate:docs` lo ignoren (ambos exigen el `.vue` para descubrir un componente).
- [x] `pnpm run generate:docs` cuando cambien props, más blurbs en `scripts/generate-docs.ts`.
- [x] `NOTES.md` solo donde el comportamiento deje de ser obvio.

### Fase E — Cierre

> Implementada 2026-10-15. Guía en `docs/refactor/theme-migration.md`
> (incluye snippet `@pos` + anti-FOUC). Contraste AA verificado:
> sky-500 vs slate-950 = 7.28, sky-400 vs slate-950 = 9.42.

- [x] Snippet `@pos`: `setPrimary('blue')` si el negocio elige un nombre; si trae un HEX, `registerPalette('brand', hex)` y `setPrimary('brand')` solo cuando el registro devuelve `true`. Más el script anti-FOUC.
- [x] Contraste AA del par primary / on-primary en light y dark con el sky default.
- [x] `pnpm run typecheck` y `pnpm run build`. No se esperan componentes nuevos: no hace falta `generate:barrel`.

---

## 12. Criterios de aceptación

1. `setPrimary('blue')` tiñe los componentes sin rebuild ni recarga, aliasando a `--color-blue-50` … `950`. Un nombre desconocido no escribe variables.
2. `registerPalette` con un HEX inválido no escribe stops. Con uno válido, publica los 11 y el stop 500 es ese HEX, ya dentro de sRGB.
3. `text-on-primary` contrasta con el stop usado en ese modo (blanco o `neutral-950`).
4. `setRadius()` reescala `rounded-xs` … `rounded-3xl`. El default deja `rounded-lg` en `0.5rem`.
5. `setFont()` cambia la tipografía global.
6. Sin `configure` de theme, la app queda en light y no escucha `prefers-color-scheme`.
7. `KunBtn` solo acepta `KunColor` y `KunVariant`. No quedan `bgColor` / `textColor` libres en los componentes migrados.
8. Ningún `.vue` de `src/` tiene HEX ni `bg-slate-` / `bg-blue-` / `bg-red-`, fuera de una demo marcada con `<!-- theme-exempt: demo -->`.
9. `typecheck` en cero, `build` ok, docs regeneradas.
10. `dist/*.css` crece solo por el catálogo de paletas (`@source inline`, ~+17 kB) y no por opacidades ni un bloque muerto equivalente a `colors.css` + `clases.css`. Criterio aceptado 2026-10-17 (§8).

---

## 13. Riesgos

| Riesgo | Mitigación |
|---|---|
| La ruptura rompe `@pos` y el resto de apps | Mapa de §9, tandas, una página de migración. Sin aliases silenciosos. |
| Un HEX muy claro no llega a AA | `on-*` al registrar + ratio visible en el playground. v1 no bloquea el registro si los stops son válidos. |
| Clipping de gamut al volver a sRGB | Solo dentro de `registerPalette`: bajar croma hasta entrar en gamut. El alias a una paleta Tailwind no convierte color. |
| `rounded-*` de la app cambia con `--kun-radius` | Documentado. Override local `rounded-none` / `rounded-full`. |
| El dist no contiene una utilidad que la app escribe a mano | Export del `theme.css` fuente para quien compila con Tailwind. El contrato del dist cubre las clases de los componentes. |
| Nuxt UI y KunUI en la misma app | `--kun-*` no choca. `bg-primary` sí. Avisarlo. |
| Los botones pasan de violeta a la paleta `sky` | Decisión §0.11. `#20A0E0` no es el default. El playground lo muestra el día del cambio. |
| El dist no trae `--color-sky-500` | El alias no resuelve. Chequeo de la fase A antes de migrar componentes. |
| Nombre del catálogo sin stops en el CSS efectivo | `set*` verifica presencia y devuelve `false` sin escribir (ver §4.1). `theme.css` emite el catálogo completo (§8), así que solo ocurre con un CSS recortado a mano. |

---

## 14. Fuera de esta entrega

- Icons.
- Componentes nuevos.
- Ediciones en `pos`, `ecommerce` o `api` (solo snippets).
- `tailwind-variants` y override de slots al estilo `app.config.ts` de Nuxt.
- Escala tipográfica `--text-*`.
- Este documento no modifica código de `src/`.
