<template>
  <div class="p-4 max-w-md">
    <h2 class="text-lg font-semibold mb-2">Imágenes en lista:</h2>

    <ul class="space-y-2">
      <li class="flex items-center gap-3">
        <KunListImg
          src="https://picsum.photos/id/1025/200/200 "
          alt="Usuario 1"
          class="w-8 h-8 rounded-full"
        />
        <span>Juan Pérez</span>
      </li>

      <li class="flex items-center gap-3">
        <KunListImg
          src="https://picsum.photos/id/1062/200/200 "
          alt="Usuario 2"
          class="w-8 h-8"
        />
        <span>Ana Gómez</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import KunListImg from '../src/components/KunListImg.vue'
</script>