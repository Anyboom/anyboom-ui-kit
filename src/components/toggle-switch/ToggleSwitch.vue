<script setup lang="ts">
interface Props {
  modelValue?: boolean
  label?: string
  inputId?: string
  disabled?: boolean
  readonly?: boolean
  error?: boolean
  size?: 'small' | 'medium' | 'large'
}

interface Emits {
  'update:modelValue': [value: boolean]
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  disabled: false,
  readonly: false,
  error: false,
  size: 'medium',
})

const emit = defineEmits<Emits>()

function handleChange(event: Event) {
  const target = event.target as HTMLInputElement

  if (props.disabled) {
    return
  }

  if (props.readonly) {
    target.checked = props.modelValue
    return
  }

  emit('update:modelValue', target.checked)
}
</script>

<template>
  <label
    class="toggle-switch"
    :class="[
      `toggle-switch_size_${size}`,
      {
        'toggle-switch_checked': modelValue,
        'toggle-switch_disabled': disabled,
        'toggle-switch_readonly': readonly,
        'toggle-switch_error': error,
      },
    ]"
  >
    <input
      :id="inputId"
      type="checkbox"
      class="toggle-switch__input"
      :checked="modelValue"
      :disabled="disabled"
      :aria-invalid="error || undefined"
      @change="handleChange"
    >
    <span class="toggle-switch__slider">
      <span class="toggle-switch__thumb" />
    </span>
    <span v-if="label" class="toggle-switch__label">{{ label }}</span>
  </label>
</template>

<style lang="scss" scoped>
@use "@/styles/mixins";

.toggle-switch {
  $this: &;

  display: inline-flex;
  align-items: center;
  gap: var(--anyboom-spacing-2);
  cursor: pointer;
  user-select: none;
  position: relative;

  @include mixins.disabled;

  &_readonly {
    cursor: default;
  }

  &_error:not(&_disabled) {
    #{$this}__slider {
      box-shadow: 0 0 0 1px var(--anyboom-input-danger-border);
    }
  }

  &_checked {
    #{$this}__slider {
      background-color: var(--anyboom-toggle-switch-checked-background);
    }

    #{$this}__thumb {
      background-color: var(--anyboom-toggle-switch-checked-icon);
    }
  }

  &:hover:not(.disabled) {
    #{$this}__input:not(:checked) + #{$this}__slider {
      background-color: var(--anyboom-toggle-switch-inactive-hover-background);

      #{$this}__thumb {
        background-color: var(--anyboom-toggle-switch-inactive-hover-icon);
      }
    }

    #{$this}__input:checked + #{$this}__slider {
      background-color: var(--anyboom-toggle-switch-checked-hover-background);

      #{$this}__thumb {
        background-color: var(--anyboom-toggle-switch-checked-hover-icon);
      }
    }
  }

  &__input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
    pointer-events: none;
  }

  &__slider {
    position: relative;
    display: inline-block;
    border-radius: var(--anyboom-radius-full);
    background-color: var(--anyboom-toggle-switch-inactive-background);
    flex-shrink: 0;
  }

  &__thumb {
    position: absolute;
    left: 0;
    border-radius: 50%;
    background-color: var(--anyboom-toggle-switch-inactive-icon);
    top: 50%;
  }

  &__label {
    color: var(--anyboom-radio-text);

    @include mixins.apply-text("body-sm");
  }

  &_size {
    &_small {
      #{$this}__slider {
        width: 32px;
        height: 20px;
      }
      #{$this}__thumb {
        width: 16px;
        height: 16px;
        transform: translateX(2px) translateY(-50%);
        top: 50%;
      }
      &#{$this}_checked #{$this}__thumb {
        transform: translateX(14px) translateY(-50%);
      }
    }
    &_medium {
      #{$this}__slider {
        width: 40px;
        height: 24px;
      }
      #{$this}__thumb {
        width: 20px;
        height: 20px;
        transform: translateX(2px) translateY(-50%);
        top: 50%;
      }
      &#{$this}_checked #{$this}__thumb {
        transform: translateX(18px) translateY(-50%);
      }
    }
    &_large {
      #{$this}__slider {
        width: 48px;
        height: 28px;
      }
      #{$this}__thumb {
        width: 24px;
        height: 24px;
        transform: translateX(2px) translateY(-50%);
        top: 50%;
      }
      &#{$this}_checked #{$this}__thumb {
        transform: translateX(22px) translateY(-50%);
      }
    }
  }
}
</style>
