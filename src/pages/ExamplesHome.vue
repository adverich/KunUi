<script setup>
import { computed } from 'vue'
import { exampleNav } from '../plugins/router.js'

const grouped = computed(() => {
  const map = new Map()
  for (const entry of exampleNav) {
    if (!map.has(entry.component)) map.set(entry.component, [])
    map.get(entry.component).push(entry)
  }
  return [...map.entries()].map(([component, examples]) => ({ component, examples }))
})
</script>

<template>
  <div class="p-6 max-w-3xl space-y-6">
    <div>
      <h1 class="text-2xl font-semibold">KunUI Examples</h1>
      <p class="text-sm text-ui-muted mt-1">
        Previsualizá componentes desde <code class="text-xs">/examples/...</code>
      </p>
    </div>

    <div class="space-y-4">
      <div
        v-for="group in grouped"
        :key="group.component"
        class="rounded-lg border border-surface bg-surface-light p-4"
      >
        <h2 class="font-medium mb-2">{{ group.component }}</h2>
        <ul class="flex flex-wrap gap-2">
          <li v-for="ex in group.examples" :key="ex.path">
            <RouterLink
              :to="ex.path"
              class="inline-block text-sm px-3 py-1.5 rounded-md bg-button hover:opacity-90"
            >
              {{ ex.example === 'Default' ? 'Default' : ex.example }}
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>

    <RouterLink to="/sandbox" class="text-sm underline opacity-80 hover:opacity-100">
      Ir al sandbox legacy
    </RouterLink>
  </div>
</template>
