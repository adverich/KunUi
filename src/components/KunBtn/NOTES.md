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

## Botones de solo ícono perfectamente cuadrados

**Contexto:** pasar un ícono por **slot default** no activa el modo icon-only
automático (ese sniffing solo cubre la prop `icon` y `text` de un carácter).
El botón caía en modo texto con padding asimétrico y sin cuadrado fijo.

**Solución:** prop booleana `square` — aplica el lado canónico y suprime
`minWidth`. El modo automático (`icon` prop / texto de 1 carácter) sigue
vigente: `square` solo agrega el caso explícito por slot.

```vue
<KunBtn square size="md" color="primary" @click="goHome">
  <KunIcon :icon="icons.home" size="md" />
</KunBtn>
```

Detalles:

- `square` se combina con cualquier `rounded` (`full` para botones circulares).
- El contenido por slot que no sea un único ícono central (texto,
  prepend/append) no suele querer ser cuadrado: usar `square` solo donde
  corresponda.
