# KunUI

Una librería de componentes Vue.js 3 con Tailwind CSS, ligera y fácil de usar.

## Instalación

```bash
npm install adverich-kun-ui
```

## Uso

### Importación global

```javascript
// main.js
import { createApp } from 'vue'
import KunUI from 'adverich-kun-ui'
import 'adverich-kun-ui/dist/adverich-kun-ui.css'

const app = createApp(App)
app.use(KunUI)
```

### Importación individual

```javascript
import { KunBtn, KunTextField, KunDialog } from 'adverich-kun-ui'
import 'adverich-kun-ui/dist/adverich-kun-ui.css'
```

## Componentes disponibles

### Formularios
- `KunBtn` - Botón con múltiples variantes
- `KunTextField` - Campo de texto
- `KunTextarea` - Área de texto
- `KunNumberField` - Campo numérico
- `KunCheckbox` - Checkbox
- `KunSwitch` - Switch/Toggle
- `KunRadio` - Radio button
- `KunRadioGroup` - Grupo de radio buttons
- `KunSelect` - Selector
- `KunAutocomplete` - Autocompletado
- `KunFileInput` - Input de archivos
- `KunCurrency` - Campo de moneda
- `KunDatePicker` - Selector de fecha
- `KunSlider` - Slider/Rango
- `KunForm` - Contenedor de formulario

### Layout
- `KunContainer` - Contenedor
- `KunRow` - Fila (grid)
- `KunCol` - Columna (grid)
- `KunDivider` - Divisor
- `KunSpacer` - Espaciador

### Navegación
- `KunAppbar` - Barra de aplicación
- `KunAppbarTitle` - Título de appbar
- `KunDrawer` - Drawer/Panel lateral
- `KunToolbar` - Barra de herramientas
- `KunToolbarTitle` - Título de toolbar
- `KunToolbarItems` - Items de toolbar
- `KunTabs` - Pestañas
- `KunTab` - Pestaña individual
- `KunTabWindow` - Ventana de pestaña
- `KunMenu` - Menú desplegable

### Superposición
- `KunDialog` - Diálogo modal
- `KunTooltip` - Tooltip
- `KunAlert` - Alerta/Notificación

### Datos
- `KunTable` - Tabla con funcionalidades avanzadas
- `KunVirtualScroller` - Scroll virtualizado
- `KunInfiniteScroll` - Scroll infinito
- `KunRelationMatrix` - Matriz de relaciones

### Listas
- `KunList` - Lista
- `KunListItem` - Item de lista
- `KunListGroup` - Grupo de lista colapsable
- `KunListSubheader` - Subtítulo de lista
- `KunListImg` - Imagen de lista
- `KunListItemTitle` - Título de item
- `KunListItemText` - Texto de item
- `KunListItemSubtitle` - Subtítulo de item
- `KunListItemAvatar` - Avatar de item
- `KunListItemAction` - Acción de item

### Visualización
- `KunCard` - Tarjeta
- `KunCardTitle` - Título de tarjeta
- `KunCardSubtitle` - Subtítulo de tarjeta
- `KunCardText` - Texto de tarjeta
- `KunCardActions` - Acciones de tarjeta
- `KunCardItem` - Item de tarjeta
- `KunAvatar` - Avatar
- `KunBadge` - Badge/Insignia
- `KunIcon` - Ícono
- `KunChip` - Chip/Etiqueta
- `KunClock` - Reloj
- `KunSkeleton` - Skeleton loader
- `KunLoaderCircular` - Loader circular

### Utilidades
- `KunModalFooter` - Pie de modal
- `KunMultipleModalFooter` - Múltiples pies de modal

## Requisitos

- Vue 3.5+
- Tailwind CSS 4.0+

## Licencia

MIT
