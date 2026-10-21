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
