<script setup lang="ts">
import { ref, computed } from 'vue'
import KunBtn from '../components/KunBtn/src/components/KunBtn.vue'
import KunSelect from '../components/KunSelect/src/components/KunSelect.vue'
import KunTextField from '../components/KunTextField/src/components/KunTextField.vue'
import {
  kunTheme,
  useKunTheme,
  KUN_PALETTE_CATALOG,
  KUN_NEUTRAL_CATALOG,
  type KunColorMode,
} from './kunTheme.js'

const emit = defineEmits<{ change: [message: string] }>()

const theme = useKunTheme()

// Clases literales para que el scanner de Tailwind emita `bg-{paleta}-500`.
// (Con `theme.css` compilado las emite `@source inline`; acá quedan explícitas.)
const SWATCH: Record<string, string> = {
  red: 'bg-red-500',
  orange: 'bg-orange-500',
  amber: 'bg-amber-500',
  yellow: 'bg-yellow-500',
  lime: 'bg-lime-500',
  green: 'bg-green-500',
  emerald: 'bg-emerald-500',
  teal: 'bg-teal-500',
  cyan: 'bg-cyan-500',
  sky: 'bg-sky-500',
  blue: 'bg-blue-500',
  indigo: 'bg-indigo-500',
  violet: 'bg-violet-500',
  purple: 'bg-purple-500',
  fuchsia: 'bg-fuchsia-500',
  pink: 'bg-pink-500',
  rose: 'bg-rose-500',
  slate: 'bg-slate-500',
  gray: 'bg-gray-500',
  zinc: 'bg-zinc-500',
  neutral: 'bg-neutral-500',
  stone: 'bg-stone-500',
}

const palettes: readonly string[] = KUN_PALETTE_CATALOG
const neutrals: readonly string[] = KUN_NEUTRAL_CATALOG

const modeItems = ref([
  { id: 'light', name: 'Claro' },
  { id: 'dark', name: 'Oscuro' },
  { id: 'system', name: 'Sistema' },
])
const radiusOptions = ref([
  { id: '0rem', name: 'None' },
  { id: '0.125rem', name: 'XS' },
  { id: '0.25rem', name: 'SM' },
  { id: '0.375rem', name: 'MD' },
  { id: '0.5rem', name: 'LG' },
])

const DEFAULT_SANS =
  'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
const fontOptions = ref([
  { id: DEFAULT_SANS, name: 'Sistema', family: '' },
  { id: '"Inter", ui-sans-serif, system-ui, sans-serif', name: 'Inter', family: 'Inter' },
  { id: '"Roboto", ui-sans-serif, system-ui, sans-serif', name: 'Roboto', family: 'Roboto' },
  { id: '"Poppins", ui-sans-serif, system-ui, sans-serif', name: 'Poppins', family: 'Poppins' },
  { id: '"Georgia", ui-serif, Georgia, serif', name: 'Georgia (serif)', family: '' },
  { id: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace', name: 'Mono', family: '' },
])

const GOOGLE_FONTS: Record<string, string> = {
  Inter: 'family=Inter:wght@400;500;600;700',
  Roboto: 'family=Roboto:wght@400;500;700',
  Poppins: 'family=Poppins:wght@400;500;600;700',
}
function ensureFont(family: string): void {
  if (!family || typeof document === 'undefined') return
  const query = GOOGLE_FONTS[family]
  if (!query || document.querySelector(`link[data-kun-font="${family}"]`)) return
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = `https://fonts.googleapis.com/css2?${query}&display=swap`
  link.dataset.kunFont = family
  document.head.appendChild(link)
}

const fontValue = computed<string>(() => theme.font.sans || DEFAULT_SANS)
const customHex = ref('')

function pickPrimary(name: string): void {
  const ok = kunTheme.setPrimary(name)
  emit('change', ok ? `primary → ${name}` : `primary: "${name}" no disponible en el CSS`)
}
function pickNeutral(name: string): void {
  const ok = kunTheme.setNeutral(name)
  emit('change', ok ? `neutral → ${name}` : `neutral: "${name}" no disponible en el CSS`)
}
function pickRadius(value: string): void {
  kunTheme.setRadius(value)
  emit('change', `radius → ${value}`)
}
function pickMode(value: unknown): void {
  const mode = value as KunColorMode
  kunTheme.setColorMode(mode)
  emit('change', `colorMode → ${mode}`)
}
function pickFont(value: unknown): void {
  const stack = String(value)
  const option = fontOptions.value.find((o) => o.id === stack)
  if (option?.family) ensureFont(option.family)
  kunTheme.setFont({ sans: stack })
  emit('change', `font → ${option?.name ?? stack}`)
}
function applyCustomHex(): void {
  const hex = customHex.value.trim()
  if (!hex) return
  emit(
    'change',
    kunTheme.registerPalette('brand', hex)
      ? kunTheme.setPrimary('brand')
        ? `brand ${hex} publicado y activo`
        : 'registro ok, alias falló'
      : 'HEX inválido (sin cambios)',
  )
}
function resetAll(): void {
  kunTheme.reset()
  customHex.value = ''
  emit('change', 'reset a defaults')
}
</script>

<template>
  <div class="space-y-3 p-3 text-sm">
    <!-- Color mode -->
    <div class="space-y-1.5">
      <div class="text-[0.7rem] font-medium uppercase tracking-wide text-muted">Color mode</div>
      <div class="grid grid-cols-3 gap-1.5">
        <KunBtn
          v-for="m in modeItems"
          :key="m.id"
          :color="theme.colorMode === m.id ? 'primary' : 'neutral'"
          :variant="theme.colorMode === m.id ? 'solid' : 'outline'"
          size="xs"
          class="justify-center"
          @click="pickMode(m.id)"
        >
          {{ m.name }}
        </KunBtn>
      </div>
    </div>

    <!-- Primary -->
    <div class="space-y-1.5">
      <div class="flex items-center justify-between">
        <div class="text-[0.7rem] font-medium uppercase tracking-wide text-muted">Primary</div>
        <code class="truncate text-xs text-muted">{{ theme.primary }}</code>
      </div>
      <div class="flex flex-wrap gap-1.5">
        <button
          v-for="name in palettes"
          :key="name"
          type="button"
          :title="name"
          :aria-label="name"
          :aria-pressed="theme.primary === name"
          class="h-5 w-5 rounded-full transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          :class="[SWATCH[name], theme.primary === name ? 'ring-2 ring-default scale-110' : 'hover:scale-110']"
          @click="pickPrimary(name)"
        />
      </div>
    </div>

    <!-- Neutral -->
    <div class="space-y-1.5">
      <div class="flex items-center justify-between">
        <div class="text-[0.7rem] font-medium uppercase tracking-wide text-muted">Neutral</div>
        <code class="truncate text-xs text-muted">{{ theme.neutral }}</code>
      </div>
      <div class="flex flex-wrap gap-1.5">
        <button
          v-for="name in neutrals"
          :key="name"
          type="button"
          :title="name"
          :aria-label="name"
          :aria-pressed="theme.neutral === name"
          class="h-5 w-5 rounded-full transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          :class="[SWATCH[name], theme.neutral === name ? 'ring-2 ring-default scale-110' : 'hover:scale-110']"
          @click="pickNeutral(name)"
        />
      </div>
    </div>

    <!-- Radius -->
    <div class="space-y-1.5">
      <div class="flex items-center justify-between">
        <div class="text-[0.7rem] font-medium uppercase tracking-wide text-muted">Radius</div>
        <code class="truncate text-xs text-muted">{{ theme.radius }}</code>
      </div>
      <div class="grid grid-cols-5 gap-1.5">
        <KunBtn
          v-for="r in radiusOptions"
          :key="r.id"
          :color="theme.radius === r.id ? 'primary' : 'neutral'"
          :variant="theme.radius === r.id ? 'solid' : 'outline'"
          size="xs"
          class="justify-center"
          @click="pickRadius(r.id)"
        >
          {{ r.name }}
        </KunBtn>
      </div>
    </div>

    <!-- Font -->
    <div class="space-y-1.5">
      <div class="text-[0.7rem] font-medium uppercase tracking-wide text-muted">Font</div>
      <KunSelect
        :model-value="fontValue"
        v-model:items="fontOptions"
        item-value="id"
        item-title="name"
        density="compact"
        @update:model-value="pickFont"
      />
    </div>

    <!-- Marca personalizada -->
    <div class="space-y-1.5 border-t border-muted pt-3">
      <div class="text-[0.7rem] font-medium uppercase tracking-wide text-muted">Marca personalizada (HEX)</div>
      <div class="flex items-end gap-1.5">
        <KunTextField v-model="customHex" label="Ej. #3B82F6" density="compact" class="flex-1 min-w-0" />
        <KunBtn color="success" size="sm" @click="applyCustomHex">Aplicar</KunBtn>
      </div>
    </div>

    <div class="border-t border-muted pt-3">
      <KunBtn color="neutral" variant="ghost" size="xs" class="w-full" @click="resetAll">
        Reset
      </KunBtn>
    </div>
  </div>
</template>
