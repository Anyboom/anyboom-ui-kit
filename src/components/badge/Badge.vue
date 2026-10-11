<script setup lang="ts">
interface Props {
  severity?:
    | 'incomplete'
    | 'secondary'
    | 'success'
    | 'active'
    | 'negative'
    | 'non-actionable'
}

withDefaults(defineProps<Props>(), { severity: 'non-actionable' })
</script>

<template>
  <div class="badge" :class="[`badge_severity_${severity}`]">
    <slot />
  </div>
</template>

<style scoped lang="scss">
@use "@/styles/mixins";

.badge {
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
    &_incomplete {
      background: var(--anyboom-badge-incomplete-background);
      color: var(--anyboom-badge-incomplete-text);
      border-color: var(--anyboom-badge-incomplete-border);
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
    &_active {
      background: var(--anyboom-badge-info-background);
      color: var(--anyboom-badge-info-text);
      border-color: var(--anyboom-badge-info-border);
    }
    &_negative {
      background: var(--anyboom-badge-negative-background);
      color: var(--anyboom-badge-negative-text);
      border-color: var(--anyboom-badge-negative-border);
    }
    &_non-actionable {
      background: var(--anyboom-badge-non-actionable-background);
      color: var(--anyboom-badge-non-actionable-text);
      border-color: var(--anyboom-badge-non-actionable-border);
    }
  }
}
</style>
