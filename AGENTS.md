# KunUI - Documentación para Agentes de IA

KunUI es una librería de componentes Vue.js 3 con Tailwind CSS.

---

## ⚠️ Importante para Agentes de IA

### Package Manager Requerido: **pnpm**

Este proyecto utiliza **pnpm** como gestor de paquetes. **No uses npm ni yarn** para instalar dependencias o ejecutar scripts.

```bash
# ❌ NO usar
npm install
npm run build

# ✅ USAR
pnpm install
pnpm run build
```

### Comandos disponibles

| Comando | Descripción |
|---------|-------------|
| `pnpm install` | Instala todas las dependencias |
| `pnpm run dev` | Inicia el servidor de desarrollo (Vite) |
| `pnpm run build` | Compila la librería para producción |
| `pnpm run preview` | Vista previa del build |

---

## Instalación (para usuarios de la librería)

```bash
pnpm add adverich-kun-ui
```

```javascript
import { createApp } from 'vue'
import KunUI from 'adverich-kun-ui'
import 'adverich-kun-ui/dist/adverich-kun-ui.css'

const app = createApp(App)
app.use(KunUI)
```

---

## Componentes

### KunBtn

Botón con múltiples variantes y tamaños.

```vue
<KunBtn text="Click me" variant="default" size="md" @click="handleClick" />
<KunBtn icon="mdi-plus" variant="tonal" />
<KunBtn text="Link" to="/path" />
```

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| text | String | - | Texto del botón |
| size | String | 'md' | Tamaño: 'xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl' |
| variant | String | 'default' | Variante: 'default', 'tonal', 'plain', 'outlined', 'soft', 'text' |
| disabled | Boolean | false | Deshabilita el botón |
| loading | Boolean | false | Muestra estado de carga |
| bgColor | String | 'bg-button' | Color de fondo (clase Tailwind) |
| textColor | String | 'text-slate-800 dark:text-slate-200' | Color de texto |
| icon | String/Object/Function/Array | - | Ícono del botón |
| prependIcon | String/Object/Function/Array | - | Ícono al inicio |
| appendIcon | String/Object/Function/Array | - | Ícono al final |
| to | String/Object | - | Ruta Vue Router (convierte a router-link) |
| href | String | - | URL externa (convierte a <a>) |
| target | String | - | Target del enlace |
| rounded | String | 'rounded-lg' | Clase de borde redondeado |
| ring | Boolean | false | Añade ring al focus |

**Eventos:** click, keydown, keyup, keypress

---

### KunTextField

Campo de texto con validación y decoradores.

```vue
<KunTextField v-model="value" label="Nombre" :rules="[v => !!v || 'Requerido']" />
```

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| modelValue | String/Number | '' | Valor del campo |
| label | String | '' | Etiqueta flotante |
| placeholder | String | '' | Placeholder |
| type | String | 'text' | Tipo: text, password, email, etc. |
| disabled | Boolean | false | Deshabilita el campo |
| readonly | Boolean | false | Solo lectura |
| error | Boolean | false | Muestra estado de error |
| errorMessage | String | '' | Mensaje de error |
| rules | Array | [] | Array de funciones de validación |
| clearable | Boolean | false | Muestra botón de limpiar |
| hint | String | '' | Texto de ayuda |
| persistentHint | Boolean | false | Muestra hint siempre |
| hideDetails | Boolean | false | Oculta área de detalles |
| density | String | 'default' | Densidad: 'default', 'comfortable', 'compact' |
| prefix | String | '' | Prefijo |
| suffix | String | '' | Sufijo |
| prependIcon | String | - | Ícono al inicio |
| appendIcon | String | - | Ícono al final |
| maxlength | Number/String | null | Longitud máxima |
| counter | Boolean | false | Muestra contador |
| debounce | Number | 300 | Debounce en ms |

**Eventos:** update:modelValue, focus, blur, enter

**Métodos expuestos:** validate(), reset(), resetValidation(), focus()

---

### KunAutocomplete

Selector con autocompletado y búsqueda.

```vue
<KunAutocomplete 
  v-model="selected"
  v-model:items="items"
  label="Seleccionar"
  item-value="id"
  item-title="name"
  :rules="[v => !!v || 'Requerido']"
/>
```

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| modelValue | Any | null | Valor seleccionado |
| items | Array | [] | Lista de items (v-model:items) |
| label | String | - | Etiqueta |
| itemValue | String | null | Campo para el valor |
| itemTitle | String/Array | null | Campo(s) para mostrar |
| itemSubtitle | String/Array | null | Campo(s) para subtítulo |
| returnObject | Boolean | false | Retorna objeto completo |
| multiple | Boolean | false | Selección múltiple |
| clearable | Boolean | false | Botón de limpiar |
| searchableKeys | Array | [] | Campos para búsqueda |
| hasCreateItem | Boolean | false | Muestra botón de crear |
| density | String | 'default' | Densidad |
| hideDetails | Boolean | true | Oculta detalles |
| zIndex | String | 'z-250' | Z-index del menú |
| rules | Array | [] | Reglas de validación |

**Eventos:** update:modelValue, selectedItem, createItem, search, notFound, cleared

---

### KunDialog

Diálogo modal con posicionamiento flexible.

```vue
<KunDialog v-model="show" persistent>
  <template #default>
    <p>Contenido del diálogo</p>
  </template>
</KunDialog>
```

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| modelValue | Boolean | - | Controla visibilidad |
| overlay | Boolean | true | Muestra overlay oscuro |
| fullscreen | Boolean | false | Pantalla completa |
| scrollable | Boolean | false | Contenido scrollable |
| persistent | Boolean | false | No cierra al clickear fuera |
| xPosition | String | 'center' | Posición X: 'start', 'center', 'end' |
| yPosition | String | 'center' | Posición Y: 'top', 'center', 'bottom' |
| bgColor | String | 'bg-surface-dark' | Color de fondo |
| width | String | 'w-full' | Ancho |
| maxWidth | String | 'max-w-full' | Ancho máximo |
| height | String | 'h-fit' | Alto |
| maxHeight | String | 'max-h-dvh' | Alto máximo |

**Eventos:** update:modelValue

---

### KunCheckbox

Checkbox con soporte para múltiples valores.

```vue
<KunCheckbox v-model="checked" label="Acepto términos" />
<KunCheckbox v-model="selected" value="option1" label="Opción 1" multiple />
```

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| modelValue | Boolean/Array/String/Number/Object | - | Valor |
| trueValue | Any | true | Valor cuando está activo |
| falseValue | Any | false | Valor cuando está inactivo |
| value | Any | - | Valor del checkbox (para grupos) |
| label | String | - | Etiqueta |
| disabled | Boolean | false | Deshabilitado |
| readonly | Boolean | false | Solo lectura |
| indeterminate | Boolean | false | Estado indeterminado |
| color | String | - | Color |
| size | String | 'md' | Tamaño: 'sm', 'md', 'lg' |
| rules | Array | [] | Reglas de validación |
| hideDetails | Boolean/String | false | Oculta detalles |

**Eventos:** update:modelValue, update:focused

---

### KunSwitch

Switch/Toggle para valores booleanos.

```vue
<KunSwitch v-model="enabled" label="Activar" />
```

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| modelValue | Boolean/String/Number | false | Valor |
| trueValue | Boolean/String/Number | true | Valor activo |
| falseValue | Boolean/String/Number | false | Valor inactivo |
| label | String | - | Etiqueta |
| labelPosition | String | 'right' | Posición: 'top', 'bottom', 'left', 'right' |
| disabled | Boolean | false | Deshabilitado |
| onColor | String | 'bg-green-600' | Color activo |
| offColor | String | 'bg-surface-light' | Color inactivo |
| size | String | 'md' | Tamaño: 'xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl' |
| hideDetails | Boolean | false | Oculta detalles |

---

### KunSelect

Selector desplegable.

```vue
<KunSelect v-model="selected" :items="options" label="Seleccionar" />
```

---

### KunRadio y KunRadioGroup

Botones de radio.

```vue
<KunRadioGroup v-model="selected" label="Opciones">
  <KunRadio value="opt1" label="Opción 1" />
  <KunRadio value="opt2" label="Opción 2" />
</KunRadioGroup>
```

---

### KunTable

Tabla de datos avanzada con paginación, ordenamiento, filtrado y selección.

```vue
<template>
  <KunTable 
    :items="usuarios"
    :headers="headers"
    :searchable="true"
    :filterable="true"
    :show-select="true"
    v-model:selectedItems="seleccionados"
    @update:sortBy="handleSort"
  >
    <template #item.actions="{ item }">
      <KunBtn icon="mdi-pencil" size="xs" />
      <KunBtn icon="mdi-delete" size="xs" />
    </template>
  </KunTable>
</template>

<script setup>
import { ref } from 'vue'

const usuarios = ref([...])

const headers = [
  { key: 'nombre', value: 'nombre', label: 'Nombre', sortable: true },
  { key: 'email', value: 'email', label: 'Email', sortable: true },
  { key: 'rol', value: 'rol', label: 'Rol', sortable: true },
  { key: 'estado', value: 'estado', label: 'Estado' },
]

const seleccionados = ref([])

const handleSort = (sortBy) => {
  console.log('Ordenar por:', sortBy)
}
</script>
```

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| items | Array | [] | Datos a mostrar |
| headers | Array | [] | Configuración de columnas (ver estructura abajo) |
| selectedItems | Array | [] | v-model: Items seleccionados |
| searchable | Boolean | false | Habilita barra de búsqueda global |
| search | String | '' | v-model: Término de búsqueda |
| filterable | Boolean | false | Habilita filtros avanzados por columna |
| filters | Array | [] | Configuración de filtros (ver estructura abajo) |
| showSelect | Boolean | false | Muestra checkboxes de selección |
| showExpand | Boolean | false | Habilita expansión de filas |
| hasActions | Boolean | false | Muestra columna de acciones |
| actionLabel | String | 'Acciones' | Etiqueta de columna de acciones |
| actionLoadingMap | Object | {} | Mapa de estado loading por ID de item |
| itemsPerPage | Number | 10 | Items por página |
| page | Number | 1 | Página actual |
| sortBy | Array/String | [] | v-model: Criterio de ordenamiento |
| multiSort | Boolean | false | Permite ordenar por múltiples columnas |
| pageOptions | Array | [5, 10, 25, 50, 100] | Opciones del selector de items por página |
| searchableKeys | Array | null | Claves específicas para búsqueda global |
| searchPlaceholder | String | 'Buscar...' | Placeholder del input de búsqueda |
| debounceTime | Number | 300 | Debounce en ms para búsqueda |
| customFilter | Function | null | Función de filtrado personalizada |
| functionMap | Object | {} | Mapa de funciones para columnas tipo 'function' |
| hideDefaultHeader | Boolean | false | Oculta header por defecto |
| hideDefaultFooter | Boolean | false | Oculta footer por defecto |
| noDataText | String | 'No hay elementos disponibles' | Texto cuando no hay datos |
| loadingText | String | 'Cargando...' | Texto de estado de carga |

**Estructura de `headers`:**

```javascript
const headers = [
  {
    key: 'nombre',           // Identificador único
    value: 'nombre',         // Clave para acceder al dato (soporta paths: 'usuario.nombre')
    label: 'Nombre',         // Texto visible en el header
    sortable: true,          // Permite ordenar por esta columna
    headerAlign: 'left',     // Alineación: 'left', 'center', 'right'
    columnType: 'function',  // Opcional: tipo de columna
    columnFunction: 'formatDate',  // Nombre de función en functionMap
    relationPath: 'user.id'  // Path alternativo para datos anidados
  }
]
```

**Estructura de `filters`:**

```javascript
const filters = [
  {
    value: 'rol',            // Clave del filtro (debe coincidir con header.value)
    label: 'Rol',            // Etiqueta visible
    text: 'Rol',             // Texto alternativo
    name: 'roles',           // Nombre para textos genéricos
    items: [...],            // Lista de opciones para el filtro
    placeholderText: 'Seleccionar rol',
    textNoItem: 'No hay roles disponibles'
  }
]
```

**Slots:**

| Slot | Props | Descripción |
|------|-------|-------------|
| `#item.{key}` | `{ item, index, value, header }` | Contenido personalizado de celda |
| `#header.{key}` | `{ header }` | Header personalizado de columna |
| `#item.actions` | `{ item, index, loading }` | Columna de acciones (si `hasActions`) |
| `#expand` | `{ item, index }` | Contenido de fila expandida |
| `#thead` | `{ items, headers, page, itemsPerPage, ... }` | Header completo personalizado |
| `#tfoot` | `{ items, headers, ... }` | Footer personalizado |
| `#body.prepend` | `{ items, headers, ... }` | Contenido antes del tbody |
| `#body.append` | `{ items, headers, ... }` | Contenido después del tbody |
| `#prependHeader` | - | Contenido antes de la barra de búsqueda |
| `#prependSearch` | - | Contenido antes del input de búsqueda |
| `#appendSearch` | - | Contenido después del input de búsqueda |
| `#footer` | `{ items, headers, page, itemsPerPage, ... }` | Footer completo personalizado |

**Eventos:**

| Evento | Payload | Descripción |
|--------|---------|-------------|
| `update:page` | `Number` | Cambia la página actual |
| `update:itemsPerPage` | `Number` | Cambia items por página |
| `update:sortBy` | `Array` | Cambia criterio de ordenamiento |
| `update:search` | `String` | Cambia término de búsqueda |
| `update:selectedItems` | `Array` | Cambia items seleccionados |
| `focusOnSearch` | `Boolean` | Input de búsqueda enfocado/desenfocado |

**Clases personalizables:**

| Prop | Tipo | Descripción |
|------|------|-------------|
| wrapperClass | String | Clase del contenedor principal |
| tableClass | String | Clase de la etiqueta `<table>` |
| theadClass | String | Clase del `<thead>` |
| tbodyClass | String | Clase del `<tbody>` |
| tfootClass | String | Clase del `<tfoot>` |
| trClass | String | Clase de las filas `<tr>` |
| thClass | String | Clase de los headers `<th>` |
| tdClass | String/Function | Clase de las celdas `<td>` |
| rowClass | String | Clase adicional para filas |
| rowClassCondition | String/Function | Condición para aplicar rowClass |
| selectedClass | String | Clase para filas seleccionadas |
| stripedClass | String | Clase para filas alternas (striped) |

**Características:**

- **Búsqueda global:** Filtra en todas las columnas marcadas como `sortable` o en `searchableKeys`
- **Filtros por columna:** Modal con KunAutocomplete para filtrar por columnas específicas
- **Ordenamiento:** Simple o múltiple (con `multiSort`). Soporta strings, números y fechas
- **Selección:** Individual, por página, o todos los filtrados
- **Expansión:** Filas expandibles con slot `#expand`
- **Responsive:** En móvil se transforma a vista de tarjetas (KunTableIterators)
- **Serialización:** Soporta funciones serializadas via `functionMap` para columnas dinámicas

**Ejemplo completo:**

```vue
<template>
  <KunTable 
    :items="usuarios"
    :headers="headers"
    :filters="filtros"
    :searchable="true"
    :filterable="true"
    :show-select="true"
    v-model:selectedItems="seleccionados"
    :items-per-page="15"
  >
    <template #item.estado="{ item, value }">
      <KunBadge 
        :color="value === 'activo' ? 'bg-green-500' : 'bg-red-500'"
        :text="value" 
      />
    </template>
    
    <template #item.actions="{ item, loading }">
      <KunBtn 
        icon="mdi-pencil" 
        size="xs" 
        :loading="loading"
        @click="editar(item)" 
      />
      <KunBtn 
        icon="mdi-delete" 
        size="xs" 
        variant="text"
        @click="eliminar(item)" 
      />
    </template>
    
    <template #expand="{ item }">
      <div class="p-4 bg-surface-light">
        <p><strong>Biografía:</strong> {{ item.biografia }}</p>
      </div>
    </template>
  </KunTable>
</template>

<script setup>
import { ref, computed } from 'vue'

const usuarios = ref([
  { id: 1, nombre: 'Juan', email: 'juan@example.com', rol: 'admin', estado: 'activo' },
  { id: 2, nombre: 'María', email: 'maria@example.com', rol: 'editor', estado: 'inactivo' },
])

const headers = [
  { key: 'nombre', value: 'nombre', label: 'Nombre', sortable: true },
  { key: 'email', value: 'email', label: 'Email', sortable: true },
  { key: 'rol', value: 'rol', label: 'Rol', sortable: true },
  { key: 'estado', value: 'estado', label: 'Estado', sortable: true },
]

const filtros = [
  {
    value: 'rol',
    label: 'Rol',
    items: [
      { id: 1, name: 'Admin' },
      { id: 2, name: 'Editor' },
      { id: 3, name: 'Viewer' }
    ]
  },
  {
    value: 'estado',
    label: 'Estado',
    items: [
      { id: 'activo', name: 'Activo' },
      { id: 'inactivo', name: 'Inactivo' }
    ]
  }
]

const seleccionados = ref([])

const editar = (item) => console.log('Editar', item)
const eliminar = (item) => console.log('Eliminar', item)
</script>
```

---

### KunList y KunListItem

Listas y items de lista.

```vue
<KunList selectable>
  <KunListItem title="Item 1" subtitle="Descripción" prepend-icon="mdi-home" />
</KunList>
```

---

### KunTabs

Sistema de pestañas.

```vue
<KunTabs v-model="tab">
  <KunTab value="tab1" text="Pestaña 1" />
  <KunTab value="tab2" text="Pestaña 2" />
</KunTabs>
<KunTabWindow v-model="tab">
  <template #item.tab1>Contenido 1</template>
  <template #item.tab2>Contenido 2</template>
</KunTabWindow>
```

---

### KunTooltip

Tooltip informativo.

```vue
<KunTooltip text="Información adicional" location="top">
  <template #activator>
    <KunBtn icon="mdi-information" />
  </template>
</KunTooltip>
```

---

### KunAlert

Alerta/notificación flotante.

```vue
<KunAlert v-model="show" title="Éxito" message="Operación completada" />
```

---

### KunDrawer

Panel lateral de navegación.

```vue
<KunDrawer v-model="open" location="start" :swipeable="true" />
```

---

### KunForm

Contenedor de formulario con validación.

```vue
<KunForm ref="formRef" v-model="isValid" @submit="handleSubmit">
  <KunTextField v-model="data.name" :rules="[required]" />
</KunForm>
```

**Métodos expuestos:** validate(), reset(), resetValidation()

---

### KunFileInput

Input de archivos.

```vue
<KunFileInput v-model="files" label="Subir archivo" multiple clearable />
```

---

### KunDatePicker

Selector de fecha y hora.

```vue
<KunDatePicker v-model="date" label="Fecha" mode="date" />
<KunDatePicker v-model="datetime" mode="datetime" :enable-time="true" />
<KunDatePicker v-model="range" :range="true" />
```

---

### KunCard y subcomponentes

Sistema de tarjetas.

```vue
<KunCard>
  <KunCardTitle>Título</KunCardTitle>
  <KunCardSubtitle>Subtítulo</KunCardSubtitle>
  <KunCardText>Contenido</KunCardText>
  <KunCardActions>
    <KunBtn text="Acción" />
  </KunCardActions>
</KunCard>
```

---

### Otros componentes

| Componente | Descripción |
|------------|-------------|
| KunAvatar | Avatar con imagen, ícono o texto |
| KunBadge | Badge/insignia |
| KunChip | Chip/etiqueta |
| KunDivider | Divisor |
| KunIcon | Ícono |
| KunLoaderCircular | Loader circular |
| KunSkeleton | Skeleton loader |
| KunSpacer | Espaciador flexible |
| KunContainer, KunRow, KunCol | Sistema de grid |
| KunAppbar, KunAppbarTitle | Barra de aplicación |
| KunToolbar, KunToolbarTitle, KunToolbarItems | Barra de herramientas |
| KunMenu | Menú desplegable |
| KunVirtualScroller | Scroll virtualizado |
| KunInfiniteScroll | Scroll infinito |
| KunTextarea | Área de texto |
| KunNumberField | Campo numérico |
| KunCurrency | Campo de moneda |
| KunSlider | Slider/rango |
| KunClock | Reloj |

---

## Patrones comunes

### Validación de formularios

```javascript
const required = v => !!v || 'Este campo es requerido'
const email = v => /.+@.+\..+/.test(v) || 'Email inválido'
const min = min => v => v?.length >= min || `Mínimo ${min} caracteres`
```

### Configuración global

```javascript
import { kunConfig } from 'adverich-kun-ui'

kunConfig.configure({
  locale: 'es-AR',
  currency: { value: 'ARS', name: 'Pesos', symbol: '$' }
})
```

---

## Convenciones

- **Props de estilo**: Usan clases Tailwind (bg-color, text-color, rounded, etc.)
- **Tamaños**: 'xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'
- **Densidad**: 'default', 'comfortable', 'compact'
- **v-model**: La mayoría de inputs usan v-model para two-way binding
- **Slots**: Nombre de slot = nombre del prop sin "Icon" (prependIcon -> #prepend)

---

## Estructura del Proyecto

```
kun-ui/
├── src/
│   ├── components/       # Componentes Vue (KunBtn, KunTable, etc.)
│   │   └── KunBtn/
│   │       ├── src/
│   │       │   └── components/
│   │       │       └── KunBtn.vue
│   │       └── src/composables/
│   │           └── kunBtnProps.js
│   ├── config/           # Configuración global (kunConfig)
│   ├── directives/       # Directivas personalizadas
│   ├── icons/            # Íconos SVG
│   ├── plugins/          # Plugins de Vite
│   ├── styles/           # Estilos globales
│   ├── utils/            # Utilidades y helpers
│   └── index.js          # Punto de entrada
├── dist/                 # Build output (generado)
├── AGENTS.md             # Esta documentación
├── README.md             # README para usuarios
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Desarrollo

### Modificar un componente

1. Ubica el componente en `src/components/[NombreComponente]/`
2. Edita el archivo `.vue` en `src/components/[NombreComponente]/src/components/`
3. Si necesitas cambiar props, edita el composable en `src/components/[NombreComponente]/src/composables/`
4. Ejecuta `pnpm run dev` para ver los cambios en tiempo real
5. Ejecuta `pnpm run build` para generar el build de producción

### Agregar un nuevo componente

1. Crea la carpeta `src/components/KunNuevoComponente/`
2. Agrega la estructura:
   ```
   KunNuevoComponente/
   ├── src/
   │   ├── components/
   │   │   └── KunNuevoComponente.vue
   │   └── composables/
   │       └── kunNuevoComponenteProps.js
   ```
3. El plugin `kunUiAutoExportsPlugin` registrará automáticamente el componente
4. Documenta el componente en este archivo (AGENTS.md)
