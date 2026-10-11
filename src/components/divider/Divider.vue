<script setup lang="ts">
interface Props {
  vertical?: boolean
}

withDefaults(defineProps<Props>(), {
  vertical: false,
})
</script>

<template>
  <div class="divider" :class="{ divider_vertical: vertical }" />
</template>

<style scoped lang="scss">
.divider {
  width: 100%;
  height: 1px;
  background: var(--anyboom-border-default);

  &_vertical {
    width: 1px;
    height: 100%;
  }
}
</style>
