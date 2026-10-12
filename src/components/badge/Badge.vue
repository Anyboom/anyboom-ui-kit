<script setup lang="ts">
interface Props {
  severity?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'info'
    | 'warn'
    | 'contrast'
}

withDefaults(defineProps<Props>(), { severity: 'secondary' })
</script>

<template>
  <div class="anyboom-badge" :class="[`anyboom-badge_severity_${severity}`]">
    <slot />
  </div>
</template>

<style lang="scss">
@use "@/styles/mixins";

.anyboom-badge {
  padding: var(--anyboom-spacing-0-5) var(--anyboom-spacing-2);
  border-radius: var(--anyboom-radius-small);
  border: 1px solid transparent;
  width: fit-content;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--anyboom-spacing-1);

  @include mixins.apply-text("badge");

  &_severity {
    &_primary,
    &_contrast {
      background: var(--anyboom-badge-primary-background);
      color: var(--anyboom-badge-primary-text);
      border-color: var(--anyboom-badge-primary-border);
    }
    &_secondary {
      background: var(--anyboom-badge-secondary-background);
      color: var(--anyboom-badge-secondary-text);
      border-color: var(--anyboom-badge-secondary-border);
    }
    &_success {
      background: var(--anyboom-badge-success-background);
      color: var(--anyboom-badge-success-text);
      border-color: var(--anyboom-badge-success-border);
    }
    &_danger {
      background: var(--anyboom-badge-danger-background);
      color: var(--anyboom-badge-danger-text);
      border-color: var(--anyboom-badge-danger-border);
    }
    &_info {
      background: var(--anyboom-badge-info-background);
      color: var(--anyboom-badge-info-text);
      border-color: var(--anyboom-badge-info-border);
    }
    &_warn {
      background: var(--anyboom-badge-warn-background);
      color: var(--anyboom-badge-warn-text);
      border-color: var(--anyboom-badge-warn-border);
    }
  }
}
</style>
