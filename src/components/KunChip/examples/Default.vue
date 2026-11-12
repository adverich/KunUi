<script setup lang="ts">
import { ref, computed } from 'vue'
import KunChip from '../src/components/KunChip.vue'
import type { KunChipDensity, KunChipRounded } from '../src/composables/kunChipProps.js'
import type { KunColor, KunVariant } from '../../../theme/kunVariants.js'
import KunSwitch from '../../KunSwitch/src/components/KunSwitch.vue'
import KunSelect from '../../KunSelect/src/components/KunSelect.vue'
import KunTextField from '../../KunTextField/src/components/KunTextField.vue'

// ------------------------------------------------------------------
// v-model principal: se muestra en crudo debajo del chip
// ------------------------------------------------------------------
const visible = ref(true)

// ------------------------------------------------------------------
// Contenido demo (datos genéricos)
// ------------------------------------------------------------------
const label = ref('Manzana')
const text = ref('')

// ------------------------------------------------------------------
// Uniones cerradas -> KunSelect con refs tipadas
// ------------------------------------------------------------------
const variant = ref<KunVariant>('solid')
const variantOptions = ref([
  { id: 'solid', name: 'solid' },
  { id: 'outline', name: 'outline' },
  { id: 'soft', name: 'soft' },
  { id: 'subtle', name: 'subtle' },
  { id: 'ghost', name: 'ghost' },
  { id: 'link', name: 'link' },
])

const density = ref<KunChipDensity>('default')
const densityOptions = ref([
  { id: 'default', name: 'default' },
  { id: 'comfortable', name: 'comfortable' },
  { id: 'compact', name: 'compact' },
])

// ------------------------------------------------------------------
// Color semantico + etiqueta de cierre
// ------------------------------------------------------------------
const color = ref<KunColor>('primary')
const colorOptions = ref([
  { id: 'primary', name: 'primary' },
  { id: 'secondary', name: 'secondary' },
  { id: 'success', name: 'success' },
  { id: 'error', name: 'error' },
  { id: 'neutral', name: 'neutral' },
])
const closeLabel = ref('Cerrar')
const pill = ref(false)
const roundedRaw = ref<'default' | KunChipRounded>('default')
const roundedOptions = ref([
  { id: 'default', name: 'default (píldora)' },
  { id: 'full', name: 'full (círculo 1:1)' },
  { id: 'none', name: 'none' },
])
const roundedProp = computed<KunChipRounded | null>(() => (roundedRaw.value === 'default' ? null : roundedRaw.value))

// ------------------------------------------------------------------
// Iconos y enlace (aceptan null: vacío = null)
// ------------------------------------------------------------------
const prependIcon = ref('ri-apple-line')
const appendIcon = ref('')
const toRaw = ref('')
const hrefRaw = ref('')
const target = ref('')
const toProp = computed(() => (toRaw.value === '' ? null : toRaw.value))
const hrefProp = computed(() => (hrefRaw.value === '' ? null : hrefRaw.value))
const targetProp = computed(() => (target.value === '' ? null : target.value))

// ------------------------------------------------------------------
// Booleanos -> KunSwitch
// ------------------------------------------------------------------
const clickable = ref(true)
const closable = ref(true)
const disabled = ref(false)
const replace = ref(false)

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
    <!-- Vista previa + v-model (fija: siempre visible al scrollear opciones) -->
    <div class="space-y-3 min-w-0 lg:sticky lg:top-4">
      <h2 class="text-lg font-semibold">KunChip</h2>

      <div class="flex min-h-12 items-center gap-3">
        <KunChip
          v-model="visible"
          :label="label || null"
          :text="text || null"
          :color="color"
          :close-label="closeLabel"
          :variant="variant"
          :pill="pill"
          :rounded="roundedProp"
          :clickable="clickable"
          :closable="closable"
          :disabled="disabled"
          :density="density"
          :prepend-icon="prependIcon || null"
          :append-icon="appendIcon || null"
          :to="toProp"
          :href="hrefProp"
          :target="targetProp"
          :replace="replace"
          @update:model-value="logEvent('update:modelValue', $event)"
          @click:close="logEvent('click:close', 'botón cerrar')"
          @click="logEvent('click', 'click en el chip')"
        />
        <button
          v-if="!visible"
          type="button"
          class="px-3 py-1.5 text-sm rounded-lg border border-default"
          @click="visible = true; logEvent('reset', 'chip restaurado')"
        >
          Restablecer
        </button>
      </div>

      <div class="flex items-center gap-3 text-xs text-muted">
        <KunChip label="1" rounded="full" :closable="false" />
        <KunChip label="99" rounded="full" :closable="false" />
        <KunChip label="100" rounded="full" :closable="false" />
        <span>1 / 99 / 100 (círculo 1:1)</span>
      </div>

      <div class="rounded-lg bg-muted p-3 font-mono text-sm">
        <div class="text-muted text-xs mb-1">v-model en crudo</div>
        <div>{{ JSON.stringify(visible) }} <span class="text-muted">({{ typeof visible }})</span></div>
      </div>

      <div class="rounded-lg bg-muted p-3 text-sm">
        <div class="text-muted text-xs mb-1">Últimos eventos</div>
        <ul v-if="eventLog.length" class="space-y-1 font-mono text-xs">
          <li v-for="e in eventLog" :key="e.id">
            <span class="font-semibold">{{ e.name }}</span>
            <span v-if="e.detail" class="text-muted"> — {{ e.detail }}</span>
          </li>
        </ul>
        <p v-else class="text-xs text-muted">Interactuá con el chip para ver eventos…</p>
      </div>
    </div>

    <!-- Panel de configuración (scroll propio: no arrastra el chip) -->
    <div class="space-y-4 rounded-lg border border-default p-4 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto">
      <h3 class="text-sm font-semibold uppercase tracking-wide text-muted">Configuración</h3>

      <div class="grid grid-cols-2 gap-3 [&>*]:min-w-0">
        <p class="col-span-2 pt-2 text-xs font-semibold uppercase tracking-wide text-muted">Contenido</p>
        <KunTextField v-model="label" label="Label (vacío = null)" density="compact" />
        <KunTextField v-model="text" label="Text alias (vacío = null)" density="compact" />
        <KunTextField v-model="closeLabel" label="Close label" density="compact" />

        <p class="col-span-2 pt-2 text-xs font-semibold uppercase tracking-wide text-muted">Variante y densidad</p>
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
          v-model="color"
          v-model:items="colorOptions"
          label="Color"
          item-value="id"
          item-title="name"
          density="compact"
        />
        <KunSwitch v-model="pill" label="Pill (reservada, sin efecto)" />
        <KunSelect
          v-model="roundedRaw"
          v-model:items="roundedOptions"
          label="Rounded"
          item-value="id"
          item-title="name"
          density="compact"
        />

        <p class="col-span-2 pt-2 text-xs font-semibold uppercase tracking-wide text-muted">Iconos</p>
        <KunTextField v-model="prependIcon" label="Prepend icon (vacío = null)" density="compact" />
        <KunTextField v-model="appendIcon" label="Append icon (vacío = null)" density="compact" />

        <p class="col-span-2 pt-2 text-xs font-semibold uppercase tracking-wide text-muted">Enlace</p>
        <KunTextField v-model="toRaw" label="To (vacío = null)" density="compact" />
        <KunTextField v-model="hrefRaw" label="Href (vacío = null)" density="compact" />
        <KunTextField v-model="target" label="Target (vacío = null)" density="compact" />
        <KunSwitch v-model="replace" label="Replace (solo con to)" />

        <p class="col-span-2 pt-2 text-xs font-semibold uppercase tracking-wide text-muted">Estado</p>
        <KunSwitch v-model="clickable" label="Clickable" />
        <KunSwitch v-model="closable" label="Closable" />
        <KunSwitch v-model="disabled" label="Disabled" />
      </div>
    </div>
  </div>
</template>
