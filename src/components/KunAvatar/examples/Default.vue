<script setup lang="ts">
import { ref, computed } from 'vue'
import KunAvatar from '../src/components/KunAvatar.vue'
import type { KunAvatarDensity, KunAvatarVariant } from '../src/composables/kunAvatarProps.js'
import KunSwitch from '../../KunSwitch/src/components/KunSwitch.vue'
import KunSelect from '../../KunSelect/src/components/KunSelect.vue'
import KunTextField from '../../KunTextField/src/components/KunTextField.vue'

// ------------------------------------------------------------------
// Tipos locales para controles sin unión exportada en props
// (size acepta strings libres y números; rounded se mapea abajo).
// ------------------------------------------------------------------
type KunAvatarSize = 'x-small' | 'small' | 'default' | 'large' | 'x-large'
type RoundedMode = 'default' | 'circular' | 'off'

// ------------------------------------------------------------------
// Controles del playground (strings crudos -> computed undefined)
// para respetar `String` sin default (ausente = undefined, no null).
// ------------------------------------------------------------------
const imageRaw = ref('')
const iconRaw = ref('')
const textRaw = ref('KU')
const altRaw = ref('Avatar de ejemplo')
const colorRaw = ref('')
const themeRaw = ref('')
const tagRaw = ref('div')
const borderRaw = ref('')

const variant = ref<KunAvatarVariant>('flat')
const variantOptions = ref([
  { id: 'flat', name: 'flat (fondo pleno)' },
  { id: 'outlined', name: 'outlined (transparente con borde)' },
  { id: 'tonal', name: 'tonal (fondo suave)' },
  { id: 'text', name: 'text (transparente)' },
])

const imageProp = computed(() => (imageRaw.value === '' ? undefined : imageRaw.value))
const iconProp = computed(() => (iconRaw.value === '' ? undefined : iconRaw.value))
const textProp = computed(() => (textRaw.value === '' ? undefined : textRaw.value))
const altProp = computed(() => (altRaw.value === '' ? undefined : altRaw.value))
const colorProp = computed(() => (colorRaw.value === '' ? undefined : colorRaw.value))
const themeProp = computed(() => (themeRaw.value === '' ? undefined : themeRaw.value))
const tagProp = computed(() => (tagRaw.value === '' ? 'div' : tagRaw.value))
const borderProp = computed((): string | boolean => (borderRaw.value === '' ? false : borderRaw.value))

const size = ref<KunAvatarSize>('default')
const sizeOptions = ref([
  { id: 'x-small', name: 'x-small' },
  { id: 'small', name: 'small' },
  { id: 'default', name: 'default' },
  { id: 'large', name: 'large' },
  { id: 'x-large', name: 'x-large' },
])

const density = ref<KunAvatarDensity>('default')
const densityOptions = ref([
  { id: 'default', name: 'default' },
  { id: 'comfortable', name: 'comfortable' },
  { id: 'compact', name: 'compact' },
])

const roundedMode = ref<RoundedMode>('default')
const roundedOptions = ref([
  { id: 'default', name: 'default (undefined)' },
  { id: 'circular', name: 'circular (true)' },
  { id: 'off', name: 'off (false)' },
])
const roundedProp = computed((): string | number | boolean | undefined =>
  roundedMode.value === 'circular' ? true : roundedMode.value === 'off' ? false : undefined,
)

const end = ref(false)
const start = ref(false)
const tile = ref(false)

// Imagen autocontenida (sin dependencia de red) para la fila de fallbacks.
const demoImage =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='128' height='128'><rect width='128' height='128' fill='%233b82f6'/><text x='64' y='84' font-size='56' text-anchor='middle' fill='white'>KU</text></svg>"

// SVG inline para demostrar la rama KunIcon (alias `$`, componente o SVG).
const demoSvgIcon =
  "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'><path d='M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.2l7.1-.6z'/></svg>"

const activeFallback = computed(() =>
  imageProp.value ? 'imagen' : iconProp.value ? 'icono' : textProp.value ? 'texto' : 'slot',
)

// ------------------------------------------------------------------
// Log de eventos en vivo (el componente emite click/hover/contextmenu/focus)
// ------------------------------------------------------------------
interface LoggedEvent {
  id: number;
  name: string;
  detail: string;
}
let eventSeq = 0
const eventLog = ref<LoggedEvent[]>([])

function logEvent(name: string, detail: unknown): void {
  eventSeq += 1
  eventLog.value.unshift({ id: eventSeq, name, detail: String(detail ?? '') })
  if (eventLog.value.length > 6) eventLog.value.pop()
}
</script>

<template>
  <div class="p-4 grid gap-6 lg:grid-cols-2 lg:items-start">
    <!-- Vista previa (fija: siempre visible al scrollear opciones) -->
    <div class="space-y-3 min-w-0 lg:sticky lg:top-4">
      <h2 class="text-lg font-semibold">KunAvatar</h2>

      <div class="flex items-center gap-4">
        <KunAvatar
          :image="imageProp"
          :icon="iconProp"
          :text="textProp"
          :alt="altProp"
          :size="size"
          :rounded="roundedProp"
          :border="borderProp"
          :color="colorProp"
          :density="density"
          :end="end"
          :start="start"
          :tag="tagProp"
          :theme="themeProp"
          :tile="tile"
          :variant="variant"
          @click="logEvent('click', 'click')"
          @hover="logEvent('hover', 'hover')"
          @contextmenu="logEvent('contextmenu', 'click derecho')"
          @focus="logEvent('focus', '')"
        />
        <div class="min-w-0 text-sm">
          <div class="font-medium">Demo interactiva</div>
          <p class="text-ui-muted text-xs">Prioridad: imagen &gt; icono &gt; texto &gt; slot.</p>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <KunAvatar :image="demoImage" alt="Imagen" size="small" />
        <KunAvatar icon="★" size="small" />
        <KunAvatar :icon="demoSvgIcon" size="small" />
        <KunAvatar text="JD" size="small" />
        <KunAvatar size="small">S</KunAvatar>
        <span class="text-xs text-ui-muted">imagen · icono (texto) · icono (SVG) · texto · slot</span>
      </div>

      <div class="rounded-lg bg-surface p-3 text-sm">
        <div class="text-ui-muted text-xs mb-1">Fallback activo: {{ activeFallback }}</div>
        <div class="font-mono text-xs">size={{ JSON.stringify(size) }} density={{ JSON.stringify(density) }} rounded={{ JSON.stringify(roundedProp) }}</div>
      </div>

      <div class="rounded-lg bg-surface p-3 text-sm">
        <div class="text-ui-muted text-xs mb-1">Últimos eventos</div>
        <ul v-if="eventLog.length" class="space-y-1 font-mono text-xs">
          <li v-for="e in eventLog" :key="e.id">
            <span class="font-semibold">{{ e.name }}</span>
            <span v-if="e.detail" class="text-ui-muted"> — {{ e.detail }}</span>
          </li>
        </ul>
        <p v-else class="text-xs text-ui-muted">Hacé click o hover sobre el avatar para ver eventos…</p>
      </div>
    </div>

    <!-- Panel de configuración (scroll propio: no arrastra el avatar) -->
    <div class="space-y-4 rounded-xl border border-ui p-4 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto">
      <h3 class="text-sm font-semibold uppercase tracking-wide text-ui-muted">Configuración</h3>

      <div class="grid grid-cols-2 gap-3 [&>*]:min-w-0">
        <KunTextField v-model="imageRaw" label="Image src (vacío = sin imagen)" density="compact" />
        <KunTextField v-model="altRaw" label="Alt" density="compact" />
        <KunTextField v-model="iconRaw" label="Icon (vacío = sin icono)" density="compact" />
        <KunTextField v-model="textRaw" label="Text (vacío = slot)" density="compact" />
        <KunTextField v-model="colorRaw" label="Color (bg-*, vacío = default)" density="compact" />
        <KunTextField v-model="borderRaw" label="Border (vacío = false)" density="compact" />
        <KunTextField v-model="tagRaw" label="Tag" density="compact" />
        <KunSelect
          v-model="variant"
          v-model:items="variantOptions"
          label="Variant"
          item-value="id"
          item-title="name"
          density="compact"
        />
        <KunTextField v-model="themeRaw" label="Theme (vacío = undefined)" density="compact" />

        <KunSelect
          v-model="size"
          v-model:items="sizeOptions"
          label="Size"
          item-value="id"
          item-title="name"
          density="compact"
        />
        <KunSelect
          v-model="density"
          v-model:items="densityOptions"
          label="Density"
          item-value="id"
          item-title="name"
          density="compact"
        />
        <KunSelect
          v-model="roundedMode"
          v-model:items="roundedOptions"
          label="Rounded"
          item-value="id"
          item-title="name"
          density="compact"
        />

        <KunSwitch v-model="tile" label="Tile" />
        <KunSwitch v-model="start" label="Start" />
        <KunSwitch v-model="end" label="End" />
      </div>
    </div>
  </div>
</template>
