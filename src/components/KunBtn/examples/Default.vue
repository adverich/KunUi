<script setup lang="ts">
import { ref, computed } from 'vue'
import KunBtn from '../src/components/KunBtn.vue'
import type { KunBtnVariant, KunBtnSize, KunBtnType } from '../src/composables/kunBtnProps.js'
import KunSwitch from '../../KunSwitch/src/components/KunSwitch.vue'
import KunSelect from '../../KunSelect/src/components/KunSelect.vue'
import KunTextField from '../../KunTextField/src/components/KunTextField.vue'

// ------------------------------------------------------------------
// Contador de clicks + último evento (en lugar del panel v-model)
// ------------------------------------------------------------------
const clicks = ref(0)
const lastEvent = ref('—')

// ------------------------------------------------------------------
// Controles del playground: uniones tipadas con los tipos exportados
// ------------------------------------------------------------------
const variant = ref<KunBtnVariant>('default')
const variantOptions = ref([
  { id: 'default', name: 'default' },
  { id: 'tonal', name: 'tonal' },
  { id: 'plain', name: 'plain' },
  { id: 'outlined', name: 'outlined' },
  { id: 'soft', name: 'soft' },
  { id: 'text', name: 'text' },
])

const size = ref<KunBtnSize>('md')
const sizeOptions = ref([
  { id: 'xxs', name: 'xxs' },
  { id: 'xs', name: 'xs' },
  { id: 'sm', name: 'sm' },
  { id: 'md', name: 'md' },
  { id: 'lg', name: 'lg' },
  { id: 'xl', name: 'xl' },
  { id: 'xxl', name: 'xxl' },
])

const type = ref<KunBtnType>('button')
const typeOptions = ref([
  { id: 'button', name: 'button' },
  { id: 'submit', name: 'submit' },
  { id: 'reset', name: 'reset' },
])

// ------------------------------------------------------------------
// Strings siempre presentes (props con default string)
// ------------------------------------------------------------------
const minWidth = ref('min-w-[3rem]')
const fontWeight = ref('font-medium')
const rounded = ref('rounded-lg')
const textAlign = ref('text-center')
const bgColor = ref('bg-button')
const textColor = ref('text-ui')

// ------------------------------------------------------------------
// Strings opcionales: '' = undefined (props sin default)
// ------------------------------------------------------------------
const label = ref('Guardar')
const textProp = computed(() => (label.value === '' ? undefined : label.value))

const toRaw = ref('')
const toProp = computed(() => (toRaw.value === '' ? undefined : toRaw.value))

const hrefRaw = ref('')
const hrefProp = computed(() => (hrefRaw.value === '' ? undefined : hrefRaw.value))

const targetRaw = ref('')
const targetProp = computed(() => (targetRaw.value === '' ? undefined : targetRaw.value))

const iconRaw = ref('')
const iconProp = computed(() => (iconRaw.value === '' ? undefined : iconRaw.value))

const prependIconRaw = ref('')
const prependIconProp = computed(() => (prependIconRaw.value === '' ? undefined : prependIconRaw.value))

const appendIconRaw = ref('')
const appendIconProp = computed(() => (appendIconRaw.value === '' ? undefined : appendIconRaw.value))

// ------------------------------------------------------------------
// Strings nulables: '' = null (props con default: null)
// ------------------------------------------------------------------
const iconSizeRaw = ref('')
const iconSizeProp = computed<string | undefined>(() => (iconSizeRaw.value === '' ? undefined : iconSizeRaw.value))

const focusColorRaw = ref('')
const focusColorProp = computed<string | undefined>(() => (focusColorRaw.value === '' ? undefined : focusColorRaw.value))

// ------------------------------------------------------------------
// Booleanos
// ------------------------------------------------------------------
const loading = ref(false)
const disabled = ref(false)
const ring = ref(false)
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
  const text = String(detail ?? '')
  eventLog.value.unshift({ id: eventSeq, name, detail: text })
  if (eventLog.value.length > 8) eventLog.value.pop()
  lastEvent.value = text ? `${name} — ${text}` : name
}

function handleClick(event: MouseEvent): void {
  clicks.value += 1
  logEvent('click', `click #${clicks.value}`)
  void event
}
</script>

<template>
  <div class="p-4 grid gap-6 lg:grid-cols-2 lg:items-start">
    <!-- Vista previa + contador (fija: siempre visible al scrollear opciones) -->
    <div class="space-y-3 min-w-0 lg:sticky lg:top-4">
      <h2 class="text-lg font-semibold">KunBtn</h2>

      <KunBtn
        :text="textProp"
        :variant="variant"
        :size="size"
        :type="type"
        :loading="loading"
        :disabled="disabled"
        :min-width="minWidth"
        :font-weight="fontWeight"
        :rounded="rounded"
        :text-align="textAlign"
        :bg-color="bgColor"
        :text-color="textColor"
        :to="toProp"
        :href="hrefProp"
        :replace="replace"
        :target="targetProp"
        :ring="ring"
        :icon="iconProp"
        :prepend-icon="prependIconProp"
        :append-icon="appendIconProp"
        :icon-size="iconSizeProp"
        :focus-color="focusColorProp"
        @click="handleClick"
        @keydown="logEvent('keydown', ($event as KeyboardEvent).key)"
        @keyup="logEvent('keyup', ($event as KeyboardEvent).key)"
        @keypress="logEvent('keypress', ($event as KeyboardEvent).key)"
      />

      <div class="rounded-lg bg-surface p-3 font-mono text-sm">
        <div class="text-ui-muted text-xs mb-1">Clicks + último evento</div>
        <div>{{ clicks }} clicks</div>
        <div class="text-ui-muted text-xs mt-1">Último: {{ lastEvent }}</div>
      </div>

      <div class="rounded-lg bg-surface p-3 text-sm">
        <div class="text-ui-muted text-xs mb-1">Últimos eventos</div>
        <ul v-if="eventLog.length" class="space-y-1 font-mono text-xs">
          <li v-for="e in eventLog" :key="e.id">
            <span class="font-semibold">{{ e.name }}</span>
            <span v-if="e.detail" class="text-ui-muted"> — {{ e.detail }}</span>
          </li>
        </ul>
        <p v-else class="text-xs text-ui-muted">Hacé click en el botón para ver eventos…</p>
      </div>
    </div>

    <!-- Panel de configuración (scroll propio: no arrastra el botón) -->
    <div class="space-y-4 rounded-xl border border-ui p-4 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto">
      <h3 class="text-sm font-semibold uppercase tracking-wide text-ui-muted">Configuración</h3>

      <div class="grid grid-cols-2 gap-3 [&>*]:min-w-0">
        <KunSelect
          v-model="variant"
          v-model:items="variantOptions"
          label="Variant"
          item-value="id"
          item-title="name"
          density="compact"
        />
        <KunSelect
          v-model="size"
          v-model:items="sizeOptions"
          label="Size"
          item-value="id"
          item-title="name"
          density="compact"
        />
        <KunSelect
          v-model="type"
          v-model:items="typeOptions"
          label="Type"
          item-value="id"
          item-title="name"
          density="compact"
        />

        <KunTextField v-model="label" label="Text (label)" density="compact" />
        <KunTextField v-model="minWidth" label="Min width" density="compact" />
        <KunTextField v-model="fontWeight" label="Font weight" density="compact" />
        <KunTextField v-model="rounded" label="Rounded" density="compact" />
        <KunTextField v-model="textAlign" label="Text align" density="compact" />
        <KunTextField v-model="bgColor" label="Bg color" density="compact" />
        <KunTextField v-model="textColor" label="Text color" density="compact" />
        <KunTextField v-model="toRaw" label="To (vacío = undefined)" density="compact" />
        <KunTextField v-model="hrefRaw" label="Href (vacío = undefined)" density="compact" />
        <KunTextField v-model="targetRaw" label="Target (vacío = undefined)" density="compact" />
        <KunTextField v-model="iconRaw" label="Icon (vacío = undefined)" density="compact" />
        <KunTextField v-model="prependIconRaw" label="Prepend icon" density="compact" />
        <KunTextField v-model="appendIconRaw" label="Append icon" density="compact" />
        <KunTextField v-model="iconSizeRaw" label="Icon size (vacío = null)" density="compact" />
        <KunTextField v-model="focusColorRaw" label="Focus color (vacío = null)" density="compact" />

        <KunSwitch v-model="loading" label="Loading" />
        <KunSwitch v-model="disabled" label="Disabled" />
        <KunSwitch v-model="ring" label="Ring" />
        <KunSwitch v-model="replace" label="Replace (solo con to)" />
      </div>
    </div>
  </div>
</template>
