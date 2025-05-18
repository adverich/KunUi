<template>
  <div class="p-4 max-w-md">
    <h2 class="text-lg font-semibold mb-2">Items con acciones:</h2>

    <ul class="space-y-2">
      <KunListItem>
        <KunListItemText>Notificación por correo</KunListItemText>
        <KunListItemAction>
          <input type="checkbox" checked class="form-checkbox text-blue-600" />
        </KunListItemAction>
      </KunListItem>

      <KunListItem>
        <KunListItemText>Modo oscuro</KunListItemText>
        <KunListItemAction>
          <input type="checkbox" class="form-switch text-blue-600" />
        </KunListItemAction>
      </KunListItem>

      <KunListItem>
        <KunListItemAvatar text="JD" />
        <KunListItemText>John Doe</KunListItemText>
        <KunListItemAction>
          <button class="text-blue-500 hover:text-blue-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        </KunListItemAction>
      </KunListItem>
    </ul>
  </div>
</template>

<script setup>
import KunListItem from '../src/components/KunListItem.vue'
import KunListItemText from '../../../../KunListItemText/src/components/KunListItemText.vue'
import KunListItemAvatar from '../../../../KunListItemAvatar/src/components/KunListItemAvatar.vue'
import KunListItemAction from '../../../src/components/KunListItemAction.vue'
</script>