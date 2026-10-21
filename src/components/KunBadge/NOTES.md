# KunBadge

## Bordes y radio

Vocabulario propio del badge (alineado con Nuxt UI):

- Default: `rounded-sm`.
- `pill` (prop nueva, `Boolean`) o `rounded="full"` → `rounded-full`.
- `rounded="none"` → `rounded-none`.

`rounded` dejó de aceptar clases Tailwind (p. ej. `'rounded-2xl'`): ahora es
`'full' | 'none' | null` con `validator`. Es un cambio de API:

- **Antes**: el badge era píldora por defecto (`rounded-full` fijo).
- **Ahora**: píldora es opt-in.

```vue
<KunBadge pill color="error">Nuevo</KunBadge>
```

## Color

`bgColor` / `textColor` se reemplazaron por `color`
(`primary|secondary|success|info|warning|error|neutral`), resuelto con
`kunVariantClasses` del theme global.

## Círculo 1:1

`rounded="full"` ya no es solo `rounded-full`: fuerza una caja cuadrada. Si el
consumidor no fija dimensiones, el lado se calcula según el texto y
`textSize`; si pasa `w-*`/`h-*`, se agrega `aspect-square`. `pill` sigue siendo
píldora y `rounded="none"` sigue siendo cuadrado.

```vue
<KunBadge text="99" rounded="full" />
```

## Posicionamiento anclado al borde

El badge se ancla al contenido con `absolute` en la esquina correspondiente y
un único `transform` inline (estilo Nuxt UI): el **centro** del badge se apoya
en la esquina del wrapper.

- `top` → `top-0` + `translateY(-50%)`; `bottom` → `bottom-0` + `translateY(50%)`.
- `left` → `left-0` + `translateX(-50%)`; `right` → `right-0` + `translateX(50%)`.
- `center` (eje) → `left-1/2`/`top-1/2` + `translate*(−50%)`.

Cambios de API menores:

- `ejeX`/`ejeY` ahora son `Number` (antes `[Number, String]`) y su default es
  `0` (antes `25`/`-15`): los px son un desvío sobre el anclaje, no la
  posición. Un badge sin ejes centrado en `top right` queda apoyado en la
  esquina superior derecha del contenido.
- Se eliminó el doble sistema de transform (clases `-translate-x-1/2` que el
  estilo inline pisaba): la única fuente de verdad es el `transform` inline.
