<template>
  <KunListItem value="user1" active>
    <KunListItemAvatar>
      <img src="/avatar.png" alt="Avatar" class="w-8 h-8 rounded-full">
    </KunListItemAvatar>
  
    <KunListItemText>John Doe</KunListItemText>
    <KunListItemSubtitle>Administrador</KunListItemSubtitle>
  
    <KunListItemAction>
      <input type="checkbox" checked class="form-checkbox">
    </KunListItemAction>
  </KunListItem>
</template>

<script setup>
import KunListItem from '../src/components/KunListItem.vue'
import KunListItemAvatar from '../../../src/components/KunListItemAvatar.vue'
import KunListItemText from '../../../src/components/KunListItemText.vue'
import KunListItemSubtitle from '../../../src/components/KunListItemSubtitle.vue'
import KunListItemAction from '../../../src/components/KunListItemAction.vue'

</script>