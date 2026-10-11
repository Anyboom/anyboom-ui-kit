<script setup lang="ts"></script>

<template>
  <div class="overlay" />
</template>

<style scoped lang="scss">
.overlay {
  background: var(--anyboom-overlay-default);
  opacity: 0.6;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
}
</style>
