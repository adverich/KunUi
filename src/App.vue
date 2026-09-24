<template>
  <div class="flex h-dvh flex-col overflow-hidden bg-surface-dark text-ui">
    <KunAppbar
      bg-color="bg-slate-400 dark:bg-slate-800"
      showDrawerButton
      @toggle-drawer="leftDrawerStatus = !leftDrawerStatus"
    >
      <template #actions>
        <KunSwitch
          v-model="currentTheme"
          true-value="light"
          false-value="dark"
          on-color="bg-black"
          off-color="bg-white"
          icon-color="bg-blue-500"
          @update:model-value="setTheme"
        />
      </template>
    </KunAppbar>

    <KunDrawer
      v-model="leftDrawerStatus"
      :temporary="true"
      location="start"
      scrim
      elevation="4"
      rounded="rounded-r-lg"
      color="bg-surface-dark"
    >
      <template #prepend>
        <div class="p-4 text-lg font-bold">KunUI Dev</div>
      </template>

      <nav class="my-1 py-2 space-y-1 px-2 overflow-auto">
        <RouterLink
          to="/"
          class="block p-2 rounded hover:bg-surface-light"
          @click="leftDrawerStatus = false"
        >
          Examples home
        </RouterLink>
        <RouterLink
          to="/sandbox"
          class="block p-2 rounded hover:bg-surface-light"
          @click="leftDrawerStatus = false"
        >
          Sandbox
        </RouterLink>

        <div class="pt-3 pb-1 px-2 text-xs uppercase opacity-60">KunDragAndDrop</div>
        <RouterLink
          v-for="ex in dragAndDropExamples"
          :key="ex.path"
          :to="ex.path"
          class="block p-2 rounded hover:bg-surface-light text-sm"
          @click="leftDrawerStatus = false"
        >
          {{ ex.example === 'Default' ? 'Default' : ex.example }}
        </RouterLink>
      </nav>

      <template #append>
        <div class="mt-auto p-4 text-sm text-gray-400">© 2025</div>
      </template>
    </KunDrawer>

    <main class="flex-1 min-h-0 overflow-auto text-slate-900 dark:text-slate-100">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import KunAppbar from './components/KunAppbar/src/components/KunAppbar.vue'
import KunSwitch from './components/KunSwitch/src/components/KunSwitch.vue'
import KunDrawer from './components/KunDrawer/src/components/KunDrawer.vue'
import { exampleNav } from './plugins/router.js'

const leftDrawerStatus = ref(false)
const currentTheme = ref('dark')

const dragAndDropExamples = computed(() =>
  exampleNav.filter((e) => e.component === 'KunDragAndDrop')
)

function setTheme(theme) {
  const html = document.documentElement
  if (theme === 'light') {
    html.classList.remove('dark')
  } else {
    html.classList.add('dark')
  }
  currentTheme.value = theme
}

setTheme(currentTheme.value)
</script>

<style>
body {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}
</style>
