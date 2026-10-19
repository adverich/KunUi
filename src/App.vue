<template>
  <div class="flex h-dvh flex-col overflow-hidden bg-default text-default">
    <KunAppbar
      showDrawerButton
      @toggle-drawer="leftDrawerStatus = !leftDrawerStatus"
    >
      <template #actions>
        <KunMenu
          v-model="themeMenuOpen"
          open-on-click
          location="bottom"
          :close-on-content-click="false"
          width="w-80"
          label="Configurar theme"
        >
          <template #activator>
            <KunBtn
              color="neutral"
              variant="ghost"
              rounded="full"
              size="xs"
              aria-label="Configurar theme"
            >
              <KunIcon size="size-6" icon="$palette" />
            </KunBtn>
          </template>

          <KunThemeConfigurator />
        </KunMenu>
      </template>
    </KunAppbar>

    <KunDrawer
      v-model="leftDrawerStatus"
      :temporary="true"
      location="start"
      scrim
      elevation="4"
      rounded
    >
      <template #prepend>
        <div class="p-4 text-lg font-bold">KunUI Dev</div>
      </template>

      <nav class="my-1 py-2 space-y-1 px-2 overflow-auto">
        <RouterLink
          to="/"
          class="block p-2 rounded hover:bg-accented"
          @click="leftDrawerStatus = false"
        >
          Examples home
        </RouterLink>
        <RouterLink
          to="/sandbox"
          class="block p-2 rounded hover:bg-accented"
          @click="leftDrawerStatus = false"
        >
          Sandbox
        </RouterLink>

        <div class="pt-3 pb-1 px-2 text-xs uppercase opacity-60">KunDragAndDrop</div>
        <RouterLink
          v-for="ex in dragAndDropExamples"
          :key="ex.path"
          :to="ex.path"
          class="block p-2 rounded hover:bg-accented text-sm"
          @click="leftDrawerStatus = false"
        >
          {{ ex.example === 'Default' ? 'Default' : ex.example }}
        </RouterLink>
      </nav>

      <template #append>
        <div class="mt-auto p-4 text-sm text-muted">© 2025</div>
      </template>
    </KunDrawer>

    <main class="flex-1 min-h-0 overflow-auto text-default">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import KunAppbar from './components/KunAppbar/src/components/KunAppbar.vue'
import KunBtn from './components/KunBtn/src/components/KunBtn.vue'
import KunIcon from './components/KunIcon/src/components/KunIcon.vue';
import KunMenu from './components/KunMenu/src/components/KunMenu.vue'
import KunDrawer from './components/KunDrawer/src/components/KunDrawer.vue'
import KunThemeConfigurator from './theme/KunThemeConfigurator.vue'
import { exampleNav } from './plugins/router.js'

const leftDrawerStatus = ref(false)
const themeMenuOpen = ref(false)

const dragAndDropExamples = computed(() =>
  exampleNav.filter((e) => e.component === 'KunDragAndDrop')
)
</script>

<style>
body {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}
</style>
