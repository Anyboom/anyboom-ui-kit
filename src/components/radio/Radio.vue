<script setup lang="ts">
interface Props {
  modelValue?: string | number | boolean
  label?: string
  inputId?: string
  name?: string
  disabled?: boolean
  readonly?: boolean
  error?: boolean
  value?: string | number | boolean
  size?: 'small' | 'medium' | 'large'
}

interface Emits {
  'update:modelValue': [value: string | number | boolean]
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  modelValue: undefined,
  value: undefined,
})

const emit = defineEmits<Emits>()

function handleChange(event: Event) {
  const target = event.target as HTMLInputElement

  if (props.disabled) {
    return
  }

  if (props.readonly) {
    target.checked = props.modelValue === props.value
    return
  }

  emit('update:modelValue', props.value as string | number | boolean)
}
</script>

<template>
  <label
    class="radio"
    :class="[
      `radio_size_${size}`,
      {
        radio_disabled: disabled,
        radio_readonly: readonly,
        radio_error: error,
      },
    ]"
  >
    <input
      :id="inputId"
      type="radio"
      class="radio__input"
      :name="name"
      :checked="modelValue === value"
      :disabled="disabled"
      :value="value"
      :aria-invalid="error || undefined"
      @change="handleChange"
    >
    <span class="radio__checkmark" />
    <span v-if="label" class="radio__label">{{ label }}</span>
  </label>
</template>

<style scoped lang="scss">
@use "@/styles/mixins";

.radio {
  $this: &;

  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  gap: var(--anyboom-spacing-2);

  @include mixins.disabled;

  &__input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;

    &:checked + #{$this}__checkmark {
      background-color: var(--anyboom-radio-checked-border);
      border-color: var(--anyboom-radio-checked-border);

      &:after {
        content: "";
        position: absolute;
        border-radius: 50%;
        background-color: var(--anyboom-radio-checked-background);
      }

      &:hover {
        background-color: var(--anyboom-radio-checked-hover-border);
        border-color: var(--anyboom-radio-checked-hover-border);

        &:after {
          background-color: var(--anyboom-radio-checked-hover-background);
        }
      }
    }
  }

  &__label {
    color: var(--anyboom-radio-text);

    @include mixins.apply-text("body-sm");
  }

  &_size {
    &_small {
      #{$this}__checkmark {
        height: 16px;
        width: 16px;

        &:after {
          left: 2px;
          top: 2px;
          width: 8px;
          height: 8px;
        }
      }
    }
    &_medium {
      #{$this}__checkmark {
        height: 20px;
        width: 20px;

        &:after {
          left: 3px;
          top: 3px;
          width: 10px;
          height: 10px;
        }
      }
    }
    &_large {
      #{$this}__checkmark {
        height: 24px;
        width: 24px;

        &:after {
          left: 3px;
          top: 3px;
          width: 14px;
          height: 14px;
        }
      }
    }
  }

  &__checkmark {
    position: relative;
    background-color: var(--anyboom-radio-inactive-background);
    border: 2px solid var(--anyboom-radio-inactive-border);
    border-radius: 50%;
    flex-shrink: 0;
  }

  &:hover:not(.disabled) {
    #{$this}__input:not(:checked) + #{$this}__checkmark {
      background-color: var(--anyboom-radio-inactive-hover-background);
      border-color: var(--anyboom-radio-inactive-hover-border);
    }

    #{$this}__input:checked + #{$this}__checkmark {
      background-color: var(--anyboom-radio-checked-hover-border);
      border-color: var(--anyboom-radio-checked-hover-border);
    }
  }

  &_readonly {
    cursor: default;

    #{$this}__input {
      cursor: default;
    }
  }

  &_error:not(#{$this}_disabled) {
    #{$this}__input + #{$this}__checkmark {
      border-color: var(--anyboom-input-danger-border);
    }

    &:hover #{$this}__input:not(:checked) + #{$this}__checkmark {
      border-color: var(--anyboom-input-danger-border-hover);
    }
  }
}
</style>
