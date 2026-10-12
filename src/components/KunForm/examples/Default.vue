<script setup lang="ts">
import { ref } from 'vue'
import KunForm from '../src/components/KunForm.vue'
import KunTextField from '../../KunTextField/src/components/KunTextField.vue'
import KunSelect from '../../KunSelect/src/components/KunSelect.vue'
import KunSwitch from '../../KunSwitch/src/components/KunSwitch.vue'

// ------------------------------------------------------------------
// KunForm solo expone 5 props (ver src/composables/kunFormProps.js):
// gap / padding / maxWidth (strings), modelValue (v-model booleano
// con la validez agregada) y validateOn ('submit' | 'input', sin tipo
// union exportado -> se declara localmente).
// ------------------------------------------------------------------
type KunFormValidateOn = 'submit' | 'input'

// ------------------------------------------------------------------
// Campos internos del formulario demo (con rules para ver validación)
// ------------------------------------------------------------------
const name = ref('')
const email = ref('')

const required = (v: unknown): boolean | string => !!v || 'Este campo es requerido'
const emailRule = (v: unknown): boolean | string =>
  /.+@.+\..+/.test(String(v ?? '')) || 'Email inválido'

const nameRules = [required]
const emailRules = [required, emailRule]

// ------------------------------------------------------------------
// Controles del playground (defaults = defaults del Props file)
// ------------------------------------------------------------------
const gap = ref('space-y-4')
const padding = ref('px-2 py-4')
const maxWidth = ref('max-w-full')

const validateOn = ref<KunFormValidateOn>('submit')
const validateOnOptions = ref([
  { id: 'submit', name: "submit (valida al enviar)" },
  { id: 'input', name: "input (valida al escribir)" },
])

// v-model del form: validez agregada (se actualiza con validate())
const isValid = ref(true)
const lastValidateResult = ref<boolean | null>(null)

const formRef = ref<InstanceType<typeof KunForm> | null>(null)

async function doValidate(): Promise<void> {
  const result = await formRef.value?.validate()
  lastValidateResult.value = result?.valid ?? null
  logEvent('validate()', result?.valid === true ? 'válido' : 'inválido')
}

function doReset(): void {
  formRef.value?.reset()
  lastValidateResult.value = null
  logEvent('reset()', 'campos + validación')
}

function doResetValidation(): void {
  formRef.value?.resetValidation()
  lastValidateResult.value = null
  logEvent('resetValidation()', 'solo validación')
}

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
    <!-- Vista previa + validez (fija: siempre visible al scrollear opciones) -->
    <div class="space-y-3 min-w-0 lg:sticky lg:top-4">
      <h2 class="text-lg font-semibold">KunForm</h2>

      <KunForm
        ref="formRef"
        v-model="isValid"
        :gap="gap"
        :padding="padding"
        :max-width="maxWidth"
        :validate-on="validateOn"
        class="rounded-xl border border-ui"
        @submit="logEvent('submit', `válido, nombre=${name || '—'} email=${email || '—'}`)"
        @update:model-value="logEvent('update:modelValue', String($event))"
      >
        <KunTextField
          v-model="name"
          label="Nombre"
          placeholder="Tu nombre"
          :rules="nameRules"
          clearable
        />
        <KunTextField
          v-model="email"
          label="Email"
          placeholder="nombre@correo.com"
          inputmode="email"
          :rules="emailRules"
          clearable
        />

        <div class="flex flex-wrap gap-2">
          <button
            type="submit"
            class="rounded-lg bg-surface px-3 py-2 text-sm font-semibold border border-ui hover:opacity-80"
          >
            Enviar (submit)
          </button>
          <button
            type="button"
            class="rounded-lg px-3 py-2 text-sm border border-ui hover:opacity-80"
            @click="doValidate"
          >
            Validar
          </button>
          <button
            type="button"
            class="rounded-lg px-3 py-2 text-sm border border-ui hover:opacity-80"
            @click="doReset"
          >
            Reset
          </button>
          <button
            type="button"
            class="rounded-lg px-3 py-2 text-sm border border-ui hover:opacity-80"
            @click="doResetValidation"
          >
            Limpiar validación
          </button>
        </div>
      </KunForm>

      <div class="rounded-lg bg-surface p-3 text-sm">
        <div class="text-ui-muted text-xs mb-2">Validez agregada (v-model)</div>
        <div class="flex flex-wrap items-center gap-3">
          <KunSwitch :model-value="isValid" label="Válido" disabled />
          <span class="font-mono text-xs">
            validate() → {{ lastValidateResult === null ? '—' : String(lastValidateResult) }}
          </span>
        </div>
        <div class="mt-2 font-mono text-xs">
          <div>nombre: {{ JSON.stringify(name) }}</div>
          <div>email: {{ JSON.stringify(email) }}</div>
        </div>
      </div>

      <div class="rounded-lg bg-surface p-3 text-sm">
        <div class="text-ui-muted text-xs mb-1">Últimos eventos</div>
        <ul v-if="eventLog.length" class="space-y-1 font-mono text-xs">
          <li v-for="e in eventLog" :key="e.id">
            <span class="font-semibold">{{ e.name }}</span>
            <span v-if="e.detail" class="text-ui-muted"> — {{ e.detail }}</span>
          </li>
        </ul>
        <p v-else class="text-xs text-ui-muted">Enviá o validá el formulario para ver eventos…</p>
      </div>
    </div>

    <!-- Panel de configuración (scroll propio: no arrastra el form) -->
    <div class="space-y-4 rounded-xl border border-ui p-4 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto">
      <h3 class="text-sm font-semibold uppercase tracking-wide text-ui-muted">Configuración</h3>

      <div class="grid grid-cols-2 gap-3 [&>*]:min-w-0">
        <KunTextField v-model="gap" label="Gap" density="compact" />
        <KunTextField v-model="padding" label="Padding" density="compact" />
        <KunTextField v-model="maxWidth" label="Max width" density="compact" />

        <KunSelect
          v-model="validateOn"
          v-model:items="validateOnOptions"
          label="Validate on"
          item-value="id"
          item-title="name"
          density="compact"
        />
      </div>

      <p class="text-xs text-ui-muted">
        <span class="font-mono">modelValue</span> (Boolean, validez agregada) se demuestra vía
        <span class="font-mono">v-model</span> en el panel de validez, no como control:
        es una salida de <span class="font-mono">validate()</span>, no una entrada de configuración.
      </p>
    </div>
  </div>
</template>
