<script setup lang="ts">
interface Props {
  vertical?: boolean
}

withDefaults(defineProps<Props>(), {
  vertical: false,
})
</script>

<template>
  <div class="anyboom-divider" :class="{ divider_vertical: vertical }" />
</template>

<style lang="scss">
.anyboom-divider {
  width: 100%;
  height: 1px;
  background: var(--anyboom-border-default);

  &_vertical {
    width: 1px;
    height: 100%;
  }
}
</style>
