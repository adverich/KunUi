<template>
  <div class="p-4 max-w-md">
    <h2 class="text-lg font-semibold mb-2">Items con avatar:</h2>

    <ul class="space-y-2">
      <KunListItem>
        <KunListItemAvatar text="JD" />
        <KunListItemText>John Doe</KunListItemText>
        <KunListItemSubtitle>Administrador</KunListItemSubtitle>
      </KunListItem>

      <KunListItem active active-class="bg-blue-100 text-blue-600">
        <KunListItemAvatar>
          <img src="https://i.pravatar.cc/40 " alt="Avatar" class="w-full h-full object-cover" />
        </KunListItemAvatar>
        <KunListItemText>Jane Smith</KunListItemText>
        <KunListItemSubtitle>Desarrollador</KunListItemSubtitle>
      </KunListItem>
    </ul>
  </div>
</template>

<script setup>
import KunListItem from '../src/components/KunListItem.vue'
import KunListItemText from '../../../../KunListItemText/src/components/KunListItemText.vue'
import KunListItemSubtitle from '../../../../KunListItemSubtitle/src/components/KunListItemSubtitle.vue'
import KunListItemAvatar from '../../../src/components/KunListItemAvatar.vue'
</script>