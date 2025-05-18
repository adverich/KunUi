<template>
  <div class="p-8 flex flex-col gap-4 items-center">
    <h2 class="text-xl font-bold mb-4">Tooltips con slot activator</h2>

    <KunTooltip text="Tooltip arriba" location="top">
      <template #activator="{ props }">
        <button v-bind="props" class="px-4 py-2 bg-blue-500 text-white rounded">Top</button>
      </template>
    </KunTooltip>

    <KunTooltip text="Tooltip abajo" location="bottom">
      <template #activator="{ props }">
        <button v-bind="props" class="px-4 py-2 bg-green-500 text-white rounded">Bottom</button>
      </template>
    </KunTooltip>

    <KunTooltip text="Tooltip izquierda" location="left">
      <template #activator="{ props }">
        <button v-bind="props" class="px-4 py-2 bg-yellow-500 text-white rounded">Left</button>
      </template>
    </KunTooltip>

    <KunTooltip text="Tooltip derecha" location="right">
      <template #activator="{ props }">
        <button v-bind="props" class="px-4 py-2 bg-purple-500 text-white rounded">Right</button>
      </template>
    </KunTooltip>

    <KunTooltip text="Con delay" location="top" :delay="500">
      <template #activator="{ props }">
        <button v-bind="props" class="px-4 py-2 bg-indigo-500 text-white rounded">Delay</button>
      </template>
    </KunTooltip>
  </div>
</template>

<script setup>
import KunTooltip from '../src/components/KunTooltip.vue'
</script>