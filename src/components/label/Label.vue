<script setup lang="ts">
import type { LabelRequired } from '@/components/label/label-required.ts'
import AsteriskIcon from '@iconify-vue/ph/asterisk'

import InfoBoldIcon from '@iconify-vue/ph/info-bold'
import TextDivider from '@/components/text-divider/TextDivider.vue'
import Tooltip from '@/components/tooltip/Tooltip.vue'

interface Props {
  size?: 'small' | 'medium' | 'large'
  required?: LabelRequired
  inputId?: string
  tooltip?: string
  text?: string
}

withDefaults(defineProps<Props>(), {
  size: 'medium',
  required: 'none',
})
</script>

<template>
  <span class="label" :class="[`label_size_${size}`]">
    <label class="label__label" :for="inputId">
      <span class="label__text">
        <slot>
          {{ text }}
        </slot>
      </span>
      <span
        v-if="required === 'optional'"
        class="label__required label__required_optional"
      >
        <TextDivider />
        Необязательное
      </span>
      <span
        v-if="required === 'asterisk'"
        class="label__required label__required_asterisk"
      >
        <AsteriskIcon height="1em" />
      </span>
    </label>

    <Tooltip v-if="$slots.tooltip || tooltip">
      <template #default>
        <slot name="icon-tooltip">
          <InfoBoldIcon class="label__icon-tooltip" height="1em" />
        </slot>
      </template>
      <template #content>
        <slot name="tooltip">
          {{ tooltip }}
        </slot>
      </template>
    </Tooltip>
  </span>
</template>

<style scoped lang="scss">
@use "@/styles/mixins";

.label {
  $this: &;

  display: flex;
  align-items: center;
  gap: var(--anyboom-spacing-2);

  &_size {
    &_small {
      #{$this}__text {
        @include mixins.apply-text("label-md");
      }

      #{$this}__required {
        &_optional {
          @include mixins.apply-text("body-xs");
        }
      }
    }
    &_medium {
      #{$this}__text {
        @include mixins.apply-text("label-lg");
      }

      #{$this}__required {
        &_optional {
          @include mixins.apply-text("body-base");
        }
      }
    }
    &_large {
      #{$this}__text {
        @include mixins.apply-text("body-lg-medium");
      }

      #{$this}__required {
        &_optional {
          @include mixins.apply-text("body-lg");
        }
      }
    }
  }

  &__required {
    display: flex;
    gap: var(--anyboom-spacing-1-5);
    align-items: center;

    &_asterisk {
      color: var(--anyboom-icon-neutral-default);
      align-items: unset;
      align-self: flex-start;
    }

    &_optional {
      color: var(--anyboom-label-required);
    }
  }

  &__icon-tooltip {
    color: var(--anyboom-icon-neutral-default);
  }

  &__label {
    display: inline-flex;
    align-items: center;
    gap: var(--anyboom-spacing-1-5);
    cursor: pointer;
  }

  &__text {
    color: var(--anyboom-label-text);
  }
}
</style>
