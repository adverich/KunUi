# KunBtn — Notas

## Botones de solo ícono perfectamente cuadrados

**Contexto:** pasar un ícono por **slot default** no activa el modo icon-only automático
(ese sniffing solo cubre la prop `icon` y `text` de un carácter). El botón caía en modo
texto con padding asimétrico `px-3 py-2` y sin `aspect-square`: rectángulos más anchos
que altos en app bars.

**Solución:** prop booleana `square` — fuerza `aspect-square` + padding uniforme
(`p-1`…`p-4` según `size`) y suprime `minWidth`. El modo automático (`icon` prop /
texto de 1 carácter) sigue vigente: `square` solo agrega el caso explícito por slot.

```vue
<KunBtn square color="primary" @click="goHome">
  <KunIcon :icon="icons.home" size="text-xl" />
</KunBtn>
```

Detalles:

- `square` se combina con cualquier `rounded` (`full` para botones circulares).
- Si además hay clase de ancho/alto fija (`w-5 h-5`), el padding uniforme se
  recorta dentro de la box: conviene acompañar con `!p-0` o confiar solo en
  `square` + `size`.
- El contenido por slot que no sea un único ícono central (texto, prepend/append)
  no suele querer ser cuadrado: usar `square` solo donde corresponda.
