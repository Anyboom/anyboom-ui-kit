<script setup lang="ts">
import type { MenuItem as MenuItemType } from '@/components/menu/MenuItem.ts'

import MenuItem from './MenuItem.vue'

interface Props {
  items: MenuItemType[]
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'itemClick', item: MenuItemType): void
}>()

function handleItemClick(item: MenuItemType) {
  emit('itemClick', item)
}
</script>

<template>
  <nav class="menu">
    <ul class="menu__list">
      <MenuItem
        v-for="(item, index) in items"
        :key="item.id || index"
        :item="item"
        @item-click="handleItemClick"
      />
    </ul>
  </nav>
</template>

<style scoped lang="scss">
.menu {
  width: 100%;
  background-color: var(--anyboom-menu-background);
  border: 1px solid var(--anyboom-menu-border);
  padding: var(--anyboom-spacing-2);
  border-radius: var(--anyboom-radius-small);

  &__list {
    display: flex;
    list-style: none;
    gap: var(--anyboom-spacing-1);
    flex-direction: column;
  }
}
</style>
