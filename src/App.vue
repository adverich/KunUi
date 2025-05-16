<template>
  <div class="flex flex-col">
    <KunAppbar title="HOLA MUNDO">

      <template #actions>
        <KunBtn text="Holitas" />
      </template>
    </KunAppbar>

    <div class="flex justify-center py-4">
      <KunSwitch
        v-model="enabled"
        size="xxl"        
      >
        <template #on-icon>
          🌙
        </template>
        <template #off-icon>
          💡
        </template>
      </KunSwitch>

      <KunIcon class="bg-blue-900" size="text-xl" color="text-red-500">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
          <path d="M12 2L2 21h20L12 2z" />
        </svg>
      </KunIcon>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import KunAppbar from './components/KunAppbar/src/components/KunAppbar.vue';
import KunBtn from './components/KunBtn/src/components/KunBtn.vue';
import KunIcon from './components/KunIcon/src/components/KunIcon.vue';
import KunSwitch from './components/KunSwitch/src/components/KunSwitch.vue';

function doSomething(){
  console.log('ola')
}
const enabled = ref(false)
</script>