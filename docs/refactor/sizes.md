# Escala de tamaños

Fuente única: `src/theme/kunSizes.ts`. Todos los componentes que exponen
`size` usan los mismos siete pasos y la misma métrica.

| size | cuadrado / altura | ícono | tipografía |
|------|-------------------|-------|------------|
| `xxs` | 24px (`size-6` / `h-6`) | 12px (`size-3`) | `text-xs` |
| `xs`  | 28px (`size-7` / `h-7`) | 14px (`size-3.5`) | `text-xs` |
| `sm`  | 32px (`size-8` / `h-8`) | 16px (`size-4`) | `text-sm` |
| `md`  | 36px (`size-9` / `h-9`) | 18px (`size-4.5`) | `text-sm` |
| `lg`  | 40px (`size-10` / `h-10`) | 20px (`size-5`) | `text-base` |
| `xl`  | 48px (`size-12` / `h-12`) | 24px (`size-6`) | `text-lg` |
| `xxl` | 56px (`size-14` / `h-14`) | 28px (`size-7`) | `text-xl` |

Reglas:

- Un avatar, un botón icon-only (`square` o prop `icon`) y un control del
  mismo `size` miden exactamente lo mismo.
- El ícono siempre ocupa el 50% del lado del contenedor cuadrado.
- `KunIcon` acepta el paso nominal (`size="md"`), una clase Tailwind
  (`size-5`, `text-xl`) o un número en px.
- Los switches conservan una geometría compacta (no son cuadrados), pero sus
  nombres y tipografía siguen la escala.

## Migración de KunAvatar

La escala anterior (`3xs`…`3xl`) se reemplazó por la canónica. Los alias
`3xs`, `2xs`, `2xl` y `3xl` siguen disponibles con su px histórico; el resto
de nombres cambió de métrica.

| Antes | px | Ahora |
|-------|----|-------|
| `3xs` | 32 | `sm` (o alias `3xs`) |
| `2xs` | 36 | `md` (o alias `2xs`) |
| `xs`  | 40 | `lg` |
| `sm`  | 44 | `lg` / `xl` |
| `md`  | 48 | `xl` |
| `lg`  | 56 | `xxl` |
| `xl`  | 64 | `size="64"` |
| `2xl` | 72 | `size="72"` (o alias `2xl`) |
| `3xl` | 80 | `size="80"` (o alias `3xl`) |

## Otros componentes

- `KunListItemAvatar`: el mapa anterior era `sm` 24px · `md` 32px (default) ·
  `lg` 40px. Equivalencias: `sm` → `xxs`, `md` → `sm`, `lg` → `lg`. El default
  ahora mide 36px.
- `KunDragAndDropHandle`: ahora usa la escala completa; su default (`xs`) mide
  28px.
- `KunSwitch`: conserva geometría propia de track rectangular. No se usa para
  comparar cuadrados; solo su ícono sigue la tipografía compartida.
- `KunCheckbox`: mantiene sus cajas `sm|md|lg` (16/20/24) como excepción de
  forma, igual que antes.

## Formas circulares (1:1)

Regla: si un componente declara una forma circular (`rounded="full"` o el
default de avatar/icono circular), la caja debe ser 1:1. Nunca un óvalo.

- `KunBtn` icon-only: lado canónico del `size`; con `w-*`/`h-*`/`size-*` del
  consumidor se omite el lado canónico y se agrega `aspect-square`.
- `KunAvatar`/`KunListItemAvatar`: si son circulares y reciben una dimensión
  custom, se omite el `size-*` y se agrega `aspect-square`.
- `KunIcon`: `rounded="full"` crea caja 1:1 con el glifo al 50%.
- `KunBadge`/`KunChip`: `rounded="full"` crea caja 1:1; sin dimensiones custom
  el lado se calcula por contenido. `KunBadge` con `pill` y `KunChip` default
  siguen siendo píldoras.
- Los botones/textos con `rounded="full"` que no son icon-only pueden seguir
  siendo píldoras: ahí el 1:1 no aplica.
