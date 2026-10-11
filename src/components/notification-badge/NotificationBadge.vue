<script setup lang="ts">
interface Props {
  value?: number
  severity?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'info'
    | 'warn'
    | 'contrast'
  active?: boolean
}

withDefaults(defineProps<Props>(), {
  severity: 'secondary',
  active: true,
})
</script>

<template>
  <div
    class="notification-badge"
    :class="[`notification-badge_severity_${severity}`]"
  >
    <div v-if="active" class="notification-badge__badge">
      <span v-if="value" class="notification-badge__value">{{ value }}</span>
    </div>
    <slot />
  </div>
</template>

<style scoped lang="scss">
@use "@/styles/mixins";

.notification-badge {
  $this: &;

  position: relative;
  display: inline-flex;
  width: fit-content;

  &__badge {
    position: absolute;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: var(--anyboom-surface-inverse);
    color: var(--anyboom-text-inverse);
    top: 0;
    right: 0;
    transform: translate(30%, -30%);
    transform-origin: 100% 0;
    height: 8px;
    min-width: 8px;
    border-radius: var(--anyboom-radius-large);

    &:has(#{$this}__value) {
      padding: 0 4px;
      height: 16px;
      min-width: 16px;
    }
  }

  &__value {
    @include mixins.apply-text("badge");
  }

  &_severity {
    &_info {
      #{$this}__badge {
        background: var(--anyboom-badge-info-border);
        color: var(--anyboom-badge-info-background);
        border-color: var(--anyboom-badge-info-border);
      }
    }
    &_danger {
      #{$this}__badge {
        background: var(--anyboom-badge-danger-border);
        color: var(--anyboom-badge-danger-background);
        border-color: var(--anyboom-badge-danger-border);
      }
    }
  }
}
</style>
