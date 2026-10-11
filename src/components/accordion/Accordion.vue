<script setup lang="ts">
import CaretDownIcon from '@iconify-vue/ph/caret-down'

interface Props {
  modelValue?: boolean
  disabled?: boolean
}

interface Emits {
  'update:modelValue': [value: boolean]
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  disabled: false,
})

const emit = defineEmits<Emits>()

function toggle(): void {
  emit('update:modelValue', !props.modelValue)
}
</script>

<template>
  <div
    class="anyboom-accordion"
    :class="{
      accordion_open: modelValue,
      accordion_disabled: disabled,
    }"
  >
    <button
      type="button"
      class="accordion__summary"
      :aria-expanded="modelValue"
      :disabled="disabled"
      @click="toggle"
    >
      <span class="accordion__title">
        <slot name="title" />
      </span>
      <CaretDownIcon
        class="accordion__icon"
        :class="{ accordion__icon_open: modelValue }"
        height="1em"
      />
    </button>

    <div v-if="modelValue" class="accordion__content" role="region">
      <slot />
    </div>
  </div>
</template>

<style lang="scss">
@use "@/styles/mixins";

.anyboom-accordion {
  $this: &;

  &_open > #{$this}__summary {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;

    border-top: 1px solid var(--anyboom-border-default);
    border-left: 1px solid var(--anyboom-border-default);
    border-right: 1px solid var(--anyboom-border-default);
    border-bottom: 1px solid transparent;
  }

  &:not(&_open) #{$this}__summary:not(:disabled):hover {
    border: 1px solid var(--anyboom-border-default);
    background: var(--anyboom-surface-secondary);
  }

  &__icon {
    color: var(--anyboom-icon-neutral-default);

    &_open {
      transform: rotate(180deg);
    }
  }

  &__title {
    color: var(--anyboom-text-brand);

    @include mixins.apply-text("body-sm-medium");
  }

  &__summary {
    width: 100%;
    font: inherit;
    text-align: left;
    background: var(--anyboom-surface-light);
    padding: var(--anyboom-spacing-6) var(--anyboom-spacing-4);
    border-radius: var(--anyboom-radius-small);
    cursor: pointer;
    user-select: none;
    border: 1px solid transparent;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &:hover:not(:disabled) {
      #{$this}__icon {
        color: var(--anyboom-icon-neutral-hover);
      }
    }

    &:focus-visible {
      outline: none;
      border-color: var(--anyboom-input-primary-border-focus);
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.4;
    }
  }

  &__content {
    background: var(--anyboom-surface-light);
    padding: var(--anyboom-spacing-6) var(--anyboom-spacing-4);
    color: var(--anyboom-text-brand);

    margin-top: -2px;
    border-radius: 0 0 var(--anyboom-radius-small) var(--anyboom-radius-small);

    border-bottom: 1px solid var(--anyboom-border-default);
    border-left: 1px solid var(--anyboom-border-default);
    border-right: 1px solid var(--anyboom-border-default);

    @include mixins.apply-text("body-sm");
  }
}
</style>
