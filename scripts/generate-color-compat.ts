/**
 * Regenera:
 * - `src/theme/kunColorCatalogHex.ts` (mapa hex sRGB del catálogo Tailwind)
 * - `src/styles/compat-oklch.css` (`@supports not oklch` fallbacks)
 * - `src/styles/compat-alpha.css` (defaults rgba + overrides sin color-mix)
 *
 * Uso: `pnpm exec tsx scripts/generate-color-compat.ts`
 * Requiere `tailwindcss` resoluble desde node_modules.
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const require = createRequire(import.meta.url);

const ORDER = [
  'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal',
  'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink',
  'rose', 'slate', 'gray', 'zinc', 'neutral', 'stone',
] as const;
const STOPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

function linearToSrgb(c: number): number {
  const v = c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
  return Math.max(0, Math.min(255, Math.round(v * 255)));
}

function oklchToRgb(L: number, C: number, Hdeg: number): [number, number, number] {
  const H = (Hdeg * Math.PI) / 180;
  const a = C * Math.cos(H);
  const b = C * Math.sin(H);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;
  return [
    linearToSrgb(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    linearToSrgb(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    linearToSrgb(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ];
}

function toHex(rgb: [number, number, number]): string {
  return `#${rgb.map((c) => c.toString(16).padStart(2, '0')).join('')}`;
}

function rgba(hex: string, pct: number): string {
  const h = hex.replace(/^#/, '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const a = pct / 100;
  const aStr = Number.isInteger(a) ? String(a) : String(Math.round(a * 100) / 100);
  return `rgba(${r}, ${g}, ${b}, ${aStr})`;
}

function loadCatalog(): Record<string, Record<number, string>> {
  const themePath = require.resolve('tailwindcss/theme.css');
  const theme = fs.readFileSync(themePath, 'utf8');
  const pat =
    /--color-([a-z]+)-(\d+):\s*oklch\(([\d.]+)%\s+(\d*\.?\d+|none)\s+(\d*\.?\d+|none)\)/g;
  const palettes: Record<string, Record<number, string>> = {};
  for (const match of theme.matchAll(pat)) {
    const name = match[1]!;
    const stop = Number(match[2]);
    const L = Number(match[3]) / 100;
    const C = match[4] === 'none' ? 0 : Number(match[4]);
    const H = match[5] === 'none' ? 0 : Number(match[5]);
    (palettes[name] ??= {})[stop] = toHex(oklchToRgb(L, C, H));
  }
  for (const name of ORDER) {
    for (const stop of STOPS) {
      if (!palettes[name]?.[stop]) {
        throw new Error(`Falta --color-${name}-${stop} en ${themePath}`);
      }
    }
  }
  return palettes;
}

function writeHexTs(palettes: Record<string, Record<number, string>>): void {
  const lines = [
    '/**',
    ' * Hex sRGB del catálogo Tailwind v4 (fallback cuando el navegador no soporta oklch).',
    ' * Derivado de `tailwindcss/theme.css` vía oklch→sRGB. No editar a mano:',
    ' * `pnpm exec tsx scripts/generate-color-compat.ts`',
    ' */',
    'export const KUN_COLOR_CATALOG_HEX = {',
  ];
  for (const name of ORDER) {
    const parts = STOPS.map((s) => `${s}: '${palettes[name]![s]}'`).join(', ');
    lines.push(`  ${name}: { ${parts} },`);
  }
  lines.push(
    '} as const;',
    '',
    'export type KunCatalogPaletteName = keyof typeof KUN_COLOR_CATALOG_HEX;',
    'export type KunCatalogHexStop = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;',
    '',
  );
  fs.writeFileSync(path.join(root, 'src/theme/kunColorCatalogHex.ts'), lines.join('\n'));
}

function writeOklchCss(palettes: Record<string, Record<number, string>>): void {
  const lines = [
    '/**',
    ' * Fallback hex del catálogo Tailwind.',
    ' * Solo aplica cuando `oklch()` no está disponible; los navegadores modernos',
    ' * conservan los valores oklch emitidos por Tailwind.',
    ' * Regenerar: `pnpm exec tsx scripts/generate-color-compat.ts`',
    ' */',
    '@supports not (color: oklch(0% 0 0)) {',
    '  :root, :host {',
  ];
  for (const name of ORDER) {
    for (const stop of STOPS) {
      lines.push(`    --color-${name}-${stop}: ${palettes[name]![stop]};`);
    }
  }
  lines.push('  }', '}', '');
  fs.writeFileSync(path.join(root, 'src/styles/compat-oklch.css'), lines.join('\n'));
}

function writeAlphaCss(palettes: Record<string, Record<number, string>>): void {
  const DEFAULTS: Record<string, string> = {
    primary: 'sky',
    secondary: 'blue',
    success: 'green',
    info: 'blue',
    warning: 'amber',
    error: 'red',
  };
  const NEUTRAL = 'slate';
  const ALPHAS = [10, 15, 20, 25, 30, 40, 50, 75, 90];
  const SEMANTIC = Object.keys(DEFAULTS);

  const lines: string[] = [
    '/**',
    ' * Alfas reales para modificadores de opacidad (`bg-primary/10`, etc.).',
    ' *',
    ' * Tailwind v4 emite fallback sólido (`var(--kun-primary)`) cuando no hay',
    ' * `color-mix`. Eso pinta el botón entero del color semántico y esconde el',
    ' * ícono (`currentColor` = mismo hex). Aquí:',
    ' * 1) variables `--kun-*-{pct}` con rgba (defaults + runtime vía kunTheme)',
    ' * 2) overrides de utilidades solo si `color-mix` no existe',
    ' * Los navegadores con color-mix siguen usando oklab; la estética no cambia.',
    ' * Regenerar: `pnpm exec tsx scripts/generate-color-compat.ts`',
    ' */',
    '',
    ':root {',
  ];

  for (const [slot, pal] of Object.entries(DEFAULTS)) {
    const hex = palettes[pal]![500]!;
    for (const pct of ALPHAS) lines.push(`  --kun-${slot}-${pct}: ${rgba(hex, pct)};`);
  }
  const warnTonal = palettes.amber![500]!;
  for (const pct of ALPHAS) {
    lines.push(`  --kun-text-warning-tonal-${pct}: ${rgba(warnTonal, pct)};`);
  }
  const rolesLight: Record<string, { hex: string; pcts: number[] }> = {
    'bg-elevated': { hex: palettes[NEUTRAL]![100]!, pcts: [50, 80, 95] },
    'bg-accented': { hex: palettes[NEUTRAL]![200]!, pcts: [75] },
    'bg-inverted': { hex: palettes[NEUTRAL]![900]!, pcts: [90] },
    'border-inverted': { hex: palettes[NEUTRAL]![900]!, pcts: [25] },
  };
  for (const [role, { hex, pcts }] of Object.entries(rolesLight)) {
    for (const pct of pcts) lines.push(`  --kun-${role}-${pct}: ${rgba(hex, pct)};`);
  }
  lines.push('}', '', ':root.dark,', ':root[data-theme="dark"] {');

  for (const [slot, pal] of Object.entries(DEFAULTS)) {
    const stop = slot === 'warning' ? 700 : 400;
    const hex = palettes[pal]![stop]!;
    for (const pct of ALPHAS) lines.push(`  --kun-${slot}-${pct}: ${rgba(hex, pct)};`);
  }
  const warnTonalDark = palettes.amber![400]!;
  for (const pct of ALPHAS) {
    lines.push(`  --kun-text-warning-tonal-${pct}: ${rgba(warnTonalDark, pct)};`);
  }
  const rolesDark: Record<string, { hex: string; pcts: number[] }> = {
    'bg-elevated': { hex: palettes[NEUTRAL]![800]!, pcts: [50, 80, 95] },
    'bg-accented': { hex: palettes[NEUTRAL]![700]!, pcts: [75] },
    'bg-inverted': { hex: '#ffffff', pcts: [90] },
    'border-inverted': { hex: '#ffffff', pcts: [25] },
  };
  for (const [role, { hex, pcts }] of Object.entries(rolesDark)) {
    for (const pct of pcts) lines.push(`  --kun-${role}-${pct}: ${rgba(hex, pct)};`);
  }
  lines.push('}', '');

  type Ov = [string, string];
  const overrides: Ov[] = [];
  const add = (sel: string, decl: string) => overrides.push([sel, decl]);

  for (const color of SEMANTIC) {
    for (const pct of ALPHAS) {
      add(`.bg-${color}\\/${pct}`, `background-color: var(--kun-${color}-${pct})`);
      add(`.bg-${color}\\/${pct}\\!`, `background-color: var(--kun-${color}-${pct}) !important`);
      add(`.hover\\:bg-${color}\\/${pct}:hover`, `background-color: var(--kun-${color}-${pct})`);
      add(`.active\\:bg-${color}\\/${pct}:active`, `background-color: var(--kun-${color}-${pct})`);
      add(`.text-${color}\\/${pct}`, `color: var(--kun-${color}-${pct})`);
      add(`.hover\\:text-${color}\\/${pct}:hover`, `color: var(--kun-${color}-${pct})`);
      add(`.ring-${color}\\/${pct}`, `--tw-ring-color: var(--kun-${color}-${pct})`);
      add(`.ring-${color}\\/${pct}\\!`, `--tw-ring-color: var(--kun-${color}-${pct}) !important`);
      add(`.outline-${color}\\/${pct}`, `outline-color: var(--kun-${color}-${pct})`);
      add(
        `.focus-visible\\:outline-${color}\\/${pct}:focus-visible`,
        `outline-color: var(--kun-${color}-${pct})`,
      );
    }
    add(`.from-${color}\\/40`, `--tw-gradient-from: var(--kun-${color}-40)`);
  }
  add(`.text-warning-tonal\\/75`, `color: var(--kun-text-warning-tonal-75)`);
  add(`.hover\\:text-warning-tonal\\/75:hover`, `color: var(--kun-text-warning-tonal-75)`);
  for (const pct of [50, 80, 95]) {
    add(`.bg-elevated\\/${pct}`, `background-color: var(--kun-bg-elevated-${pct})`);
    add(`.hover\\:bg-elevated\\/${pct}:hover`, `background-color: var(--kun-bg-elevated-${pct})`);
  }
  add(`.bg-accented\\/75`, `background-color: var(--kun-bg-accented-75)`);
  add(`.hover\\:bg-accented\\/75:hover`, `background-color: var(--kun-bg-accented-75)`);
  add(`.bg-inverted\\/90`, `background-color: var(--kun-bg-inverted-90)`);
  add(`.hover\\:bg-inverted\\/90:hover`, `background-color: var(--kun-bg-inverted-90)`);
  add(`.active\\:bg-inverted\\/90:active`, `background-color: var(--kun-bg-inverted-90)`);
  add(`.outline-inverted\\/25`, `outline-color: var(--kun-border-inverted-25)`);
  add(
    `.focus-visible\\:outline-inverted\\/25:focus-visible`,
    `outline-color: var(--kun-border-inverted-25)`,
  );

  lines.push('@supports not (color: color-mix(in lab, red, red)) {');
  const seen = new Set<string>();
  for (const [sel, decl] of overrides) {
    const key = `${sel}|${decl}`;
    if (seen.has(key)) continue;
    seen.add(key);
    lines.push(`  ${sel} { ${decl}; }`);
  }
  lines.push('}', '');

  fs.writeFileSync(path.join(root, 'src/styles/compat-alpha.css'), lines.join('\n'));
}

const catalog = loadCatalog();
writeHexTs(catalog);
writeOklchCss(catalog);
writeAlphaCss(catalog);
console.log('✓ kunColorCatalogHex.ts, compat-oklch.css, compat-alpha.css regenerados');
