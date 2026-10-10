<script setup lang="ts">
defineProps({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  code: { type: String, default: '' },
})
</script>

<template>
  <section :id="id" class="scroll-mt-24 rounded-xl border border-surface bg-surface-dark p-4 sm:p-5">
    <h3 class="text-base font-semibold">{{ title }}</h3>
    <p v-if="description" class="mt-1 text-sm opacity-70">{{ description }}</p>
    <div class="mt-3">
      <slot />
    </div>
    <details v-if="code" class="mt-3 group">
      <summary class="cursor-pointer text-xs font-medium uppercase tracking-wide opacity-60 hover:opacity-100 select-none">
        Ver código
      </summary>
      <pre class="mt-2 overflow-auto rounded-lg bg-black/40 p-3 text-xs leading-relaxed">{{ code }}</pre>
    </details>
  </section>
</template>
