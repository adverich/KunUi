<template>
    <KunList selectable="multiple">
      <KunListGroup title="Usuarios">
        <template #activator>
          <span class="flex items-center gap-2">
            <svg>👥</svg>
            Usuarios del sistema
          </span>
        </template>
        <KunListItem value="admin">Administrador</KunListItem>
        <KunListItem value="editor">Editor</KunListItem>
      </KunListGroup>
    
      <KunListGroup title="Preferencias" open>
        <KunListItem>
          <KunListItemText>Modo oscuro</KunListItemText>
          <KunListItemAction>
            <input type="checkbox" class="form-switch" />
          </KunListItemAction>
        </KunListItem>
      </KunListGroup>
    </KunList>
</template>

<script setup>
import KunList from '../src/components/KunList.vue'
import KunListGroup from '../../KunListGroup/src/components/KunListGroup.vue'
import KunListItem from '../../KunListItem/src/components/KunListItem.vue'
import KunListItemText from '../../KunListItem/src/components/KunListItem.vue'
import KunListItemAction from '../../KunListItem/src/components/KunListItem.vue'

</script>