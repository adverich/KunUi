export const kunListItemProps = {
  /** Valor del ítem (selección y eventos). Acepta cualquier tipo. */
  value: [String, Number, Boolean, Object, Array, null],
  /** Ruta Vue Router (renderiza router-link). */
  to: [String, Object],
  /** URL externa (renderiza <a>). */
  href: String,
  /** Navegación con replace (solo con `to`). */
  replace: Boolean,
  /** Coincidencia exacta de ruta activa. */
  exact: Boolean,
  /** Tag del contenedor. */
  tag: { type: String, default: 'li' },
  /** Deshabilita el ítem. */
  disabled: Boolean,
  /** Marca el ítem como activo. */
  active: Boolean,
  /** Clase cuando está activo o seleccionado. */
  activeClass: { type: String, default: 'bg-surface-light' },
  /** Permite selección (emite toggle al contexto KunList). */
  selectable: { type: Boolean, default: false },
  /** Variante visual. */
  variant: { type: String, default: 'text' },
  /** Densidad del padding vertical. */
  density: { type: String, default: 'default' },
  /** Redondeo (true = default, string = clase). */
  rounded: { type: [Boolean, String], default: true },
  /** Sin redondeo. */
  tile: Boolean,
  /** Efecto ripple al hacer click. */
  ripple: { type: [Boolean, Object], default: true },
  /** Color de fondo. */
  bgItems: { type: String, default: 'bg-transparent' },
  /** Color del texto. */
  textColor: { type: String, default: 'text-ui' },
  /** Fondo al pasar el mouse (solo si `selectable`). */
  hoverBg: { type: String, default: 'hover:bg-surface-light' },
  /** Sin padding horizontal. */
  noGutters: Boolean,
  /** Alineación vertical del contenido. */
  itemPosition: { type: String, default: 'items-start' },
  /** Ícono al inicio (string, componente o slot `prepend`). */
  prependIcon: [String, Object, Function],
  /** Avatar al inicio (URL de imagen). */
  prependAvatar: String,
  /** Clase del contenedor del prepend. */
  prependClass: String,
  /** Ícono al final (string, componente o slot `append`). */
  appendIcon: [String, Object, Function],
  /** Avatar al final (URL de imagen). */
  appendAvatar: String,
  /** Clase del contenedor del append. */
  appendClass: String,
  /** Título (alternativa al slot). */
  title: [String, Number, Boolean],
  /** Clase del título. */
  titleClass: { type: String, default: 'font-medium' },
  /** Subtítulo (alternativa al slot). */
  subtitle: [String, Number, Boolean],
  /** Clase del subtítulo. */
  subtitleClass: { type: String, default: 'text-sm text-ui-muted' },
  /** Clase extra del contenedor. */
  containerClass: { type: [String, Array, Object], default: '' },
  /** Id del ítem (se genera uno si se omite). */
  id: [String, Number],
}
