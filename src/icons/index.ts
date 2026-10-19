/**
 * Mapa canónico de alias semánticos de KunUI.
 *
 * Cada clave corresponde a un alias `$nombre` usable en `KunIcon` (y en las
 * props `*Icon`). El valor es el nombre Iconify que se renderiza. Por defecto
 * apuntan a la colección `lucide`, cuyo subconjunto usado por la librería se
 * empaqueta offline (`./lucide.generated.js`) para no depender de la red.
 *
 * El consumidor puede pisar cualquier aliase por instancia (`aliases` prop) o
 * globalmente (`kunConfig.configure({ icons: { close: 'i-mdi-close' } })`).
 */
export const kunIconAliases: Record<string, string> = {
  accountOutline: 'lucide:user-round',
  arrowDown: 'lucide:arrow-down',
  arrowDownUp: 'lucide:arrow-down-up',
  arrowUp: 'lucide:arrow-up',
  asterisk: 'lucide:asterisk',
  calendarOutline: 'lucide:calendar',
  check: 'lucide:check',
  checkTwo: 'lucide:check-check',
  checkboxBlank: 'lucide:square',
  checkboxIndeterminate: 'lucide:square-minus',
  checkboxOn: 'lucide:square-check',
  close: 'lucide:x',
  delete: 'lucide:trash',
  edit: 'lucide:pen',
  eyeOffOutline: 'lucide:eye-off',
  eyeOutline: 'lucide:eye',
  filter: 'lucide:funnel',
  info: 'lucide:info',
  menuDownOutline: 'lucide:chevron-down',
  menuRounded: 'lucide:menu',
  menuUpOutline: 'lucide:chevron-up',
  minus: 'lucide:minus',
  palette: 'lucide:palette',
  pencil: 'lucide:pencil',
  plus: 'lucide:plus',
  radioboxBlank: 'lucide:circle',
  radioboxMarked: 'lucide:circle-dot',
  search: 'lucide:search',
  star: 'lucide:star',
  trashOutline: 'lucide:trash',
};

/** Nombre de colección Iconify por defecto de la librería. */
export const KUN_ICON_COLLECTION = 'lucide';

/**
 * Compat: el set propio de KunUI es ahora un mapa `alias → nombre Iconify`.
 * Mantiene el nombre de export histórico (`icons`) para no romper imports.
 */
export const icons = kunIconAliases;

export default kunIconAliases;
