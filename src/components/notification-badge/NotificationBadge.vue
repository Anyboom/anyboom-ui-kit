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
    &_primary,
    &_contrast {
      #{$this}__badge {
        background: var(--anyboom-notification-badge-primary-background);
        color: var(--anyboom-notification-badge-primary-text);
        border-color: var(--anyboom-notification-badge-primary-border);
      }
    }
    &_secondary {
      #{$this}__badge {
        background: var(--anyboom-notification-badge-secondary-background);
        color: var(--anyboom-notification-badge-secondary-text);
        border-color: var(--anyboom-notification-badge-secondary-border);
      }
    }
    &_success {
      #{$this}__badge {
        background: var(--anyboom-notification-badge-success-background);
        color: var(--anyboom-notification-badge-success-text);
        border-color: var(--anyboom-notification-badge-success-border);
      }
    }
    &_danger {
      #{$this}__badge {
        background: var(--anyboom-notification-badge-danger-background);
        color: var(--anyboom-notification-badge-danger-text);
        border-color: var(--anyboom-notification-badge-danger-border);
      }
    }
    &_info {
      #{$this}__badge {
        background: var(--anyboom-notification-badge-info-background);
        color: var(--anyboom-notification-badge-info-text);
        border-color: var(--anyboom-notification-badge-info-border);
      }
    }
    &_warn {
      #{$this}__badge {
        background: var(--anyboom-notification-badge-warn-background);
        color: var(--anyboom-notification-badge-warn-text);
        border-color: var(--anyboom-notification-badge-warn-border);
      }
    }
  }
}
</style>
