## Modo solo-ícono

Con `only-icon` el campo se reemplaza por un botón que abre el calendario.
El slot `#icon` reemplaza el ícono por defecto (`$calendarOutline`) en el activador:

```vue
<KunDatePicker v-model="date" only-icon aria-label="Seleccionar fecha">
  <template #icon><MiIcono /></template>
</KunDatePicker>
```

## Bordes y superficies

- El popover pasa a `bg-default` + `ring ring-default` (antes `bg-elevated` +
  `border border-default`, invisible en dark).
- Header, bloque de tiempo y footer usan `border-b`/`border-t border-muted`
  (neutral-700), visibles sobre el panel `bg-default`.

