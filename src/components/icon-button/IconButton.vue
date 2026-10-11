<script setup lang="ts"></script>

<template>
  <button class="icon-button">
    <slot />
  </button>
</template>

<style scoped lang="scss">
.icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--anyboom-icon-button-default-icon);
  border-radius: var(--anyboom-radius-small);
  padding: var(--anyboom-spacing-1);
  height: fit-content;

  &:hover {
    color: var(--anyboom-icon-button-hover-icon);
    background: var(--anyboom-icon-button-hover-background);
  }

  &:active {
    color: var(--anyboom-icon-button-active-icon);
    background: var(--anyboom-icon-button-active-background);
  }
}
</style>
