<script setup lang="ts">
import { ref, computed } from 'vue'
import KunBtn from '../../KunBtn/src/components/KunBtn.vue'
import KunSelect from '../../KunSelect/src/components/KunSelect.vue'
import KunSwitch from '../../KunSwitch/src/components/KunSwitch.vue'
import KunTextField from '../../KunTextField/src/components/KunTextField.vue'
import KunThemeConfigurator from '../../../theme/KunThemeConfigurator.vue'
import {
  kunTheme,
  useKunTheme,
  contrastOnWhite,
  type KunColorMode,
} from '../../../theme/kunTheme.js'

const theme = useKunTheme()

const previewText = ref('')
const previewSelect = ref<string | null>('primary')
const previewItems = ref([
  { id: 'primary', name: 'primary' },
  { id: 'secondary', name: 'secondary' },
  { id: 'success', name: 'success' },
  { id: 'error', name: 'error' },
])
const lastAction = ref('—')

function onThemeChange(message: string): void {
  lastAction.value = message
}
function pickMode(value: unknown): void {
  const mode = value as KunColorMode
  kunTheme.setColorMode(mode)
  lastAction.value = `colorMode → ${mode}`
}

// Las custom properties guardan alias (`var(...)`) sin resolver: el ratio solo
// se calcula cuando hay un HEX concreto.
const themeTick = computed(() => `${theme.primary}|${theme.neutral}|${lastAction.value}`)
const primary500 = computed(() => {
  void themeTick.value
  const el = typeof document === 'undefined' ? null : document.documentElement
  return el ? getComputedStyle(el).getPropertyValue('--kun-color-primary-500').trim() : ''
})
const contrastRatio = computed(() => {
  if (!primary500.value || primary500.value.startsWith('var(')) return 'alias sin resolver (ver en navegador)'
  return `${contrastOnWhite(primary500.value).toFixed(2)} : 1 (stop 500 vs blanco · AA ≥ 4.5)`
})

const snippet = computed(() => `import { kunTheme } from 'adverich-kun-ui'

kunTheme.configure({
  primary: '${theme.primary}',
  neutral: '${theme.neutral}',
  radius: '${theme.radius}',
  colorMode: '${theme.colorMode}',
})`)
</script>

<template>
  <div class="p-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
    <!-- Configurador -->
    <section class="order-2 lg:order-1 rounded-lg border border-default bg-default">
      <header class="flex items-center justify-between gap-3 border-b border-muted px-4 py-3">
        <div>
          <h2 class="text-lg font-semibold text-highlighted">Theme</h2>
          <p class="text-xs text-muted">Personalizá KunUI en runtime. Se persiste en localStorage.</p>
        </div>
      </header>
      <KunThemeConfigurator @change="onThemeChange" />
    </section>

    <!-- Preview -->
    <aside class="order-1 lg:order-2 space-y-4 lg:sticky lg:top-4">
      <div class="rounded-lg ring ring-accented bg-muted p-4 space-y-4">
        <div class="text-xs font-medium uppercase tracking-wide text-muted">Preview</div>

        <div class="flex flex-wrap gap-2">
          <KunBtn color="primary">Primary</KunBtn>
          <KunBtn color="primary" variant="outline">Outline</KunBtn>
          <KunBtn color="primary" variant="soft">Soft</KunBtn>
          <KunBtn color="primary" variant="ghost">Ghost</KunBtn>
        </div>
        <div class="flex flex-wrap gap-2">
          <KunBtn color="secondary" size="sm">Secondary</KunBtn>
          <KunBtn color="success" size="sm">Success</KunBtn>
          <KunBtn color="warning" size="sm">Warning</KunBtn>
          <KunBtn color="error" size="sm">Error</KunBtn>
          <KunBtn color="neutral" variant="outline" size="sm">Neutral</KunBtn>
        </div>

        <KunTextField v-model="previewText" label="Campo con foco (label = primary)" />
        <KunSelect v-model="previewSelect" v-model:items="previewItems" item-value="id" item-title="name" label="Select" />

        <div class="flex items-center justify-between rounded-lg ring ring-accented bg-elevated px-3 py-2">
          <span class="text-sm text-default">Dark</span>
          <KunSwitch
            :model-value="theme.colorMode === 'dark'"
            @update:model-value="pickMode($event ? 'dark' : 'light')"
          />
        </div>
      </div>

      <div class="rounded-lg bg-muted p-3 font-mono text-xs text-muted space-y-1">
        <div>primary={{ theme.primary }} · neutral={{ theme.neutral }}</div>
        <div>radius={{ theme.radius }} · mode={{ theme.colorMode }}</div>
        <div>--kun-color-primary-500: {{ primary500 || '(sin leer)' }}</div>
        <div>contraste: {{ contrastRatio }}</div>
        <div>último: {{ lastAction }}</div>
      </div>

      <div class="rounded-lg bg-muted p-3 font-mono text-xs whitespace-pre text-muted">{{ snippet }}</div>
    </aside>
  </div>
</template>
