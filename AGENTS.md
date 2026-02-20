# KunUI - Documentación para Agentes de IA

KunUI es una librería de componentes Vue.js 3 con Tailwind CSS.

## Instalación

```bash
npm install adverich-kun-ui
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

Tabla con ordenamiento, paginación y selección.

```vue
<KunTable 
  :items="data"
  :headers="headers"
  :searchable="true"
  :show-select="true"
  v-model:selectedItems="selected"
/>
```

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| items | Array | [] | Datos a mostrar |
| headers | Array | [] | Configuración de columnas |
| searchable | Boolean | false | Habilita búsqueda |
| showSelect | Boolean | false | Muestra checkboxes |
| showExpand | Boolean | false | Habilita expansión de filas |
| itemsPerPage | Number | 10 | Items por página |
| sortBy | Array/String | [] | Ordenamiento |
| hasActions | Boolean | false | Columna de acciones |

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
