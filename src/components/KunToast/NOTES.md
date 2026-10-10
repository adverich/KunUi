## Flujo programático (inspirado en Nuxt UI)

```ts
const toast = useToast()
toast.add({ title: 'Éxito', description: 'OK', color: 'success' })
toast.add({
  title: 'Archivo eliminado', color: 'warning',
  actions: [{ label: 'Deshacer', variant: 'text', onClick: () => {} }]
})
const t = toast.add({ title: 'Cargando…', duration: 0 }) // sin auto-dismiss
toast.update(t.id, { title: '¡Completado!', color: 'success' })
toast.remove(id)
toast.clear()
```

## Montar KunToaster (una vez en App.vue)

```vue
<template>
  <div id="app">
    <RouterView />
    <KunToaster position="bottom-right" :duration="5000" :max="5" />
  </div>
</template>
```
