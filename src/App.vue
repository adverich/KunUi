<template>
  <div class="flex flex-col">
    <KunAppbar :showDrawerButton="false">

      <template #actions>
        <KunBtn text="Holitas" />  
      </template>
    </KunAppbar>

    <div class="flex justify-center py-4">
      <KunBtn text="Quienes Somos" />
    </div>

  </div>
</template>

<script setup>
import KunAppbar from './components/KunAppbar/src/components/KunAppbar.vue';
import KunBtn from './components/KunBtn/src/components/KunBtn.vue';
function doSomething(){
  console.log('ola')
}
</script>