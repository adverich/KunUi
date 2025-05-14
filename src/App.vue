<template>
  <div class="flex flex-col">
    <div>
      <h1 class="text-3xl font-bold underline text-center">
        Kun UI!
      </h1>
    </div>

    <div class="flex justify-center py-4">
      <KunBtn text="Quienes Somos" bgColor="bg-red-900" size="xxs" />
    </div>

  </div>
</template>

<script setup>
import KunBtn from './components/KunBtn/src/components/KunBtn.vue';

</script>