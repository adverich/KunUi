<script setup lang="ts">
import { ref, computed } from 'vue'
import KunCurrency from '../src/components/KunCurrency.vue'
import KunSwitch from '../../KunSwitch/src/components/KunSwitch.vue'
import KunSelect from '../../KunSelect/src/components/KunSelect.vue'
import KunTextField from '../../KunTextField/src/components/KunTextField.vue'

// ------------------------------------------------------------------
// v-model principal: se muestra en crudo debajo del campo
// ------------------------------------------------------------------
const value = ref<number | null>(1234.5)

// ------------------------------------------------------------------
// Controles del playground
// ------------------------------------------------------------------
const placeholder = ref('0.00')
const prefixRaw = ref('')
const prefixProp = computed(() => (prefixRaw.value === '' ? null : prefixRaw.value))
const suffix = ref('')

const precisionRaw = ref('2')
const precisionProp = computed(() => (precisionRaw.value === '' ? null : Number(precisionRaw.value)))

const locale = ref('auto')
const localeOptions = ref([
  { id: 'auto', name: 'Auto (config global)' },
  { id: 'es-AR', name: 'es-AR' },
  { id: 'en-US', name: 'en-US' },
  { id: 'de-DE', name: 'de-DE' },
  { id: 'pt-BR', name: 'pt-BR' },
])
const localeProp = computed(() => (locale.value === 'auto' ? null : locale.value))

const currencyId = ref('auto')
const currencyOptions = ref([
  { id: 'auto', name: 'Auto (config global)' },
  { id: 'ARS', name: 'ARS — $ Pesos Argentinos' },
  { id: 'USD', name: 'USD — US$ Dólar estadounidense' },
  { id: 'EUR', name: 'EUR — € Euro' },
  { id: 'BRL', name: 'BRL — R$ Real brasileño' },
])
const currencyMap: Record<string, { value: string; name: string; symbol: string }> = {
  ARS: { value: 'ARS', name: 'Pesos Argentinos', symbol: '$' },
  USD: { value: 'USD', name: 'Dólar estadounidense', symbol: 'US$' },
  EUR: { value: 'EUR', name: 'Euro', symbol: '€' },
  BRL: { value: 'BRL', name: 'Real brasileño', symbol: 'R$' },
}
const currencyProp = computed(() => (currencyId.value === 'auto' ? null : currencyMap[currencyId.value]))

const hideCurrency = ref(false)

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
      <h2 class="text-lg font-semibold">KunCurrency</h2>

      <KunCurrency
        v-model="value"
        :currency="currencyProp"
        :locale="localeProp"
        :precision="precisionProp"
        :placeholder="placeholder"
        :prefix="prefixProp"
        :suffix="suffix"
        :hide-currency="hideCurrency"
        @update:model-value="logEvent('update:modelValue', JSON.stringify($event))"
      />

      <div class="rounded-lg bg-muted p-3 font-mono text-sm">
        <div class="text-muted text-xs mb-1">v-model en crudo</div>
        <div>{{ JSON.stringify(value) }} <span class="text-muted">({{ typeof value }})</span></div>
      </div>

      <div class="rounded-lg bg-muted p-3 text-sm">
        <div class="text-muted text-xs mb-1">Últimos eventos</div>
        <ul v-if="eventLog.length" class="space-y-1 font-mono text-xs">
          <li v-for="e in eventLog" :key="e.id">
            <span class="font-semibold">{{ e.name }}</span>
            <span v-if="e.detail" class="text-muted"> — {{ e.detail }}</span>
          </li>
        </ul>
        <p v-else class="text-xs text-muted">Interactuá con el campo para ver eventos…</p>
      </div>
    </div>

    <!-- Panel de configuración (scroll propio: no arrastra el field) -->
    <div class="space-y-4 rounded-lg border border-default p-4 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto">
      <h3 class="text-sm font-semibold uppercase tracking-wide text-muted">Configuración</h3>

      <div class="grid grid-cols-2 gap-3 [&>*]:min-w-0">
        <KunSelect
          v-model="currencyId"
          v-model:items="currencyOptions"
          label="Currency (vacío = global)"
          item-value="id"
          item-title="name"
          density="compact"
        />
        <KunSelect
          v-model="locale"
          v-model:items="localeOptions"
          label="Locale"
          item-value="id"
          item-title="name"
          density="compact"
        />

        <KunTextField v-model="precisionRaw" label="Precision (vacío = global)" density="compact" inputmode="decimal" />
        <KunTextField v-model="placeholder" label="Placeholder" density="compact" />
        <KunTextField v-model="prefixRaw" label="Prefix (vacío = moneda)" density="compact" />
        <KunTextField v-model="suffix" label="Suffix" density="compact" />

        <KunSwitch v-model="hideCurrency" label="Ocultar moneda" />
      </div>
    </div>
  </div>
</template>
