export const kunAvatarProps = {
  /** URL de imagen a mostrar (tiene prioridad sobre icon/text/slot). */
  image: String,
  /** Ícono a mostrar si no hay imagen. */
  icon: String,
  /** Texto (iniciales) a mostrar si no hay imagen ni ícono. */
  text: String,
  /** Texto alternativo de la imagen. */
  alt: String,
  /** Tamaño predefinido: 'x-small' | 'small' | 'default' | 'large' | 'x-large'. */
  size: { type: [String, Number], default: "default" },
  /** Radio de borde (true = circular). */
  rounded: { type: [String, Number, Boolean], default: undefined },
  /** Borde: se renderiza como `border border-<valor>`. */
  border: { type: [String, Number, Boolean], default: false },
  /** Sufijo de color de fondo (`bg-<color>`). */
  color: { type: String, default: undefined },
  /** Densidad del padding interno. */
  density: { type: String, default: "default" },
  /** Margen al final (útil en listas). */
  end: Boolean,
  /** Margen al inicio (útil en listas). */
  start: Boolean,
  /** Tag del contenedor. */
  tag: { type: String, default: "div" },
  /** Tema de color. */
  theme: String,
  /** Sin redondeo (esquinas rectas). */
  tile: Boolean,
  /** Variante visual. */
  variant: { type: String, default: "flat" },
};
