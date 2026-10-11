<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  disabled?: boolean
  href?: string
  target?: '_blank' | '_parent' | '_top' | '_self'
  variant?: 'filled' | 'outline' | 'text'
  severity?:
    | 'primary'
    | 'secondary'
    | 'contrast'
    | 'success'
    | 'danger'
    | 'info'
    | 'warn'
  size?: 'small' | 'normal' | 'large'
  iconOnly?: boolean
  mono?: boolean
  ariaLabel?: string
}

interface Emits {
  click: [event: MouseEvent]
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  href: undefined,
  target: undefined,
  severity: 'primary',
  variant: 'filled',
  size: 'normal',
  iconOnly: false,
  mono: false,
  ariaLabel: undefined,
})

const emit = defineEmits<Emits>()

function handleClick(event: MouseEvent) {
  if (props.disabled) {
    event.preventDefault()
    return
  }

  emit('click', event)
}

const isLink = computed(() => Boolean(props.href) && !props.disabled)
const tag = computed(() => (isLink.value ? 'a' : 'button'))
</script>

<template>
  <component
    :is="tag"
    :type="isLink ? undefined : 'button'"
    :href="isLink ? href : undefined"
    :target="isLink ? target : undefined"
    :rel="isLink && target === '_blank' ? 'noopener noreferrer' : undefined"
    :disabled="isLink ? undefined : disabled"
    class="button"
    :class="[
      `button_variant_${variant}`,
      `button_severity_${severity}`,
      `button_size_${size}`,
      {
        'button_icon-only': iconOnly,
        'button_mono': mono,
      },
    ]"
    :aria-label="ariaLabel"
    @click="handleClick"
  >
    <slot />
  </component>
</template>

<style scoped lang="scss">
@use "@/styles/mixins";

.button {
  $this: &;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--anyboom-spacing-2);
  height: fit-content;
  cursor: pointer;
  border: 1px solid transparent;
  text-decoration: none;

  &_size {
    &_small {
      padding: var(--anyboom-spacing-1-5) var(--anyboom-spacing-3);
      border-radius: var(--anyboom-radius-small);

      @include mixins.apply-text("button-sm");

      &#{$this}_mono {
        @include mixins.apply-text("button-mono-sm");
      }
    }
    &_normal {
      padding: var(--anyboom-spacing-2) var(--anyboom-spacing-4);
      border-radius: var(--anyboom-radius-small);

      @include mixins.apply-text("button-md");

      &#{$this}_mono {
        @include mixins.apply-text("button-mono-md");
      }
    }
    &_large {
      padding: var(--anyboom-spacing-2-5) var(--anyboom-spacing-5);
      border-radius: var(--anyboom-radius-main);

      @include mixins.apply-text("button-lg");

      &#{$this}_mono {
        @include mixins.apply-text("button-mono-lg");
      }
    }
  }

  &_icon-only {
    padding: 0;
    aspect-ratio: 1 / 1;

    &#{$this}_size_small {
      width: var(--anyboom-spacing-8);
      min-width: var(--anyboom-spacing-8);
    }

    &#{$this}_size_normal {
      width: var(--anyboom-spacing-9);
      min-width: var(--anyboom-spacing-9);
    }

    &#{$this}_size_large {
      width: var(--anyboom-spacing-10);
      min-width: var(--anyboom-spacing-10);
    }
  }

  $severities: primary, secondary, contrast, success, danger, info, warn;

  &_variant {
    &_filled {
      &:disabled {
        cursor: not-allowed;
        background: var(--anyboom-button-disabled-filled-background);
        color: var(--anyboom-button-disabled-filled-text);
      }

      @each $severity in $severities {
        &#{$this}_severity_#{$severity}:not(:disabled) {
          background: var(--anyboom-button-#{$severity}-filled-background);
          color: var(--anyboom-button-#{$severity}-filled-text);

          &:hover {
            background: var(
              --anyboom-button-#{$severity}-filled-background-hover
            );
          }

          &:active {
            background: var(
              --anyboom-button-#{$severity}-filled-background-active
            );
          }
        }
      }
    }

    &_outline {
      background: transparent;

      &:disabled {
        cursor: not-allowed;
        background: var(--anyboom-button-disabled-outlined-background);
        border-color: var(--anyboom-button-disabled-outlined-border);
        color: var(--anyboom-button-disabled-outlined-text);
      }

      @each $severity in $severities {
        &#{$this}_severity_#{$severity}:not(:disabled) {
          border-color: var(--anyboom-button-#{$severity}-outlined-border);
          color: var(--anyboom-button-#{$severity}-outlined-text);
          background: var(--anyboom-button-#{$severity}-outlined-background);

          &:hover {
            border-color: var(
              --anyboom-button-#{$severity}-outlined-border-hover
            );
            color: var(--anyboom-button-#{$severity}-outlined-text-hover);
            background: var(
              --anyboom-button-#{$severity}-outlined-background-hover
            );
          }

          &:active {
            border-color: var(
              --anyboom-button-#{$severity}-outlined-border-active
            );
            color: var(--anyboom-button-#{$severity}-outlined-text-active);
            background: var(
              --anyboom-button-#{$severity}-outlined-background-active
            );
          }
        }
      }
    }

    &_text {
      background: transparent;
      border-color: transparent;

      &:disabled {
        cursor: not-allowed;
        color: var(--anyboom-button-disabled-text-text);
      }

      @each $severity in $severities {
        &#{$this}_severity_#{$severity}:not(:disabled) {
          color: var(--anyboom-button-#{$severity}-text-text);

          &:hover {
            color: var(--anyboom-button-#{$severity}-text-text-hover);
          }

          &:active {
            color: var(--anyboom-button-#{$severity}-text-text-active);
          }
        }
      }
    }
  }
}
</style>
