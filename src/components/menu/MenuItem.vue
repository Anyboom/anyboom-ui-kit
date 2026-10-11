<script setup lang="ts">
import type { MenuItem } from '@/components/menu/MenuItem.ts'

interface Props {
  item: MenuItem
}

const props = defineProps<Props>()

const emit = defineEmits<Emit>()

interface Emit {
  itemClick: [item: MenuItem]
}

function handleClick() {
  if (props.item.disabled) {
    return
  }

  emit('itemClick', props.item)
}
</script>

<template>
  <li
    class="menu-item"
    :class="{
      'menu-item_active': props.item.active,
      'menu-item_disabled': props.item.disabled,
    }"
    @click="handleClick"
  >
    <component
      :is="item.href && !item.disabled ? 'a' : 'button'"
      :type="item.href && !item.disabled ? undefined : 'button'"
      class="menu-item__link"
      :href="item.href && !item.disabled ? item.href : undefined"
      :target="item.href && !item.disabled ? item.target : undefined"
      :rel="item.href && item.target === '_blank' ? 'noopener noreferrer' : undefined"
      :disabled="item.href && !item.disabled ? undefined : item.disabled"
    >
      <span v-if="item.iconLeft" class="menu-item__icon">
        <component :is="item.iconLeft" />
      </span>

      <span class="menu-item__text">{{ item.label }}</span>

      <span v-if="item.iconRight" class="menu-item__icon">
        <component :is="item.iconRight" />
      </span>
    </component>
  </li>
</template>

<style scoped lang="scss">
@use "@/styles/mixins";

.menu-item {
  $this: &;

  position: relative;
  list-style: none;

  &_disabled {
    opacity: 0.5;
    cursor: not-allowed;

    #{$this}__link {
      cursor: not-allowed;
      pointer-events: none;

      &:hover {
        background-color: var(--anyboom-menu-item-background);
      }
    }
  }

  &_active {
    #{$this}__link {
      color: var(--anyboom-menu-item-text-active);
      background-color: var(--anyboom-menu-item-background-active);

      &:hover {
        color: var(--anyboom-menu-item-text-active);
        background-color: var(--anyboom-menu-item-background-active);
      }
    }

    #{$this}__icon {
      color: var(--anyboom-menu-item-icon-active);
    }
  }

  &__link {
    color: var(--anyboom-menu-item-text);
    padding: var(--anyboom-spacing-2) var(--anyboom-spacing-3);
    gap: var(--anyboom-spacing-3);
    background: var(--anyboom-menu-item-background);
    border-radius: var(--anyboom-radius-tiny);
    display: flex;
    cursor: pointer;
    width: 100%;

    &:hover {
      color: var(--anyboom-menu-item-text-hover);
      background-color: var(--anyboom-menu-item-background-hover);
    }
  }

  &__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: var(--anyboom-menu-item-icon);
  }

  &__text {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;

    @include mixins.apply-text("body-sm-medium");
  }
}
</style>
