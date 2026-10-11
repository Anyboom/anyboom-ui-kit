<script setup lang="ts">
interface Props {
  modelValue?: boolean
  label?: string
  inputId?: string
  disabled?: boolean
  readonly?: boolean
  error?: boolean
  indeterminate?: boolean
  size?: 'small' | 'medium' | 'large'
}

interface Emits {
  'update:modelValue': [value: boolean]
  'change': [event: Event, value: boolean]
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

  const value = target.checked

  emit('update:modelValue', value)
  emit('change', event, value)
}
</script>

<template>
  <label
    class="checkbox"
    :class="[
      `checkbox_size_${size}`,
      {
        checkbox_disabled: disabled,
        checkbox_readonly: readonly,
        checkbox_error: error,
      },
    ]"
  >
    <input
      :id="inputId"
      type="checkbox"
      class="checkbox__input"
      :checked="modelValue"
      :indeterminate="indeterminate"
      :disabled="disabled"
      :aria-invalid="error || undefined"
      @change="handleChange"
    >
    <span class="checkbox__checkmark" />
    <span v-if="label" class="checkbox__label">{{ label }}</span>
  </label>
</template>

<style scoped lang="scss">
@use "@/styles/mixins";

.checkbox {
  $this: &;

  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  gap: var(--anyboom-spacing-2);

  &_readonly {
    cursor: default;

    #{$this}__input {
      cursor: default;
    }
  }

  &__input {
    $input: &;

    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;

    &:disabled:checked + #{$this}__checkmark {
      opacity: 0.4;
    }

    &:checked + #{$this}__checkmark {
      background-color: var(--anyboom-checkbox-checked-background);
      border-color: var(--anyboom-checkbox-checked-background);
      color: white;

      &:before {
        content: "";
        position: absolute;
        background-color: currentColor;
        border-radius: 2px 0 0 2px;
        transform: rotate(45deg);
      }

      &:after {
        content: "";
        position: absolute;
        background-color: currentColor;
        border-radius: 0 2px 2px 0;
        transform: rotate(-45deg);
      }
    }

    &:indeterminate + #{$this}__checkmark {
      background-color: var(--anyboom-checkbox-checked-background);
      border-color: var(--anyboom-checkbox-checked-background);
      color: white;

      &:before {
        content: "";
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        height: 2px;
        background-color: currentColor;
        border-radius: 2px;
      }

      &:after {
        display: none;
      }
    }

    &:disabled:indeterminate + #{$this}__checkmark {
      opacity: 0.4;
    }
  }

  &__label {
    color: var(--anyboom-checkbox-text);

    @include mixins.apply-text("body-sm");
  }

  &_size {
    &_small {
      #{$this}__checkmark {
        height: 16px;
        width: 16px;
        border-radius: var(--anyboom-radius-tiny);
      }

      #{$this}__input:checked + #{$this}__checkmark {
        &:before {
          left: 2px;
          top: 7px;
          width: 6px;
          height: 2px;
          border-radius: 1px 0 1px 1px;
        }

        &:after {
          left: 5px;
          top: 6px;
          width: 8px;
          height: 2px;
          border-radius: 0 1px 1px 1px;
        }
      }

      #{$this}__input:indeterminate + #{$this}__checkmark {
        &:before {
          width: 9px;
        }
      }
    }
    &_medium {
      #{$this}__checkmark {
        height: 20px;
        width: 20px;
        border-radius: var(--anyboom-radius-small);
      }

      #{$this}__input:checked + #{$this}__checkmark {
        &:before {
          left: 3px;
          top: 8.7px;
          width: 7px;
          height: 2.5px;
        }

        &:after {
          left: 6px;
          top: 7.7px;
          width: 11px;
          height: 2.5px;
        }
      }

      #{$this}__input:indeterminate + #{$this}__checkmark {
        &:before {
          width: 10px;
        }
      }
    }
    &_large {
      #{$this}__checkmark {
        height: 24px;
        width: 24px;
        border-radius: var(--anyboom-radius-small);
      }

      #{$this}__input:checked + #{$this}__checkmark {
        &:before {
          left: 4px;
          top: 11px;
          width: 8px;
          height: 3px;
        }

        &:after {
          left: 8px;
          top: 9px;
          width: 11px;
          height: 3px;
        }
      }

      #{$this}__input:indeterminate + #{$this}__checkmark {
        &:before {
          width: 11px;
        }
      }
    }
  }

  &__checkmark {
    position: relative;
    background-color: var(--anyboom-checkbox-inactive-background);
    border: 1px solid var(--anyboom-checkbox-inactive-border);
  }

  &:hover:not(#{$this}_disabled) {
    #{$this}__input:not(:checked):not(:indeterminate) + #{$this}__checkmark {
      background-color: var(--anyboom-checkbox-inactive-hover-background);
      border-color: var(--anyboom-checkbox-inactive-hover-border);
    }

    #{$this}__input:checked + #{$this}__checkmark,
    #{$this}__input:indeterminate + #{$this}__checkmark {
      background-color: var(--anyboom-checkbox-checked-hover-background);
      border-color: var(--anyboom-checkbox-checked-hover-background);
    }

    #{$this}__input:checked + #{$this}__checkmark:before,
    #{$this}__input:checked + #{$this}__checkmark:after,
    #{$this}__input:indeterminate + #{$this}__checkmark:before {
      background-color: var(--anyboom-checkbox-checked-hover-icon);
    }
  }

  &_error:not(#{$this}_disabled) {
    #{$this}__input + #{$this}__checkmark {
      border-color: var(--anyboom-input-danger-border);
    }

    &:hover #{$this}__input:not(:checked):not(:indeterminate) + #{$this}__checkmark {
      border-color: var(--anyboom-input-danger-border-hover);
    }
  }

  &_disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }
}
</style>
