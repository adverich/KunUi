## Modo solo-ícono

Con `only-icon` el campo se reemplaza por un botón que abre el calendario.
El slot `#icon` reemplaza `IconCalendarOutline` en el activador:

```vue
<KunDatePicker v-model="date" only-icon aria-label="Seleccionar fecha">
  <template #icon><MiIcono /></template>
</KunDatePicker>
```
