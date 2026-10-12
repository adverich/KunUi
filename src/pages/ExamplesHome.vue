<script setup lang="ts">
import { computed, ref } from 'vue'
import { exampleNav } from '../plugins/router.js'
import KunRow from '../components/KunRow/src/components/KunRow.vue'
import KunCol from '../components/KunCol/src/components/KunCol.vue'
import KunCard from '../components/KunCard/src/components/KunCard.vue'
import KunBtn from '../components/KunBtn/src/components/KunBtn.vue'
import KunTextField from '../components/KunTextField/src/components/KunTextField.vue'

const search = ref('')

const grouped = computed(() => {
  const map = new Map()
  for (const entry of exampleNav) {
    if (!map.has(entry.component)) map.set(entry.component, [])
    map.get(entry.component).push(entry)
  }
  return [...map.entries()].map(([component, examples]) => ({ component, examples }))
})

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return grouped.value
  return grouped.value.filter((group) => group.component.toLowerCase().includes(q))
})

function shortName(component: string): string {
  return component.replace(/^Kun/, '')
}

function initials(component: string): string {
  const short = shortName(component)
  const caps = short.replace(/[^A-Z]/g, '')
  return (caps || short).slice(0, 2).toUpperCase()
}

function clearSearch(): void {
  search.value = ''
}
</script>

<template>
  <div class="examples-home min-h-full">
    <div class="p-6 max-w-7xl mx-auto space-y-8">
      <!-- Hero -->
      <div class="hero rounded-2xl border border-ui-subtle bg-surface-light px-6 py-8 text-center shadow">
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Playground</p>
        <h1 class="mt-2 text-3xl font-bold">KunUI Examples</h1>
        <p class="mt-2 text-sm text-ui-muted">
          Previsualizá componentes desde <code class="text-xs">/examples/...</code>
        </p>
        <p class="mt-3 inline-block text-xs font-medium px-3 py-1 rounded-full border border-ui-subtle bg-surface">
          {{ filtered.length }} / {{ grouped.length }} componentes
        </p>
      </div>

      <!-- Buscador -->
      <div class="flex justify-center">
        <KunTextField
          v-model="search"
          label="Buscar componente"
          placeholder="Ej. KunSelect…"
          density="compact"
          clearable
          hide-details
          class="w-full max-w-md"
        />
      </div>

      <!-- Grilla -->
      <KunRow v-if="filtered.length" :cols="12" align="stretch">
        <KunCol
          v-for="group in filtered"
          :key="group.component"
          :cols="12"
          :sm="6"
          :lg="4"
          :xl="3"
        >
          <KunCard
            :title="group.component"
            :subtitle="`${group.examples.length} example${group.examples.length === 1 ? '' : 's'}`"
            bg-color="bg-surface-light"
            :elevation="2"
            hover
            class="examples-card h-full text-center border border-ui-subtle"
          >
            <div class="flex flex-col items-center gap-3 px-5 pb-5 pt-3">
              <span class="avatar" aria-hidden="true">{{ initials(group.component) }}</span>
              <div class="flex flex-wrap justify-center gap-2">
                <KunBtn
                  v-for="ex in group.examples"
                  :key="ex.path"
                  :to="ex.path"
                  size="sm"
                >
                  {{ ex.example === 'Default' ? 'Default' : ex.example }}
                </KunBtn>
              </div>
            </div>
          </KunCard>
        </KunCol>
      </KunRow>

      <!-- Vacío -->
      <div v-else class="rounded-2xl border border-ui-subtle bg-surface-light p-10 text-center shadow">
        <p class="text-lg font-semibold">Sin coincidencias</p>
        <p class="mt-1 text-sm text-ui-muted">No hay componentes que coincidan con “{{ search }}”.</p>
        <KunBtn size="sm" class="mt-4" @click="clearSearch">
          Limpiar búsqueda
        </KunBtn>
      </div>

      <div class="text-center">
        <RouterLink to="/sandbox" class="text-sm underline opacity-80 hover:opacity-100">
          Ir al sandbox legacy
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.examples-home {
  background:
    radial-gradient(60rem 20rem at 50% -6rem, var(--surface-light) 0%, transparent 70%);
}

.hero {
  box-shadow: 0 12px 32px -16px rgb(0 0 0 / 0.45);
}

.examples-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.examples-card:hover {
  transform: translateY(-4px);
  border-color: var(--primary);
  box-shadow: 0 16px 32px -16px rgb(0 0 0 / 0.5);
}

.avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 9999px;
  font-weight: 700;
  font-size: 1rem;
  letter-spacing: 0.05em;
  color: #fff;
  background: linear-gradient(135deg, var(--primary) 0%, var(--button) 100%);
  box-shadow: 0 8px 16px -8px rgb(0 0 0 / 0.5);
}
</style>
