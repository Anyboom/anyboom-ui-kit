<script setup lang="ts">
interface Props {
  variant?: 'filled' | 'outline' | 'text'
  severity?: 'primary' | 'secondary' | 'contrast' | 'success' | 'danger' | 'info' | 'warn'
  size?: 'small' | 'medium' | 'large'
}

withDefaults(defineProps<Props>(), {
  severity: 'info',
  variant: 'filled',
  size: 'medium',
})
</script>

<template>
  <div
    class="message"
    :class="[
      `message_variant_${variant}`,
      `message_severity_${severity}`,
      `message_size_${size}`,
    ]"
  >
    <slot />
  </div>
</template>

<style scoped lang="scss">
@use "@/styles/mixins";

.message {
  $this: &;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--anyboom-spacing-2);
  height: fit-content;
  border: 1px solid transparent;
  text-decoration: none;

  &_size {
    &_small {
      padding: var(--anyboom-spacing-1-5) var(--anyboom-spacing-3);
      border-radius: var(--anyboom-radius-small);

      @include mixins.apply-text("body-xs");
    }
    &_medium {
      padding: var(--anyboom-spacing-2) var(--anyboom-spacing-4);
      border-radius: var(--anyboom-radius-small);

      @include mixins.apply-text("body-sm");
    }
    &_large {
      padding: var(--anyboom-spacing-2-5) var(--anyboom-spacing-5);
      border-radius: var(--anyboom-radius-main);

      @include mixins.apply-text("body-base");
    }
  }

  $severities: primary, secondary, contrast, success, danger, info, warn;

  &_variant {
    &_filled {
      @each $severity in $severities {
        &#{$this}_severity_#{$severity}:not(:disabled) {
          background: var(--anyboom-message-#{$severity}-filled-background);
          color: var(--anyboom-message-#{$severity}-filled-text);
        }
      }
    }

    &_outline {
      background: transparent;

      @each $severity in $severities {
        &#{$this}_severity_#{$severity}:not(:disabled) {
          border-color: var(--anyboom-message-#{$severity}-outlined-border);
          color: var(--anyboom-message-#{$severity}-outlined-text);
          background: var(--anyboom-message-#{$severity}-outlined-background);
        }
      }
    }

    &_text {
      background: transparent;
      border-color: transparent;
      padding: 0;

      @each $severity in $severities {
        &#{$this}_severity_#{$severity}:not(:disabled) {
          color: var(--anyboom-message-#{$severity}-text-text);
        }
      }
    }
  }
}
</style>
