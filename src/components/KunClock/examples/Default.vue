<template>
  <div class="h-[200px] w-full bg-gray-100 relative p-4 rounded-lg">
    <h3 class="font-bold mb-4">KunClock Example</h3>
    <p>The status of the clock is controlled by the component below.</p>
    
    <!-- This clock will be fixed to the viewport top-right when mounted -->
    <KunClock 
      color="#ff0000" 
      size="1.5rem" 
    />
    
    <div class="mt-4 text-sm text-gray-500">
      Note: The clock is fixed positioned to the viewport, so look at the top right of your screen!
    </div>
  </div>
</template>

<script setup>
import KunClock from '../index.js'
</script>
