<script setup lang="ts">
import { ref, computed } from 'vue'
import KunListItem from '../src/components/KunListItem.vue'
import type { KunListItemVariant, KunListItemDensity } from '../src/composables/kunListItemProps.js'
import { KUN_COLORS, KUN_VARIANTS, type KunColor } from '../../../theme/kunVariants.js'
import KunSwitch from '../../KunSwitch/src/components/KunSwitch.vue'
import KunSelect from '../../KunSelect/src/components/KunSelect.vue'
import KunTextField from '../../KunTextField/src/components/KunTextField.vue'

// ------------------------------------------------------------------
// Contenido (compartido por los 3 items)
// ------------------------------------------------------------------
const title = ref('Elemento demo')
const subtitle = ref('Subtítulo demo')

// ------------------------------------------------------------------
// v-model:selected compartido: un solo valor (null o el `value` del
// ítem) => SOLO el ítem seleccionado queda resaltado.
// ------------------------------------------------------------------
const selectedItem = ref<unknown>(null)

// ------------------------------------------------------------------
// Color x variante (matriz semántica de kunVariants.ts)
// ------------------------------------------------------------------
const colorRaw = ref('')
const colorOptions = ref([{ id: '', name: '(default: primary)' }, ...KUN_COLORS.map(c => ({ id: c, name: c }))])
const color = computed<KunColor | null>(() => (colorRaw.value === '' ? null : (colorRaw.value as KunColor)))

const variant = ref<KunListItemVariant>('ghost')
const variantOptions = ref(KUN_VARIANTS.map(v => ({ id: v, name: v })))

// ------------------------------------------------------------------
// Densidad
// ------------------------------------------------------------------
const density = ref<KunListItemDensity>('default')
const densityOptions = ref([
  { id: 'default', name: 'default' },
  { id: 'comfortable', name: 'comfortable' },
  { id: 'compact', name: 'compact' },
])

// ------------------------------------------------------------------
// Iconos / avatares (string libre: `$alias`, clase CSS o componente)
// ------------------------------------------------------------------
const prependIconRaw = ref('$star')
const appendIconRaw = ref('$menuDownOutline')
const prependIconProp = computed(() => (prependIconRaw.value === '' ? undefined : prependIconRaw.value))
const appendIconProp = computed(() => (appendIconRaw.value === '' ? undefined : appendIconRaw.value))
const prependAvatar = ref('')
const appendAvatar = ref('')
const prependAvatarProp = computed(() => (prependAvatar.value === '' ? undefined : prependAvatar.value))
const appendAvatarProp = computed(() => (appendAvatar.value === '' ? undefined : appendAvatar.value))

// ------------------------------------------------------------------
// Estado (se aplica a los 3 items por igual)
// ------------------------------------------------------------------
const active = ref(false)
const selectable = ref(false)
const disabled = ref(false)
const ripple = ref(true)
const tile = ref(false)
const noGutters = ref(false)

// ------------------------------------------------------------------
// Log de eventos en vivo
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
  if (eventLog.value.length > 8) eventLog.value.pop()
}
</script>

<template>
  <div class="p-4 grid gap-6 lg:grid-cols-2 lg:items-start">
    <!-- Vista previa (fija: siempre visible al scrollear opciones) -->
    <div class="space-y-3 min-w-0 lg:sticky lg:top-4">
      <h2 class="text-lg font-semibold">KunListItem</h2>

      <!-- Los 3 items tienen exactamente las mismas propiedades
           configuradas: reaccionan en vivo a hover, selección,
           disabled, ripple, etc. -->
      <KunListItem
        v-for="i in 3"
        :key="i"
        :value="`item-${i}`"
        v-model:selected="selectedItem"
        :title="title"
        :subtitle="subtitle"
        :color="color"
        :variant="variant"
        :density="density"
        :prepend-icon="prependIconProp"
        :append-icon="appendIconProp"
        :prepend-avatar="prependAvatarProp"
        :append-avatar="appendAvatarProp"
        :active="active"
        :selectable="selectable"
        :disabled="disabled"
        :ripple="ripple"
        :tile="tile"
        :no-gutters="noGutters"
        @click="logEvent('click', `item-${i}`)"
      />

      <div class="rounded-lg bg-muted p-3 text-sm">
        <div class="text-muted text-xs mb-1">v-model:selected en crudo</div>
        <div class="font-mono text-xs">{{ JSON.stringify(selectedItem) ?? 'null' }}</div>
        <div class="text-muted text-xs mt-1 mb-1">Últimos eventos</div>
        <ul v-if="eventLog.length" class="space-y-1 font-mono text-xs">
          <li v-for="e in eventLog" :key="e.id">
            <span class="font-semibold">{{ e.name }}</span>
            <span v-if="e.detail" class="text-muted"> — {{ e.detail }}</span>
          </li>
        </ul>
        <p v-else class="text-xs text-muted">Hacé clic en un ítem para ver eventos…</p>
      </div>
    </div>

    <!-- Panel de configuración (scroll propio) -->
    <div class="space-y-4 rounded-lg border border-default p-4 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto">
      <h3 class="text-sm font-semibold uppercase tracking-wide text-muted">Configuración</h3>

      <div class="grid grid-cols-2 gap-3 [&>*]:min-w-0">
        <p class="col-span-2 pt-2 text-xs font-semibold uppercase tracking-wide text-muted">Contenido</p>
        <KunTextField v-model="title" label="Title" density="compact" />
        <KunTextField v-model="subtitle" label="Subtitle" density="compact" />

        <p class="col-span-2 pt-2 text-xs font-semibold uppercase tracking-wide text-muted">Color y variante</p>
        <KunSelect
          v-model="colorRaw"
          v-model:items="colorOptions"
          label="Color"
          item-value="id"
          item-title="name"
          density="compact"
        />
        <KunSelect
          v-model="variant"
          v-model:items="variantOptions"
          label="Variant"
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

        <p class="col-span-2 pt-2 text-xs font-semibold uppercase tracking-wide text-muted">Iconos y avatares (vacío = sin icono)</p>
        <KunTextField v-model="prependIconRaw" label="Prepend icon ($alias, clase)" density="compact" />
        <KunTextField v-model="appendIconRaw" label="Append icon ($alias, clase)" density="compact" />
        <KunTextField v-model="prependAvatar" label="Prepend avatar URL" density="compact" />
        <KunTextField v-model="appendAvatar" label="Append avatar URL" density="compact" />

        <p class="col-span-2 pt-2 text-xs font-semibold uppercase tracking-wide text-muted">Estado</p>
        <KunSwitch v-model="active" label="Active" />
        <KunSwitch v-model="selectable" label="Selectable" />
        <KunSwitch v-model="disabled" label="Disabled" />
        <KunSwitch v-model="ripple" label="Ripple" />
        <KunSwitch v-model="tile" label="Tile (sin redondeo)" />
        <KunSwitch v-model="noGutters" label="No gutters" />
      </div>
    </div>
  </div>
</template>
