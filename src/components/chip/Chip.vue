<script setup lang="ts">
import XBoldIcon from '@iconify-vue/ph/x-bold'

interface Props {
  variant?: 'dismissable' | 'link' | 'filter'
  size?: 'small' | 'medium' | 'large'
  removable?: boolean
  selected?: boolean
  label?: string
}

interface Emits {
  remove: [event: Event]
}

withDefaults(defineProps<Props>(), {
  variant: 'dismissable',
  size: 'small',
})

const emit = defineEmits<Emits>()

function remove(event: Event) {
  emit('remove', event)
}
</script>

<template>
  <div
    class="anyboom-chip"
    :class="[
      `anyboom-chip_variant_${variant}`,
      `anyboom-chip_size_${size}`,
      { 'anyboom-chip_selected': selected },
    ]"
  >
    <div class="anyboom-chip__icon">
      <slot name="icon-left" />
    </div>
    <span class="anyboom-chip__label">
      <slot>
        {{ label }}
      </slot>
    </span>
    <div class="anyboom-chip__icon">
      <slot name="icon-right" />
    </div>
    <div v-if="removable" class="anyboom-chip__icon anyboom-chip__removable">
      <XBoldIcon height="1em" @click="remove" />
    </div>
  </div>
</template>

<style lang="scss">
@use "@/styles/mixins";

.anyboom-chip {
  $this: &;

  display: flex;
  gap: var(--anyboom-spacing-1);
  border-radius: var(--anyboom-radius-5);
  width: fit-content;
  align-items: center;

  &__icon {
    display: flex;
    align-items: center;
  }

  &__removable {
    cursor: pointer;
    font-size: 12px;
  }

  &_variant {
    &_dismissable {
      background: var(--anyboom-chip-dismissable-background);
      border: 1px solid var(--anyboom-chip-dismissable-border);

      #{$this}__label {
        color: var(--anyboom-chip-dismissable-text);
      }

      #{$this}__icon {
        color: var(--anyboom-chip-dismissable-icon);
      }
    }
    &_link {
      background: var(--anyboom-chip-link-background);
      border: 1px solid var(--anyboom-chip-link-border);

      #{$this}__label {
        color: var(--anyboom-chip-link-text);
      }

      #{$this}__icon {
        color: var(--anyboom-chip-link-icon);
      }
    }
    &_filter {
      background: var(--anyboom-chip-filter-default-background);
      border: 1px solid var(--anyboom-chip-filter-default-border);
      cursor: pointer;

      #{$this}__label {
        color: var(--anyboom-chip-filter-default-text);
      }

      #{$this}__icon {
        color: var(--anyboom-chip-filter-default-icon);
      }

      &#{$this}_selected {
        background: var(--anyboom-chip-filter-active-background);
        border: 1px solid var(--anyboom-chip-filter-active-background);

        #{$this}__label {
          color: var(--anyboom-chip-filter-active-text);
        }

        #{$this}__icon {
          color: var(--anyboom-chip-filter-active-icon);
        }
      }
    }
  }

  &_size {
    &_small {
      padding: var(--anyboom-spacing-1) var(--anyboom-spacing-2);

      #{$this}__label {
        @include mixins.apply-text("body-xs");
      }
    }
    &_medium {
      padding: var(--anyboom-spacing-1) var(--anyboom-spacing-3);

      #{$this}__label {
        @include mixins.apply-text("body-sm");
      }
    }
    &_large {
      padding: var(--anyboom-spacing-1-5) var(--anyboom-spacing-4);

      #{$this}__label {
        @include mixins.apply-text("body-base");
      }
    }
  }
}
</style>
