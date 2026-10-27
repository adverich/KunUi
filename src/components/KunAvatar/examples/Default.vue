<script setup lang="ts">
import { ref, computed } from 'vue'
import KunAvatar from '../src/components/KunAvatar.vue'
import { KUN_COLORS, KUN_VARIANTS, type KunColor, type KunVariant } from '../../../theme/kunVariants.js'
import type { KunAvatarBorder, KunAvatarDensity, KunAvatarSize } from '../src/composables/kunAvatarProps.js'
import KunBtn from '../../KunBtn/src/components/KunBtn.vue'
import KunIcon from '../../KunIcon/src/components/KunIcon.vue'
import KunSwitch from '../../KunSwitch/src/components/KunSwitch.vue'
import KunSelect from '../../KunSelect/src/components/KunSelect.vue'
import KunTextField from '../../KunTextField/src/components/KunTextField.vue'
import { KUN_SIZE_ORDER } from '../../../theme/kunSizes.js'

type RoundedMode = 'default' | 'circular' | 'off' | 'lg'

// ------------------------------------------------------------------
// Controles del playground (strings crudos -> computed undefined)
// para respetar `String` sin default (ausente = undefined, no null).
// ------------------------------------------------------------------
const imageRaw = ref('')
const iconRaw = ref('')
const textRaw = ref('KU')
const altRaw = ref('Avatar de ejemplo')
const colorRaw = ref('')
const colorOptions = ref([{ id: '', name: '(default: neutral · soft)' }, ...KUN_COLORS.map(c => ({ id: c, name: c }))])
const colorProp = computed<KunColor | null>(() => (colorRaw.value === '' ? null : colorRaw.value as KunColor))
const themeRaw = ref('')
const tagRaw = ref('div')
const borderRaw = ref('')
const borderOptions = ref([
  { id: '', name: '(sin borde)' },
  { id: 'true', name: 'true (border-default)' },
  { id: 'muted', name: 'muted' },
  { id: 'accented', name: 'accented' },
  { id: 'inverted', name: 'inverted' },
])
const borderProp = computed<KunAvatarBorder>(() => {
  if (borderRaw.value === '') return false
  if (borderRaw.value === 'true') return true
  return borderRaw.value as KunAvatarBorder
})

const variant = ref<KunVariant | null>(null)
const variantOptions = ref([
  { id: '', name: '(default: soft · neutral)' },
  ...KUN_VARIANTS.map(v => ({ id: v, name: v })),
])

const imageProp = computed(() => (imageRaw.value === '' ? undefined : imageRaw.value))
const iconProp = computed(() => (iconRaw.value === '' ? undefined : iconRaw.value))
const textProp = computed(() => (textRaw.value === '' ? undefined : textRaw.value))
const altProp = computed(() => (altRaw.value === '' ? undefined : altRaw.value))
const themeProp = computed(() => (themeRaw.value === '' ? undefined : themeRaw.value))
const tagProp = computed(() => (tagRaw.value === '' ? 'div' : tagRaw.value))

const size = ref<KunAvatarSize>('md')
const sizeOptions = ref([
  { id: 'xxs', name: 'xxs (24px)' },
  { id: 'xs', name: 'xs (28px)' },
  { id: 'sm', name: 'sm (32px)' },
  { id: 'md', name: 'md (36px)' },
  { id: 'lg', name: 'lg (40px)' },
  { id: 'xl', name: 'xl (48px)' },
  { id: 'xxl', name: 'xxl (56px)' },
  { id: '3xs', name: '3xs legacy (32px)' },
  { id: '2xs', name: '2xs legacy (36px)' },
  { id: '2xl', name: '2xl legacy (72px)' },
  { id: '3xl', name: '3xl legacy (80px)' },
])

const density = ref<KunAvatarDensity>('default')
const densityOptions = ref([
  { id: 'default', name: 'default' },
  { id: 'comfortable', name: 'comfortable' },
  { id: 'compact', name: 'compact' },
])

const roundedMode = ref<RoundedMode>('default')
const roundedOptions = ref([
  { id: 'default', name: 'default (rounded-full)' },
  { id: 'circular', name: 'circular (true)' },
  { id: 'off', name: 'off (false)' },
  { id: 'lg', name: 'lg (escala)' },
])
const roundedProp = computed((): string | number | boolean | undefined =>
  roundedMode.value === 'circular'
    ? true
    : roundedMode.value === 'off'
      ? false
      : roundedMode.value === 'lg'
        ? 'lg'
        : undefined,
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
          <p class="text-muted text-xs">Prioridad: imagen &gt; icono &gt; texto &gt; slot.</p>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <KunAvatar :image="demoImage" alt="Imagen" size="xs" />
        <KunAvatar icon="★" size="xs" />
        <KunAvatar :icon="demoSvgIcon" size="xs" />
        <KunAvatar text="JD" size="xs" />
        <KunAvatar size="xs">S</KunAvatar>
        <span class="text-xs text-muted">imagen · icono (texto) · icono (SVG) · texto · slot</span>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <KunAvatar icon="$star" size="xxs" />
        <KunAvatar icon="$star" size="md" />
        <KunAvatar icon="$star" size="xxl" />
        <span class="text-xs text-muted">ícono xxs · md · xxl</span>
      </div>

      <div class="rounded-lg border border-default p-3">
        <div class="text-muted text-xs mb-2">Override de una dimensión (sigue circular)</div>
        <div class="flex flex-wrap items-center gap-3">
          <KunAvatar icon="$star" size="md" class="w-16" />
          <KunAvatar icon="$star" size="md" class="h-16" />
          <KunAvatar icon="$star" size="md" class="h-14 w-14" />
          <span class="text-xs text-muted">w-16 / h-16 / h-14 w-14</span>
        </div>
      </div>
      <div class="rounded-lg border border-default p-3">
        <div class="text-muted text-xs mb-2">Consistencia (mismo size = mismo px)</div>
        <div class="flex flex-wrap items-end gap-3">
          <div v-for="s in KUN_SIZE_ORDER" :key="s" class="flex flex-col items-center gap-1">
            <div class="flex items-center gap-1">
              <KunAvatar icon="$star" :size="s" />
              <KunBtn :size="s" square color="primary">
                <KunIcon icon="$star" :size="s" />
              </KunBtn>
            </div>
            <span class="text-[10px] text-muted">{{ s }}</span>
          </div>
        </div>
      </div>

      <div class="rounded-lg bg-muted p-3 text-sm">
        <div class="text-muted text-xs mb-1">Fallback activo: {{ activeFallback }}</div>
        <div class="font-mono text-xs">size={{ JSON.stringify(size) }} density={{ JSON.stringify(density) }} rounded={{ JSON.stringify(roundedProp) }}</div>
      </div>

      <div class="rounded-lg bg-muted p-3 text-sm">
        <div class="text-muted text-xs mb-1">Últimos eventos</div>
        <ul v-if="eventLog.length" class="space-y-1 font-mono text-xs">
          <li v-for="e in eventLog" :key="e.id">
            <span class="font-semibold">{{ e.name }}</span>
            <span v-if="e.detail" class="text-muted"> — {{ e.detail }}</span>
          </li>
        </ul>
        <p v-else class="text-xs text-muted">Hacé click o hover sobre el avatar para ver eventos…</p>
      </div>
    </div>

    <!-- Panel de configuración (scroll propio: no arrastra el avatar) -->
    <div class="space-y-4 rounded-lg border border-default p-4 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto">
      <h3 class="text-sm font-semibold uppercase tracking-wide text-muted">Configuración</h3>

      <div class="grid grid-cols-2 gap-3 [&>*]:min-w-0">
        <KunTextField v-model="imageRaw" label="Image src (vacío = sin imagen)" density="compact" />
        <KunTextField v-model="altRaw" label="Alt" density="compact" />
        <KunTextField v-model="iconRaw" label="Icon (vacío = sin icono)" density="compact" />
        <KunTextField v-model="textRaw" label="Text (vacío = slot)" density="compact" />
        <KunSelect
          v-model="colorRaw"
          v-model:items="colorOptions"
          label="Color"
          density="compact"
        />
        <KunSelect
          v-model="borderRaw"
          v-model:items="borderOptions"
          label="Border (rol de token)"
          density="compact"
        />
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
