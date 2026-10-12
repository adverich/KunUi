<script setup lang="ts">
import { ref, computed } from 'vue'
import KunCard from '../src/components/KunCard.vue'
import type { KunCardVariant, KunCardDensity, KunCardRounded, KunCardElevation } from '../src/composables/kunCardProps.js'
import KunSwitch from '../../KunSwitch/src/components/KunSwitch.vue'
import KunSelect from '../../KunSelect/src/components/KunSelect.vue'
import KunTextField from '../../KunTextField/src/components/KunTextField.vue'

// ------------------------------------------------------------------
// Contenido demo (datos genéricos)
// ------------------------------------------------------------------
const title = ref('Frutas de estación')
const subtitle = ref('Huerta · Marzo')
const text = ref('Manzanas, peras y bananas recién cosechadas. Esta tarjeta muestra el título, el texto del cuerpo, un bloque de imagen y una fila de acciones. El texto es lo bastante largo como para probar el modo scrollable con una altura fija.')
const titleSize = ref('')
const image = ref('https://picsum.photos/seed/kun-card/640/360')
const showImage = ref(true)

// ------------------------------------------------------------------
// Uniones cerradas -> KunSelect con refs tipadas
// ------------------------------------------------------------------
const variant = ref<KunCardVariant>('elevated')
const variantOptions = ref([
  { id: 'elevated', name: 'elevated' },
  { id: 'outlined', name: 'outlined' },
  { id: 'flat', name: 'flat' },
  { id: 'tonal', name: 'tonal' },
  { id: 'text', name: 'text' },
  { id: 'plain', name: 'plain' },
])

const density = ref<KunCardDensity>('default')
const densityOptions = ref([
  { id: 'default', name: 'default' },
  { id: 'comfortable', name: 'comfortable' },
  { id: 'compact', name: 'compact' },
])

const rounded = ref<KunCardRounded>(true)
const roundedOptions = ref([
  { id: true, name: 'true (rounded-lg)' },
  { id: false, name: 'false (sin redondeo)' },
  { id: 'sm', name: 'sm' },
  { id: 'md', name: 'md' },
  { id: 'lg', name: 'lg' },
  { id: 'xl', name: 'xl' },
])

const elevation = ref<KunCardElevation>(1)
const elevationOptions = ref([
  { id: 0, name: '0 (sin sombra)' },
  { id: 1, name: '1' },
  { id: 2, name: '2' },
  { id: 3, name: '3' },
  { id: 4, name: '4' },
  { id: 5, name: '5' },
])

// ------------------------------------------------------------------
// Texto / color / tag
// ------------------------------------------------------------------
const textColor = ref('text-ui')
const bgColor = ref('bg-white')
const outlineColor = ref('border-ui')
const tag = ref('div')

// ------------------------------------------------------------------
// Medidas (string | null: vacío = null)
// ------------------------------------------------------------------
const height = ref('240px')
const width = ref('')
const maxHeight = ref('')
const maxWidth = ref('')
const minHeight = ref('')
const minWidth = ref('')
const position = ref('')

// ------------------------------------------------------------------
// Header: iconos y avatares (string | null: vacío = null)
// ------------------------------------------------------------------
const prependIcon = ref('ri-apple-line')
const appendIcon = ref('')
const prependAvatar = ref('')
const appendAvatar = ref('')

// ------------------------------------------------------------------
// Enlace (to/href sin default: vacío = undefined)
// ------------------------------------------------------------------
const toRaw = ref('')
const hrefRaw = ref('')
const toProp = computed(() => (toRaw.value === '' ? undefined : toRaw.value))
const hrefProp = computed(() => (hrefRaw.value === '' ? undefined : hrefRaw.value))
const replace = ref(false)

// ------------------------------------------------------------------
// Booleanos -> KunSwitch
// ------------------------------------------------------------------
const flat = ref(false)
const outlined = ref(true)
const disabled = ref(false)
const ripple = ref(true)
const loading = ref(false)
const tile = ref(false)
const hover = ref(false)
const scrollable = ref(false)

// ------------------------------------------------------------------
// Log de eventos en vivo (KunCard no emite; se registra el click)
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
    <!-- Vista previa + estado (fija: siempre visible al scrollear opciones) -->
    <div class="space-y-3 min-w-0 lg:sticky lg:top-4">
      <h2 class="text-lg font-semibold">KunCard</h2>

      <KunCard
        :title="title || null"
        :title-size="titleSize || null"
        :subtitle="subtitle || null"
        :text="text || null"
        :text-color="textColor"
        :bg-color="bgColor"
        :flat="flat"
        :rounded="rounded"
        :outlined="outlined"
        :outline-color="outlineColor"
        :elevation="elevation"
        :to="toProp"
        :href="hrefProp"
        :replace="replace"
        :tag="tag"
        :disabled="disabled"
        :ripple="ripple"
        :variant="variant"
        :height="height || null"
        :width="width || null"
        :max-height="maxHeight || null"
        :max-width="maxWidth || null"
        :min-height="minHeight || null"
        :min-width="minWidth || null"
        :position="position || null"
        :prepend-icon="prependIcon || null"
        :append-icon="appendIcon || null"
        :prepend-avatar="prependAvatar || null"
        :append-avatar="appendAvatar || null"
        :image="showImage ? (image || null) : null"
        :loading="loading"
        :density="density"
        :tile="tile"
        :hover="hover"
        :scrollable="scrollable"
        @click="logEvent('click', 'click en la tarjeta')"
      >
        <template #actions>
          <button
            type="button"
            class="px-3 py-1.5 text-sm rounded border border-ui"
            @click="logEvent('action', 'Cancelar')"
          >
            Cancelar
          </button>
          <button
            type="button"
            class="px-3 py-1.5 text-sm rounded bg-primary text-white"
            @click="logEvent('action', 'Aceptar')"
          >
            Aceptar
          </button>
        </template>
      </KunCard>

      <div class="rounded-lg bg-surface p-3 font-mono text-sm">
        <div class="text-ui-muted text-xs mb-1">Estado en crudo</div>
        <div>{{ JSON.stringify({ title, variant, density, loading, scrollable }) }}</div>
      </div>

      <div class="rounded-lg bg-surface p-3 text-sm">
        <div class="text-ui-muted text-xs mb-1">Últimos eventos</div>
        <ul v-if="eventLog.length" class="space-y-1 font-mono text-xs">
          <li v-for="e in eventLog" :key="e.id">
            <span class="font-semibold">{{ e.name }}</span>
            <span v-if="e.detail" class="text-ui-muted"> — {{ e.detail }}</span>
          </li>
        </ul>
        <p v-else class="text-xs text-ui-muted">Hacé click en la tarjeta o en sus acciones para ver eventos…</p>
      </div>
    </div>

    <!-- Panel de configuración (scroll propio: no arrastra la tarjeta) -->
    <div class="space-y-4 rounded-xl border border-ui p-4 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto">
      <h3 class="text-sm font-semibold uppercase tracking-wide text-ui-muted">Configuración</h3>

      <div class="grid grid-cols-2 gap-3 [&>*]:min-w-0">
        <p class="col-span-2 pt-2 text-xs font-semibold uppercase tracking-wide text-ui-muted">Contenido</p>
        <KunTextField v-model="title" label="Title (vacío = null)" density="compact" />
        <KunTextField v-model="subtitle" label="Subtitle (vacío = null)" density="compact" />
        <KunTextField v-model="text" label="Text (vacío = null)" density="compact" />
        <KunTextField v-model="titleSize" label="Title size (vacío = null)" density="compact" />
        <KunTextField v-model="image" label="Image URL" density="compact" />
        <KunSwitch v-model="showImage" label="Mostrar imagen" />

        <p class="col-span-2 pt-2 text-xs font-semibold uppercase tracking-wide text-ui-muted">Variante y densidad</p>
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
        <KunSelect
          v-model="rounded"
          v-model:items="roundedOptions"
          label="Rounded"
          item-value="id"
          item-title="name"
          density="compact"
        />
        <KunSelect
          v-model="elevation"
          v-model:items="elevationOptions"
          label="Elevation"
          item-value="id"
          item-title="name"
          density="compact"
        />

        <p class="col-span-2 pt-2 text-xs font-semibold uppercase tracking-wide text-ui-muted">Colores y tag</p>
        <KunTextField v-model="textColor" label="Text color" density="compact" />
        <KunTextField v-model="bgColor" label="Background color" density="compact" />
        <KunTextField v-model="outlineColor" label="Outline color" density="compact" />
        <KunTextField v-model="tag" label="Tag" density="compact" />

        <p class="col-span-2 pt-2 text-xs font-semibold uppercase tracking-wide text-ui-muted">Medidas (vacío = null)</p>
        <KunTextField v-model="height" label="Height (ej. 240px)" density="compact" />
        <KunTextField v-model="width" label="Width (ej. 320px)" density="compact" />
        <KunTextField v-model="maxHeight" label="Max height" density="compact" />
        <KunTextField v-model="maxWidth" label="Max width" density="compact" />
        <KunTextField v-model="minHeight" label="Min height" density="compact" />
        <KunTextField v-model="minWidth" label="Min width" density="compact" />
        <KunTextField v-model="position" label="Position (clase Tailwind)" density="compact" />

        <p class="col-span-2 pt-2 text-xs font-semibold uppercase tracking-wide text-ui-muted">Header: iconos y avatares</p>
        <KunTextField v-model="prependIcon" label="Prepend icon (vacío = null)" density="compact" />
        <KunTextField v-model="appendIcon" label="Append icon (vacío = null)" density="compact" />
        <KunTextField v-model="prependAvatar" label="Prepend avatar URL" density="compact" />
        <KunTextField v-model="appendAvatar" label="Append avatar URL" density="compact" />

        <p class="col-span-2 pt-2 text-xs font-semibold uppercase tracking-wide text-ui-muted">Enlace</p>
        <KunTextField v-model="toRaw" label="To (vacío = sin ruta)" density="compact" />
        <KunTextField v-model="hrefRaw" label="Href (vacío = sin URL)" density="compact" />
        <KunSwitch v-model="replace" label="Replace (solo con to)" />

        <p class="col-span-2 pt-2 text-xs font-semibold uppercase tracking-wide text-ui-muted">Estado</p>
        <KunSwitch v-model="flat" label="Flat (sin sombra)" />
        <KunSwitch v-model="outlined" label="Outlined" />
        <KunSwitch v-model="disabled" label="Disabled" />
        <KunSwitch v-model="ripple" label="Ripple" />
        <KunSwitch v-model="loading" label="Loading" />
        <KunSwitch v-model="tile" label="Tile (sin redondeo)" />
        <KunSwitch v-model="hover" label="Hover (sombra al pasar)" />
        <KunSwitch v-model="scrollable" label="Scrollable" />
      </div>
    </div>
  </div>
</template>
