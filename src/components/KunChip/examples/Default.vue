<script setup lang="ts">
import { ref, computed } from 'vue'
import KunChip from '../src/components/KunChip.vue'
import type { KunChipVariant, KunChipDensity } from '../src/composables/kunChipProps.js'
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
const variant = ref<KunChipVariant>('default')
const variantOptions = ref([
  { id: 'default', name: 'default' },
  { id: 'outlined', name: 'outlined' },
  { id: 'flat', name: 'flat' },
  { id: 'pill', name: 'pill' },
])

const density = ref<KunChipDensity>('default')
const densityOptions = ref([
  { id: 'default', name: 'default' },
  { id: 'comfortable', name: 'comfortable' },
  { id: 'compact', name: 'compact' },
])

// ------------------------------------------------------------------
// Colores y etiqueta de cierre (String puro: directo)
// ------------------------------------------------------------------
const color = ref('bg-button')
const textColor = ref('text-ui')
const closeLabel = ref('Cerrar')

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
          :text-color="textColor"
          :close-label="closeLabel"
          :variant="variant"
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
          class="px-3 py-1.5 text-sm rounded border border-ui"
          @click="visible = true; logEvent('reset', 'chip restaurado')"
        >
          Restablecer
        </button>
      </div>

      <div class="rounded-lg bg-surface p-3 font-mono text-sm">
        <div class="text-ui-muted text-xs mb-1">v-model en crudo</div>
        <div>{{ JSON.stringify(visible) }} <span class="text-ui-muted">({{ typeof visible }})</span></div>
      </div>

      <div class="rounded-lg bg-surface p-3 text-sm">
        <div class="text-ui-muted text-xs mb-1">Últimos eventos</div>
        <ul v-if="eventLog.length" class="space-y-1 font-mono text-xs">
          <li v-for="e in eventLog" :key="e.id">
            <span class="font-semibold">{{ e.name }}</span>
            <span v-if="e.detail" class="text-ui-muted"> — {{ e.detail }}</span>
          </li>
        </ul>
        <p v-else class="text-xs text-ui-muted">Interactuá con el chip para ver eventos…</p>
      </div>
    </div>

    <!-- Panel de configuración (scroll propio: no arrastra el chip) -->
    <div class="space-y-4 rounded-xl border border-ui p-4 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto">
      <h3 class="text-sm font-semibold uppercase tracking-wide text-ui-muted">Configuración</h3>

      <div class="grid grid-cols-2 gap-3 [&>*]:min-w-0">
        <p class="col-span-2 pt-2 text-xs font-semibold uppercase tracking-wide text-ui-muted">Contenido</p>
        <KunTextField v-model="label" label="Label (vacío = null)" density="compact" />
        <KunTextField v-model="text" label="Text alias (vacío = null)" density="compact" />
        <KunTextField v-model="closeLabel" label="Close label" density="compact" />

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
        <KunTextField v-model="color" label="Color (fondo)" density="compact" />
        <KunTextField v-model="textColor" label="Text color" density="compact" />

        <p class="col-span-2 pt-2 text-xs font-semibold uppercase tracking-wide text-ui-muted">Iconos</p>
        <KunTextField v-model="prependIcon" label="Prepend icon (vacío = null)" density="compact" />
        <KunTextField v-model="appendIcon" label="Append icon (vacío = null)" density="compact" />

        <p class="col-span-2 pt-2 text-xs font-semibold uppercase tracking-wide text-ui-muted">Enlace</p>
        <KunTextField v-model="toRaw" label="To (vacío = null)" density="compact" />
        <KunTextField v-model="hrefRaw" label="Href (vacío = null)" density="compact" />
        <KunTextField v-model="target" label="Target (vacío = null)" density="compact" />
        <KunSwitch v-model="replace" label="Replace (solo con to)" />

        <p class="col-span-2 pt-2 text-xs font-semibold uppercase tracking-wide text-ui-muted">Estado</p>
        <KunSwitch v-model="clickable" label="Clickable" />
        <KunSwitch v-model="closable" label="Closable" />
        <KunSwitch v-model="disabled" label="Disabled" />
      </div>
    </div>
  </div>
</template>
