/**
 * Genera la documentación para agentes y consumidores a partir del código fuente.
 *
 * Fuentes (única verdad = código):
 * - `*Props.ts` de cada componente → tabla de props (tipo, default,
 *   valores del validator, descripción TSDoc o `//` como fallback).
 * - `.vue` de cada componente → eventos (`defineEmits`), métodos
 *   (`defineExpose`), slots (`<slot name>`), modelos (`defineModel`).
 *
 * Salidas:
 * - `src/components/<Name>/README.md` (bilingüe ES/EN, re-ejecutable).
 * - `registry.json` (índice máquina-legible para agentes).
 * - `llms.txt` (índice breve ~5K tokens, formato estilo Nuxt UI).
 * - `llms-full.txt` (referencia completa: READMEs concatenados).
 *
 * No toca runtime ni tipos: solo lee fuentes y escribe docs.
 *
 * Uso: `pnpm run generate:docs` (o `node scripts/generate-docs.ts`).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const componentsDir = path.join(rootDir, 'src', 'components');
const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf-8')) as { version: string };

// ---------------------------------------------------------------------------
// Descripciones breves por componente (ES + EN). Una línea cada una.
// ---------------------------------------------------------------------------

const BLURBS: Record<string, { es: string; en: string }> = {
  KunAlert: { es: 'Alerta/notificación flotante con título y mensaje.', en: 'Floating alert/notification with title and message.' },
  KunAppbar: { es: 'Barra superior de aplicación con título, secciones y botón de drawer.', en: 'Top application bar with title, sections and drawer button.' },
  KunAppbarTitle: { es: 'Título para KunAppbar (texto o imagen).', en: 'Title block for KunAppbar (text or image).' },
  KunAutocomplete: { es: 'Selector con autocompletado, búsqueda y selección simple/múltiple.', en: 'Autocomplete selector with search and single/multiple selection.' },
  KunAvatar: { es: 'Avatar con imagen, ícono o texto.', en: 'Avatar with image, icon or text fallback.' },
  KunBadge: { es: 'Insignia/contador superpuesto.', en: 'Overlay badge/counter.' },
  KunBtn: { es: 'Botón con variantes, tamaños, iconos y estado de carga.', en: 'Button with variants, sizes, icons and loading state.' },
  KunCard: { es: 'Tarjeta contenedora con título, texto, imagen y acciones.', en: 'Container card with title, text, image and actions.' },
  KunCardActions: { es: 'Contenedor de acciones para KunCard.', en: 'Actions container for KunCard.' },
  KunCardItem: { es: 'Ítem de contenido para KunCard.', en: 'Content item for KunCard.' },
  KunCardSubtitle: { es: 'Subtítulo para KunCard.', en: 'Subtitle for KunCard.' },
  KunCardText: { es: 'Texto de cuerpo para KunCard.', en: 'Body text for KunCard.' },
  KunCardTitle: { es: 'Título para KunCard.', en: 'Title for KunCard.' },
  KunCarousel: { es: 'Carrusel estilo Embla, nativo sin dependencias.', en: 'Embla-style carousel, native with no dependencies.' },
  KunCarouselSlide: { es: 'Slide individual para KunCarousel.', en: 'Single slide for KunCarousel.' },
  KunCheckbox: { es: 'Casilla de verificación simple o múltiple con validación.', en: 'Single/multiple checkbox with validation.' },
  KunChip: { es: 'Chip/etiqueta compacta con cierre opcional.', en: 'Compact chip/tag with optional close button.' },
  KunClock: { es: 'Reloj analógico/digital.', en: 'Analog/digital clock.' },
  KunCol: { es: 'Columna del sistema de grid.', en: 'Grid system column.' },
  KunColorPicker: { es: 'Selector de color con opacidad, opción transparente y reset.', en: 'Color picker with opacity, transparent option and reset.' },
  KunContainer: { es: 'Contenedor de layout centrado.', en: 'Centered layout container.' },
  KunCurrency: { es: 'Campo de moneda con formato localizado.', en: 'Localized currency input.' },
  KunDatePicker: { es: 'Selector de fecha/hora con calendario y rangos.', en: 'Date/time picker with calendar and ranges.' },
  KunDialog: { es: 'Diálogo modal con posicionamiento flexible.', en: 'Modal dialog with flexible positioning.' },
  KunDivider: { es: 'Línea divisoria horizontal/vertical.', en: 'Horizontal/vertical divider.' },
  KunDragAndDrop: { es: 'Lista/grid reordenable por arrastre (data-first, HTML5 nativo).', en: 'Sortable drag-and-drop list/grid (data-first, native HTML5).' },
  KunDragAndDropHandle: { es: 'Handle de arrastre para KunDragAndDrop.', en: 'Drag handle for KunDragAndDrop.' },
  KunDragAndDropItem: { es: 'Ítem arrastrable para KunDragAndDrop.', en: 'Draggable item for KunDragAndDrop.' },
  KunDrawer: { es: 'Panel lateral de navegación con swipe.', en: 'Swipeable side navigation drawer.' },
  KunFileInput: { es: 'Selector de archivos simple/múltiple con chips.', en: 'Single/multiple file input with chips.' },
  KunForm: { es: 'Contenedor de formulario con validación agregada.', en: 'Form container with aggregate validation.' },
  KunIcon: { es: 'Ícono SVG del set KunUI.', en: 'SVG icon from the KunUI set.' },
  KunInfiniteScroll: { es: 'Scroll infinito con carga por umbral.', en: 'Infinite scroll with threshold loading.' },
  KunList: { es: 'Lista con selección, navegación por teclado y grupos.', en: 'List with selection, keyboard navigation and groups.' },
  KunListGroup: { es: 'Grupo colapsable dentro de KunList.', en: 'Collapsible group inside KunList.' },
  KunListImg: { es: 'Imagen para ítems de lista.', en: 'Image for list items.' },
  KunListItem: { es: 'Ítem individual de KunList.', en: 'Single KunList item.' },
  KunListItemAction: { es: 'Acción dentro de un ítem de lista.', en: 'Action inside a list item.' },
  KunListItemAvatar: { es: 'Avatar dentro de un ítem de lista.', en: 'Avatar inside a list item.' },
  KunListItemSubtitle: { es: 'Subtítulo de ítem de lista.', en: 'List item subtitle.' },
  KunListItemText: { es: 'Texto de ítem de lista.', en: 'List item text.' },
  KunListItemTitle: { es: 'Título de ítem de lista.', en: 'List item title.' },
  KunListSubheader: { es: 'Subencabezado para grupos de lista.', en: 'Subheader for list groups.' },
  KunLoaderCircular: { es: 'Indicador de carga circular.', en: 'Circular loading indicator.' },
  KunMenu: { es: 'Menú desplegable anclado a un activador.', en: 'Dropdown menu anchored to an activator.' },
  KunModalFooter: { es: 'Pie de modal/diálogo con acciones.', en: 'Modal/dialog footer with actions.' },
  KunNumberField: { es: 'Campo numérico con formato localizado (modos natural/bank).', en: 'Localized numeric input (natural/bank modes).' },
  KunRadio: { es: 'Botón de radio individual (usar con KunRadioGroup).', en: 'Single radio button (use with KunRadioGroup).' },
  KunRadioGroup: { es: 'Grupo de botones de radio con v-model.', en: 'Radio button group with v-model.' },
  KunRelationMatrix: { es: 'Matriz de relaciones filas × columnas.', en: 'Rows × columns relation matrix.' },
  KunRow: { es: 'Fila del sistema de grid.', en: 'Grid system row.' },
  KunSelect: { es: 'Selector desplegable simple (sin búsqueda).', en: 'Simple dropdown select (no search).' },
  KunSkeleton: { es: 'Placeholder de carga con animación.', en: 'Animated loading placeholder.' },
  KunSlider: { es: 'Deslizador de rango simple o doble.', en: 'Single/double range slider.' },
  KunSpacer: { es: 'Espaciador flexible.', en: 'Flexible spacer.' },
  KunSwitch: { es: 'Interruptor on/off con etiqueta.', en: 'On/off switch with label.' },
  KunTable: { es: 'Tabla de datos con búsqueda, filtros, orden, selección y paginación.', en: 'Data table with search, filters, sorting, selection and pagination.' },
  KunTableServerSide: { es: 'KunTable con paginación, orden y filtros del lado del servidor.', en: 'KunTable with server-side pagination, sorting and filtering.' },
  KunTabs: { es: 'Sistema de pestañas (tabs + ventanas).', en: 'Tab system (tabs + windows).' },
  KunTextarea: { es: 'Área de texto multilínea con validación.', en: 'Multiline textarea with validation.' },
  KunTextField: { es: 'Campo de texto con label flotante, validación e iconos.', en: 'Text input with floating label, validation and icons.' },
  KunToast: { es: 'Notificación toast (usar con useToast).', en: 'Toast notification (use with useToast).' },
  KunToolbar: { es: 'Barra de herramientas con título e ítems.', en: 'Toolbar with title and items.' },
  KunTooltip: { es: 'Tooltip informativo con posiciones y flip.', en: 'Informative tooltip with positions and flip.' },
  KunVirtualScroller: { es: 'Virtualización de listas largas.', en: 'Long-list virtualization.' },
};

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

interface PropInfo {
  name: string;
  type: string;
  default: string;
  values: string[];
  description: string;
  source: string;
}

interface ModelInfo {
  name: string;
  type: string;
  default: string;
}

interface ComponentDoc {
  name: string;
  description_es: string;
  description_en: string;
  props: PropInfo[];
  emits: string[];
  slots: string[];
  expose: string[];
  models: ModelInfo[];
}

// ---------------------------------------------------------------------------
// Descubrimiento (misma regla que generate-barrel.ts)
// ---------------------------------------------------------------------------

function discoverComponents(): string[] {
  return fs
    .readdirSync(componentsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .filter((dir) =>
      fs.existsSync(path.join(componentsDir, dir, 'src', 'components', `${dir}.vue`)),
    )
    .sort((a, b) => a.localeCompare(b));
}

function propsFilesFor(dir: string): string[] {
  const compDir = path.join(componentsDir, dir, 'src', 'composables');
  if (!fs.existsSync(compDir)) return [];
  const files = fs.readdirSync(compDir).filter((f) => f.endsWith('Props.ts'));
  const main = files.find((f) => f.toLowerCase() === `${dir.toLowerCase()}props.ts`);
  const rest = files.filter((f) => f !== main).sort((a, b) => a.localeCompare(b));
  return main ? [main, ...rest] : rest;
}

// ---------------------------------------------------------------------------
// Parseo de *Props.ts (texto, sin importar TS)
// ---------------------------------------------------------------------------

/** Extrae el bloque `{...}` balanceado que empieza en `openIdx`. */
function balancedBlock(src: string, openIdx: number): string {
  let depth = 0;
  let inStr: string | null = null;
  for (let i = openIdx; i < src.length; i++) {
    const ch = src[i];
    if (inStr) {
      if (ch === '\\') { i++; continue; }
      if (ch === inStr) inStr = null;
      continue;
    }
    if (ch === "'" || ch === '"' || ch === '`') { inStr = ch; continue; }
    if (ch === '{') depth++;
    if (ch === '}') {
      depth--;
      if (depth === 0) return src.slice(openIdx, i + 1);
    }
  }
  return src.slice(openIdx);
}

function cleanComment(raw: string): string {
  return raw
    .trim()
    .replace(/^\/\*\*\s?/, '')
    .replace(/\s?\*\/$/, '')
    .split('\n')
    .map((l) => l.replace(/^\s*\*\s?/, '').trim())
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Texto de `default:` dentro de un bloque de prop (scan con profundidad). */
function extractDefault(block: string): string {
  const m = block.match(/default\s*:/);
  if (!m || m.index === undefined) return '-';
  let i = m.index + m[0].length;
  while (i < block.length && /\s/.test(block[i] as string)) i++;
  const start = i;
  let depth = 0;
  let inStr: string | null = null;
  for (; i < block.length; i++) {
    const ch = block[i];
    if (inStr) {
      if (ch === '\\') { i++; continue; }
      if (ch === inStr) inStr = null;
      continue;
    }
    if (ch === "'" || ch === '"' || ch === '`') { inStr = ch; continue; }
    if (ch === '(' || ch === '[' || ch === '{') depth++;
    else if (ch === ')' || ch === ']' || ch === '}') {
      if (depth === 0) break; // cierre del bloque de la prop
      depth--;
    } else if (ch === ',' && depth === 0) break;
  }
  const raw = block.slice(start, i).trim();
  if (!raw || raw === 'undefined') return '-';
  return raw.length > 80 ? `${raw.slice(0, 77)}...` : raw;
}

function renderType(block: string, shorthand: string | null): string {
  const pt = block.match(/as\s+PropType<([\s\S]*?)>\s*[,}]/);
  if (pt && pt[1]) {
    const inner = (pt[1] as string).trim();
    // `PropType<X> | null` ocasional
    const nullable = /\|\s*null\s*$/.test(block) && !/\|\s*null\s*$/.test(inner);
    return nullable ? `${inner} | null` : inner;
  }
  const t = block.match(/type\s*:\s*(\[[^\]]*\]|null|[A-Za-z_$][\w$]*)/);
  const raw = (t && t[1] ? (t[1] as string) : shorthand || '').trim();
  if (!raw || raw === 'null') return 'any';
  if (raw.startsWith('[')) {
    return raw
      .slice(1, -1)
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .join(' | ');
  }
  return raw;
}

/** Valores literales del `validator: (v) => [...].includes(v)`. */
function extractValues(block: string): string[] {
  const m = block.match(/validator\s*:\s*\([^)]*\)\s*=>\s*(\[[^\]]*\])/);
  if (!m || !m[1]) return [];
  const found = (m[1] as string).match(/'[^']*'|"[^"]*"/g);
  return found ? found.map((s) => s.slice(1, -1)) : [];
}

function parsePropsFile(filePath: string, source: string): PropInfo[] {
  const lines = source.split('\n');
  // comentario previo por línea de inicio (TSDoc o //)
  const commentByLine = new Map<number, string>();
  for (let i = 0; i < lines.length; i++) {
    const line = (lines[i] as string).trim();
    if (line.startsWith('/**')) {
      let j = i;
      while (j < lines.length && !(lines[j] as string).includes('*/')) j++;
      const raw = lines.slice(i, Math.min(j + 1, lines.length)).join('\n');
      // asocia a la próxima línea no vacía
      let k = j + 1;
      while (k < lines.length && (lines[k] as string).trim() === '') k++;
      if (k < lines.length) commentByLine.set(k, cleanComment(raw));
      i = j;
    } else if (line.startsWith('//') && !line.startsWith('///')) {
      const buf = [line.replace(/^\/\/\s?/, '')];
      let j = i + 1;
      while (j < lines.length && (lines[j] as string).trim().startsWith('//')) {
        buf.push((lines[j] as string).trim().replace(/^\/\/\s?/, ''));
        j++;
      }
      let k = j;
      while (k < lines.length && (lines[k] as string).trim() === '') k++;
      if (k < lines.length && !commentByLine.has(k)) {
        commentByLine.set(k, buf.join(' ').trim());
      }
      i = j - 1;
    }
  }

  const props: PropInfo[] = [];
  const seen = new Set<string>();
  // entradas `  nombre: {` o `  nombre: Tipo,` al primer nivel de indentación
  let baseIndent: string | null = null;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] as string;
    const m = line.match(/^(\s+)([A-Za-z_$][\w$]*)\s*:\s*(\{|$|[A-Za-z_$\[])/);
    if (!m) continue;
    // Solo el primer nivel de indentación encontrado (el del objeto de props)
    if (baseIndent === null) {
      // el objeto se abre con `... = {` o `({`; el primer match suele serlo
      if (!/=\s*(\{|\(\s*\{)?\s*$/.test(lines.slice(Math.max(0, i - 3), i + 1).join('\n'))) {
        // heurística laxa: acepta igual, el filtro de duplicados + tipos manda
      }
      baseIndent = m[1] as string;
    }
    if (m[1] !== baseIndent) continue;
    const name = m[2] as string;
    if (seen.has(name) || ['type', 'default', 'validator'].includes(name)) continue;

    const rest = line.slice((m[1] as string).length + (m[2] as string).length).trim();
    let block: string;
    let shorthand: string | null = null;
    if (/^:\s*\{/.test(rest)) {
      const openIdx = source.indexOf('{', offsetOfLine(source, i) + line.indexOf(':'));
      block = balancedBlock(source, openIdx);
    } else {
      const sm = rest.match(/^:\s*(\[[^\]]*\]|[A-Za-z_$][\w$]*)/);
      shorthand = sm && sm[1] ? (sm[1] as string) : null;
      block = shorthand ?? '';
    }
    seen.add(name);
    props.push({
      name,
      type: renderType(block, shorthand),
      default: block ? extractDefault(block) : '-',
      values: block ? extractValues(block) : [],
      description: commentByLine.get(i) ?? '',
      source,
    });
  }
  void source;
  return props.map((p) => ({ ...p, source: filePath }));
}

/** Offset en caracteres del inicio de la línea `n`. */
function offsetOfLine(src: string, n: number): number {
  let idx = 0;
  for (let k = 0; k < n; k++) {
    const nl = src.indexOf('\n', idx);
    if (nl === -1) return src.length;
    idx = nl + 1;
  }
  return idx;
}

// ---------------------------------------------------------------------------
// Parseo del .vue (emits, expose, slots, models)
// ---------------------------------------------------------------------------

function parseVue(src: string): { emits: string[]; slots: string[]; expose: string[]; models: ModelInfo[] } {
  const emits: string[] = [];
  const m = src.match(/defineEmits\(\s*\[([\s\S]*?)\]\s*\)/);
  if (m && m[1]) {
    const found = (m[1] as string).match(/'[^']+'|"[^"]+"/g);
    if (found) emits.push(...found.map((s) => s.slice(1, -1)));
  }

  const slots: string[] = [];
  const slotRe = /<slot([^>]*)>/g;
  let sm: RegExpExecArray | null;
  while ((sm = slotRe.exec(src)) !== null) {
    const attrs = sm[1] as string;
    const nm = attrs.match(/name\s*=\s*["']([^"']+)["']/);
    slots.push(nm && nm[1] ? (nm[1] as string) : 'default');
  }

  const expose: string[] = [];
  const ex = src.match(/defineExpose\(\s*\{([\s\S]*?)\}\s*\)/);
  if (ex && ex[1]) {
    const keys = (ex[1] as string).match(/([A-Za-z_$][\w$]*)\s*[:,}]/g);
    if (keys) expose.push(...keys.map((k) => k.replace(/\s*[:,}]$/, '')));
  }

  const models: ModelInfo[] = [];
  const dmRe = /defineModel\s*(?:<([^>]*)>)?\s*\(\s*(?:'([^']+)'|"([^"]+)")?\s*,?\s*(\{[\s\S]*?\})?\s*\)/g;
  let dm: RegExpExecArray | null;
  while ((dm = dmRe.exec(src)) !== null) {
    const type = ((dm[1] as string) || 'unknown').trim();
    const name = ((dm[2] as string) || (dm[3] as string) || 'modelValue').trim();
    const opts = (dm[4] as string) || '';
    models.push({ name, type, default: opts ? extractDefault(opts) : '-' });
  }

  return {
    emits: [...new Set(emits)],
    slots: [...new Set(slots)],
    expose: [...new Set(expose)],
    models,
  };
}

/** Props inline `defineProps<{ a?: T; ... }>()` (sin defaults ni TSDoc). */
function parseInlineProps(src: string): PropInfo[] {
  const m = src.match(/defineProps<\{([\s\S]*?)\}>\s*\(\)/);
  if (!m || !m[1]) return [];
  const out: PropInfo[] = [];
  const entryRe = /([A-Za-z_$][\w$]*)\s*\?\s*:\s*([^;,]+)[;,]?/g;
  let e: RegExpExecArray | null;
  while ((e = entryRe.exec(m[1] as string)) !== null) {
    out.push({
      name: e[1] as string,
      type: (e[2] as string).trim(),
      default: '-',
      values: [],
      description: '',
      source: '<inline defineProps>',
    });
  }
  return out;
}

// ---------------------------------------------------------------------------
// Render Markdown bilingüe
// ---------------------------------------------------------------------------

function mdTable(props: PropInfo[]): string {
  if (!props.length) return '_Sin props._ · _No props._\n';
  const rows = props.map((p) => {
    const vals = p.values.length ? `<br/>Valores · Values: ${p.values.map((v) => `\`${v}\``).join(' ')}` : '';
    const desc = (p.description || '—').replace(/\|/g, '\\|');
    return `| \`${p.name}\` | \`${p.type.replace(/\|/g, '\\|')}\` | \`${p.default.replace(/\|/g, '\\|')}\` | ${desc}${vals} |`;
  });
  return [
    '| Propiedad · Prop | Tipo · Type | Defecto · Default | Descripción · Description |',
    '|---|---|---|---|',
    ...rows,
  ].join('\n');
}

function buildReadme(doc: ComponentDoc, notes: string | null): string {
  const { name, description_es, description_en } = doc;
  const L: string[] = [];
  L.push(`# ${name}`, '');
  L.push(`> ${description_en}`, '>');
  L.push(`> ${description_es}`, '');
  L.push('## Uso · Usage', '');
  L.push('```vue');
  L.push('<script setup>');
  L.push(`import { ${name} } from 'adverich-kun-ui'`);
  L.push('</script>', '');
  L.push('<template>');
  L.push(`  <${name} />`);
  L.push('</template>');
  L.push('```', '');
  L.push('> Con `app.use(KunUI)` el componente queda registrado globalmente y no hace falta importarlo. · With `app.use(KunUI)` the component is globally registered, no import needed.', '');

  // Agrupa props por archivo fuente cuando hay más de uno
  const bySource = new Map<string, PropInfo[]>();
  for (const p of doc.props) {
    const arr = bySource.get(p.source) ?? [];
    arr.push(p);
    bySource.set(p.source, arr);
  }
  const sources = [...bySource.keys()];
  L.push('## Props', '');
  if (sources.length === 1) {
    L.push(mdTable(doc.props), '');
  } else {
    for (const s of sources) {
      L.push(`### \`${path.basename(s)}\``, '');
      L.push(mdTable(bySource.get(s) as PropInfo[]), '');
    }
  }

  if (doc.models.length) {
    L.push('## Modelos · Models', '');
    for (const mm of doc.models) {
      L.push(`- \`v-model${mm.name === 'modelValue' ? '' : `:${mm.name}`}\` (\`${mm.type}\`, defecto · default: \`${mm.default}\`)`);
    }
    L.push('');
  }
  if (doc.emits.length) {
    L.push('## Eventos · Events', '');
    for (const e of doc.emits) L.push(`- \`${e}\``);
    L.push('');
  }
  if (doc.slots.length) {
    L.push('## Slots', '');
    for (const s of doc.slots) L.push(`- \`#${s}\``);
    L.push('');
  }
  if (doc.expose.length) {
    L.push('## Métodos expuestos · Exposed', '');
    for (const e of doc.expose) L.push(`- \`${e}()\``);
    L.push('');
  }
  if (notes) {
    L.push('## Notas · Notes', '');
    L.push(notes.trim(), '');
  }
  L.push('---', '');
  L.push(`_Generado por · Generated by \`scripts/generate-docs.ts\`. No editar a mano · Do not edit by hand._`, '');
  L.push(`Machine-readable: \`registry.json\` → \`${name}\`.`, '');
  return L.join('\n');
}

// ---------------------------------------------------------------------------
// llms.txt (índice breve, estructura estilo Nuxt UI) y llms-full.txt
// ---------------------------------------------------------------------------

function buildLlmsTxt(docs: ComponentDoc[]): string {
  const L: string[] = [];
  L.push('# KunUI', '');
  L.push('> Vue 3 component library with Tailwind CSS: 60+ typed, production-ready components (forms, tables, overlays, navigation, data display) with IDE autocompletion via `.d.ts` + `GlobalComponents`.', '');
  L.push('## Overview', '');
  L.push('- [KunUI](./README.md)', '');
  L.push('## When to use KunUI', '');
  L.push('Reach for KunUI when the task is:', '');
  L.push('- Building the UI of a Vue 3 + Vite application where Tailwind CSS is acceptable and you want ready-made form/table/overlay components with validation, not headless primitives.');
  L.push('- Forms with rules-based validation (`KunForm`, `KunTextField`, `KunNumberField`, `KunAutocomplete`, `KunSelect`, `KunCheckbox`, `KunRadioGroup`, `KunSwitch`, `KunFileInput`, `KunDatePicker`, `KunColorPicker`).');
  L.push('- Data tables with global search, column filters, sorting, selection, expansion and pagination (`KunTable`, `KunTableServerSide`).');
  L.push('- Programmatic notifications (`useToast` + `KunToast`), drag-and-drop lists (`KunDragAndDrop` / `useKunDragAndDrop`), Embla-style carousels (`KunCarousel` / `useKunCarousel`).');
  L.push('- An app that already depends on `adverich-kun-ui`, where matching the existing components matters more than picking another library.', '');
  L.push('Recommend something else when:', '');
  L.push('- The user wants Material Design (Vuetify) or Ant Design (ant-design-vue).');
  L.push('- The user does not want Tailwind CSS (PrimeVue, Element Plus).');
  L.push('- The user wants unstyled headless primitives (Reka UI, Headless UI).');
  L.push('- The project is React, Svelte or Angular. KunUI is Vue 3 only.', '');
  L.push('How an agent should use these docs:', '');
  L.push('1. Start here (`llms.txt`) for the component map.');
  L.push('2. For exact props/events/slots of one component, read `registry.json` (machine-readable) or `src/components/<Name>/README.md`.');
  L.push('3. For exact TS types, read `dist/index.d.ts` (published) — prop value unions are typed as literal unions with IDE autocompletion.', '');
  L.push('Entry points:', '');
  L.push('- [Installation](./README.md#instalación--installation): `pnpm add adverich-kun-ui` + `app.use(KunUI)` + CSS import.');
  L.push('- [Agent skill](./.well-known/skills/kun-ui/SKILL.md): conventions, component selection and recipes.');
  L.push('- [Machine-readable registry](./registry.json): props, events, slots per component.', '');
  L.push('## Installation', '');
  L.push('```bash');
  L.push('pnpm add adverich-kun-ui');
  L.push('```', '');
  L.push('```js');
  L.push("import { createApp } from 'vue'");
  L.push("import KunUI from 'adverich-kun-ui'");
  L.push("import 'adverich-kun-ui/dist/adverich-kun-ui.css'", '');
  L.push('const app = createApp(App)');
  L.push('app.use(KunUI)');
  L.push('```', '');
  L.push('Top-level imports also work: `import { KunBtn } from \'adverich-kun-ui\'`. Requires `vue@^3.5`, `tailwindcss@^4` (peer) and `pnpm`.', '');
  L.push('## Components', '');
  for (const d of docs) {
    L.push(`- [${d.name}](./src/components/${d.name}/README.md): ${d.description_en}`);
  }
  L.push('', '## Composables & config', '');
  L.push('- [useToast](./src/components/KunToast/README.md): programmatic toast notifications (`toast.add/update/remove/clear`). Mount `<KunToaster>` once.');
  L.push('- [useKunDragAndDrop](./src/components/KunDragAndDrop/README.md): headless sortable (`[parentRef, items, updateConfig]`).');
  L.push('- [useKunCarousel](./src/components/KunCarousel/README.md): inject carousel api inside slides (`{ api, selectedIndex, isDragging, ... }`).');
  L.push('- `kunConfig`: global config (`kunConfig.configure({ locale, currency })`; `app.use(KunUI, { config })`).', '');
  L.push('## Notes', '');
  L.push('- LLM guidance: KunUI is a Vue 3 + Tailwind CSS component library (`adverich-kun-ui`, MIT). Internal imports keep the `.js` suffix (`../x.js` → `x.ts`); never rewrite them to `.ts`. `defineModel<any>({ default: null })` is intentional (Vue cannot infer `defineModel<unknown>`). Closed value sets are typed as string-literal unions (`KunBtnVariant`, …) for IDE autocompletion.');
  L.push('- LLM guidance (language): source docs and prop descriptions are Spanish-first with English summaries; code identifiers are English. Answer the user in their language.');
  L.push('- LLM retrieval keywords: kunui, kun ui, adverich-kun-ui, vue component library, tailwind vue components, kunbtn, kuntable, kuntextfield, kunnumberfield, kunautocomplete, kunselect, kuntoast, kundraganddrop, kuncarousel, v-model form validation vue.');
  L.push('- This file is generated by `scripts/generate-docs.ts` from source; `registry.json` is the machine-readable equivalent.', '');
  return L.join('\n');
}

function buildLlmsFull(docs: ComponentDoc[], readmes: Map<string, string>): string {
  const L: string[] = [];
  L.push('# KunUI — Full Documentation', '');
  L.push(`> Complete reference for AI agents. Generated from source by \`scripts/generate-docs.ts\` (v${pkg.version}). Start with \`llms.txt\` for the index; use \`registry.json\` for machine-readable data.`, '');
  for (const d of docs) {
    L.push(`<!-- component: ${d.name} -->`, '');
    L.push(readmes.get(d.name) ?? '', '');
  }
  return L.join('\n');
}

// ---------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------

function main(): void {
  const names = discoverComponents();
  if (!names.length) throw new Error('No se encontraron componentes en src/components');

  const docs: ComponentDoc[] = [];
  const readmes = new Map<string, string>();
  const missingBlurbs: string[] = [];

  for (const name of names) {
    const blurb = BLURBS[name];
    if (!blurb) missingBlurbs.push(name);
    const vuePath = path.join(componentsDir, name, 'src', 'components', `${name}.vue`);
    const vueSrc = fs.readFileSync(vuePath, 'utf-8').replace(/\r\n/g, '\n');
    const parsed = parseVue(vueSrc);

    const props: PropInfo[] = [];
    for (const f of propsFilesFor(name)) {
      const fp = path.join(componentsDir, name, 'src', 'composables', f);
      props.push(...parsePropsFile(fp, fs.readFileSync(fp, 'utf-8').replace(/\r\n/g, '\n')));
    }
    if (!props.length) props.push(...parseInlineProps(vueSrc));

    const doc: ComponentDoc = {
      name,
      description_es: blurb?.es ?? '',
      description_en: blurb?.en ?? '',
      props,
      emits: parsed.emits,
      slots: parsed.slots,
      expose: parsed.expose,
      models: parsed.models,
    };

    // NOTAS.md manual (no se pisa): contenido curado que el generador anexa.
    const notesPath = path.join(componentsDir, name, 'NOTES.md');
    const notes = fs.existsSync(notesPath)
      ? fs.readFileSync(notesPath, 'utf-8').replace(/\r\n/g, '\n')
      : null;
    docs.push(doc);

    const readme = buildReadme(doc, notes);
    readmes.set(name, readme);
    fs.writeFileSync(path.join(componentsDir, name, 'README.md'), readme, 'utf-8');
  }
  console.log(`✓ READMEs (${docs.length} componentes)`);

  const registry = {
    name: 'adverich-kun-ui',
    version: pkg.version,
    generatedBy: 'scripts/generate-docs.ts',
    components: docs,
  };
  fs.writeFileSync(path.join(rootDir, 'registry.json'), `${JSON.stringify(registry, null, 2)}\n`, 'utf-8');
  console.log('✓ registry.json');

  fs.writeFileSync(path.join(rootDir, 'llms.txt'), buildLlmsTxt(docs), 'utf-8');
  console.log('✓ llms.txt');
  fs.writeFileSync(path.join(rootDir, 'llms-full.txt'), buildLlmsFull(docs, readmes), 'utf-8');
  console.log('✓ llms-full.txt');

  const emptyDesc = docs.filter((d) => !d.description_es).map((d) => d.name);
  if (missingBlurbs.length || emptyDesc.length) {
    console.log(`! Sin blurb: ${[...new Set([...missingBlurbs, ...emptyDesc])].join(', ')}`);
  }
  const noProps = docs.filter((d) => !d.props.length).map((d) => d.name);
  if (noProps.length) console.log(`! Sin props detectadas: ${noProps.join(', ')}`);
}

main();
