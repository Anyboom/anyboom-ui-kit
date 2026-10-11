<script setup lang="ts">
import { computed, useId } from 'vue'

interface Props {
  modelValue?: boolean
  onLabel?: string
  offLabel?: string
  iconPos?: 'left' | 'right'
  size?: 'small' | 'medium' | 'large'
  inputId?: string
  disabled?: boolean
  readonly?: boolean
  ariaLabel?: string
  ariaDescribedby?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  onLabel: '',
  offLabel: '',
  iconPos: 'left',
  size: 'medium',
  inputId: undefined,
  disabled: false,
  readonly: false,
  ariaLabel: '',
  ariaDescribedby: '',
})

const emit = defineEmits<Emits>()

interface Emits {
  'update:modelValue': [value: boolean]
}

const autoId = `toggle-button-${useId()}`
const fieldId = computed(() => props.inputId ?? autoId)

const label = computed(() => {
  return props.modelValue ? props.onLabel : props.offLabel
})

function handleClick(): void {
  if (props.disabled || props.readonly) {
    return
  }

  emit('update:modelValue', !props.modelValue)
}

defineExpose({
  inputId: fieldId,
})
</script>

<template>
  <button
    :id="fieldId"
    type="button"
    class="toggle-button"
    :class="[
      `toggle-button_icon-pos_${iconPos}`,
      `toggle-button_size_${size}`,
      {
        'toggle-button_active': modelValue,
        'toggle-button_disabled': disabled,
      },
    ]"
    :disabled="disabled"
    :aria-pressed="modelValue"
    :aria-label="ariaLabel || label || undefined"
    :aria-describedby="ariaDescribedby || undefined"
    @click="handleClick"
  >
    <slot :active="modelValue" :label="label">
      <span v-if="$slots.icon" class="toggle-button__icon">
        <slot name="icon" :active="modelValue" />
      </span>
      <span v-if="label" class="toggle-button__label">{{ label }}</span>
    </slot>
  </button>
</template>

<style scoped lang="scss">
@use "@/styles/mixins";

.toggle-button {
  $this: &;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  height: fit-content;
  gap: var(--anyboom-spacing-2);
  border: 1px solid var(--anyboom-border-default);
  background: var(--anyboom-surface-primary);
  color: var(--anyboom-text-primary);
  cursor: pointer;
  outline: none;

  &_size {
    &_small {
      padding: var(--anyboom-spacing-1-5) var(--anyboom-spacing-3);
      border-radius: var(--anyboom-radius-small);

      @include mixins.apply-text("button-sm");

      #{$this}__icon {
        height: var(--anyboom-spacing-5);
      }
    }

    &_medium {
      padding: var(--anyboom-spacing-2) var(--anyboom-spacing-4);
      border-radius: var(--anyboom-radius-small);

      @include mixins.apply-text("button-md");

      #{$this}__icon {
        height: var(--anyboom-spacing-5);
      }
    }

    &_large {
      padding: var(--anyboom-spacing-2-5) var(--anyboom-spacing-5);
      border-radius: var(--anyboom-radius-main);

      @include mixins.apply-text("button-lg");

      #{$this}__icon {
        height: var(--anyboom-spacing-6);
      }
    }
  }

  &:hover:not(:disabled) {
    background: var(--anyboom-surface-light);
    border-color: var(--anyboom-border-strong);
  }

  &:focus-visible:not(:disabled) {
    border-color: var(--anyboom-border-focus);
  }

  &_active:not(:disabled) {
    background: var(--anyboom-surface-brand);
    border-color: var(--anyboom-border-brand);
    color: var(--anyboom-text-inverse);

    &:hover {
      background: var(--anyboom-surface-brand-hover);
      border-color: var(--anyboom-border-brand-hover);
    }
  }

  &_disabled,
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  &__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: inherit;
  }

  &__label {
    color: inherit;
  }

  &_icon-pos_right {
    #{$this}__icon {
      order: 1;
    }

    #{$this}__label {
      order: 0;
    }
  }
}
</style>
