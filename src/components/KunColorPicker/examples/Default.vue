<script setup lang="ts">
import { ref } from 'vue'
import KunColorPicker from '../src/components/KunColorPicker.vue'
import KunBtn from '../../KunBtn/src/components/KunBtn.vue'

const color = ref('#2563EB')
const log = ref<string[]>([])

function push(msg: string): void {
  log.value.unshift(`${new Date().toLocaleTimeString()} · ${msg}`)
  log.value = log.value.slice(0, 8)
}
</script>

<template>
  <div class="p-6 max-w-2xl space-y-6">
    <h1 class="text-2xl font-semibold">KunColorPicker</h1>

    <KunColorPicker
      v-model="color"
      original-color="#2563EB"
      label="Color de acento"
      @change="push(`change → ${color}`)"
      @reset="push('reset')"
      @open="push('open')"
      @close="push('close')"
    />

    <div class="flex items-center gap-3">
      <span
        class="inline-block w-10 h-10 rounded border border-ui"
        :style="{ backgroundColor: color }"
      />
      <code class="text-sm">{{ color }}</code>
      <KunBtn text="Volver a rojo" size="xs" @click="color = '#EF4444'" />
    </div>

    <div>
      <h2 class="text-sm font-medium mb-2">Eventos</h2>
      <ul class="text-xs space-y-1 text-ui-muted">
        <li v-for="(entry, i) in log" :key="i">{{ entry }}</li>
        <li v-if="!log.length">Interactúa con el picker…</li>
      </ul>
    </div>
  </div>
</template>
