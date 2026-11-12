# KunBtn — Notas

## Tamaños

Escala canónica compartida (`src/theme/kunSizes.ts`): `xxs` (24px) · `xs`
(28px) · `sm` (32px) · `md` (36px, default) · `lg` (40px) · `xl` (48px) ·
`xxl` (56px).

- Botón de texto: altura fija (`h-6`…`h-14`) + padding horizontal por tamaño.
- Botón icon-only / `square`: lado fijo (`size-6`…`size-14`), sin padding ni
  `aspect-square`. Coincide exactamente con `KunAvatar` del mismo `size`.
- Ícono: 50% del lado (`12|14|16|18|20|24|28`). `iconSize` sigue teniendo
  prioridad para casos puntuales.

## Botones de solo icono

Un único `KunIcon` en el slot default ahora activa automáticamente el modo
icon-only, igual que la prop `icon` o un texto de un caracter. La prop `square`
sigue disponible para forzarlo con cualquier otro contenido.

Regla 1:1: un botón icon-only siempre mide lo mismo de ancho y alto.

- Sin clases de dimension: usa el lado canónico del `size` (`size-6`...`size-14`).
- Con `w-*`, `h-*` o `size-*`: respeta la clase del consumidor y agrega
  `aspect-square` para completar el lado faltante.
- `rounded="full"` sobre un icon-only da un círculo real, nunca un óvalo.
- Los botones con texto conservan la altura de control y pueden seguir siendo
  píldoras si se usa `rounded="full"`.

```vue
<KunBtn size="xxs" rounded="full" color="error">
  <KunIcon icon="$close" size="xxs" />
</KunBtn>

<KunBtn size="md" rounded="full" class="h-16 w-16">
  <KunIcon icon="$star" size="md" />
</KunBtn>
```