# KunToast y KunToaster

Sistema de notificaciones toast inspirado en Nuxt UI. Permite mostrar mensajes efímeros con soporte para acciones, progreso visual y múltiples variantes.

## Uso básico

```vue
<script setup>
import { useToast } from 'adverich-kun-ui'

const toast = useToast()

const mostrarToast = () => {
  toast.add({
    title: 'Éxito',
    description: 'La operación se completó correctamente',
    color: 'success'
  })
}
</script>

<template>
  <KunBtn @click="mostrarToast">Mostrar notificación</KunBtn>
</template>
```

## Configuración del Toaster

El componente `<KunToaster>` debe montarse una sola vez en tu aplicación (idealmente en `App.vue`):

```vue
<script setup>
import { KunToaster } from 'adverich-kun-ui'
</script>

<template>
  <div id="app">
    <!-- Tu app -->
    <RouterView />
    
    <!-- Toaster global -->
    <KunToaster position="bottom-right" :duration="5000" :max="5" />
  </div>
</template>
```

## API

### `useToast()`

```javascript
const toast = useToast()

// Agregar un toast
const { id } = toast.add({
  title: 'Título',
  description: 'Descripción',
  color: 'success',
  duration: 3000,
  icon: null,
  closable: true,
  progress: true,
  actions: [
    { label: 'Deshacer', onClick: () => {}, variant: 'text' }
  ],
  'onUpdate:open': (open) => {
    if (!open) console.log('Toast cerrado')
  }
})

// Actualizar un toast existente
toast.update(id, {
  title: 'Actualizado',
  color: 'info',
  description: 'Nueva descripción'
})

// Eliminar un toast
toast.remove(id)

// Limpiar todos los toasts
toast.clear()
```

### Props de KunToast

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| title | String/VNode/Function | '' | Título del toast |
| description | String/VNode/Function | '' | Descripción detallada |
| icon | String/Object/Function | null | Ícono personalizado |
| color | String | 'primary' | Variante: 'primary', 'success', 'error', 'warning', 'info', 'neutral' |
| orientation | String | 'vertical' | Layout: 'vertical', 'horizontal' |
| duration | Number | null | Duración en ms (null usa el global, 0 = sin auto-dismiss) |
| progress | Boolean | true | Mostrar barra de progreso |
| progressColor | String | null | Color override de la barra |
| closable | Boolean | true | Mostrar botón de cierre |
| closeIcon | String/Object/Function | null | Ícono de cierre personalizado |
| actions | Array | [] | Botones de acción `{ label, icon, variant, size, color, onClick, closeOnClick }` |
| type | String | 'foreground' | Tipo de accesibilidad: 'foreground', 'background' |
| ui | Object | {} | Clases Tailwind por slot |

### Props de KunToaster

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| position | String | 'bottom-right' | Posición: 'top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right' |
| duration | Number | 5000 | Duración global por defecto en ms |
| max | Number | 5 | Máximo de toasts visibles simultáneamente |
| expand | Boolean | false | Modo apilado (stacked) |
| zIndex | String/Number | 3000 | Z-index del contenedor |
| containerClass | String | '' | Clase CSS personalizada del contenedor |

## Slots

### KunToast

| Slot | Props | Descripción |
|------|-------|-------------|
| leading | `{ ui }` | Ícono/avatar personalizado |
| title | - | Contenido del título |
| description | - | Contenido de la descripción |
| actions | - | Contenedor de acciones |
| close | `{ ui }` | Botón de cierre personalizado |

## Variantes de color

```javascript
// Success
toast.add({ title: 'Completado', color: 'success' })

// Error
toast.add({ title: 'Error', description: 'Algo salió mal', color: 'error' })

// Warning
toast.add({ title: 'Advertencia', color: 'warning' })

// Info
toast.add({ title: 'Información', color: 'info' })

// Primary
toast.add({ title: 'Primario', color: 'primary' })

// Neutral
toast.add({ title: 'Neutral', color: 'neutral' })
```

## Contenido dinámico con VNodes

```javascript
import { h } from 'vue'

toast.add({
  title: h('span', { class: 'font-bold' }, 'Elemento eliminado'),
  description: h('span', {}, ['Se eliminó de tu ', h('strong', {}, 'cuenta')]),
  color: 'warning'
})
```

## Ejemplos avanzados

### Con acciones

```javascript
toast.add({
  title: 'Archivo eliminado',
  description: '¿Desea deshacer la acción?',
  color: 'warning',
  actions: [
    {
      label: 'Deshacer',
      variant: 'text',
      color: 'primary',
      onClick: () => console.log('Deshecho'),
      closeOnClick: true
    }
  ]
})
```

### Actualización en cadena (loading → success)

```javascript
function handleUpload() {
  const { id } = toast.add({
    title: 'Subiendo archivo...',
    description: 'Espere un momento',
    duration: 0, // Sin auto-dismiss
    progress: false
  })

  // Simular subida
  setTimeout(() => {
    toast.update(id, {
      title: '¡Archivo subido!',
      description: 'El proceso se completó',
      color: 'success',
      duration: 5000,
      progress: true
    })
  }, 3000)
}
```

### Callback al cerrar

```javascript
toast.add({
  title: 'Notificación',
  description: 'Este toast ejecutará algo al cerrarse',
  'onUpdate:open': (open) => {
    if (!open) {
      console.log('Toast cerrado, ejecutar limpieza')
    }
  }
})
```

### Con contenido HTML en slots

```vue
<KunToaster>
  <template #title="{ toast }">
    <span class="font-bold text-primary">{{ toast.title }}</span>
  </template>
</KunToaster>
```
