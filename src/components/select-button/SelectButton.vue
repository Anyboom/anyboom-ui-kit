<script setup lang="ts">
interface Props {
  modelValue?: unknown
  options?: unknown[]
  optionLabel?: string | ((option: unknown) => string)
  optionValue?: string | ((option: unknown) => unknown)
  optionDisabled?: string | ((option: unknown) => boolean)
  multiple?: boolean
  allowEmpty?: boolean
  disabled?: boolean
  readonly?: boolean
  ariaLabelledby?: string
}

const props = withDefaults(defineProps<Props>(), {
  options: () => [],
  optionLabel: 'label',
  optionValue: 'value',
  optionDisabled: 'disabled',
  multiple: false,
  allowEmpty: true,
  disabled: false,
  readonly: false,
  ariaLabelledby: '',
})

const emit = defineEmits<Emits>()

interface Emits {
  'update:modelValue': [value: unknown]
}

function getOptionLabel(option: unknown): string {
  if (typeof props.optionLabel === 'function') {
    return String(props.optionLabel(option))
  }

  if (option !== undefined && typeof option === 'object') {
    return String((option as Record<string, unknown>)[props.optionLabel] ?? '')
  }

  return String(option)
}

function getOptionValue(option: unknown): unknown {
  if (typeof props.optionValue === 'function') {
    return props.optionValue(option)
  }

  if (option !== undefined && typeof option === 'object') {
    return (option as Record<string, unknown>)[props.optionValue]
  }

  return option
}

function isOptionDisabled(option: unknown): boolean {
  if (props.disabled) {
    return true
  }

  if (typeof props.optionDisabled === 'function') {
    return props.optionDisabled(option)
  }

  if (option !== undefined && typeof option === 'object') {
    return !!(option as Record<string, unknown>)[props.optionDisabled]
  }

  return false
}

function isSelected(option: unknown): boolean {
  const value = getOptionValue(option)

  if (props.multiple && Array.isArray(props.modelValue)) {
    return props.modelValue.some(item => item === value)
  }

  return props.modelValue === value
}

function handleSelect(option: unknown): void {
  if (isOptionDisabled(option) || props.readonly) {
    return
  }

  const value = getOptionValue(option)
  let newValue: unknown

  if (props.multiple) {
    const currentValue = Array.isArray(props.modelValue)
      ? props.modelValue
      : []

    if (isSelected(option)) {
      if (!props.allowEmpty && currentValue.length <= 1) {
        return
      }

      newValue = currentValue.filter(item => item !== value)
    }
    else {
      newValue = [...currentValue, value]
    }
  }
  else {
    if (isSelected(option) && props.allowEmpty) {
      newValue = null
    }
    else {
      newValue = value
    }
  }

  emit('update:modelValue', newValue)
}
</script>

<template>
  <div
    class="select-button"
    :class="{ 'select-button_disabled': disabled, 'select-button_readonly': readonly }"
    role="group"
    :aria-labelledby="ariaLabelledby || undefined"
    :aria-readonly="readonly || undefined"
  >
    <button
      v-for="(option, index) in options"
      :key="index"
      type="button"
      class="select-button__item"
      :class="{ 'select-button__item_active': isSelected(option) }"
      :disabled="isOptionDisabled(option)"
      :aria-pressed="isSelected(option)"
      @click="handleSelect(option)"
    >
      <slot name="item" :option="option" :index="index">
        {{ getOptionLabel(option) }}
      </slot>
    </button>
  </div>
</template>

<style scoped lang="scss">
@use "@/styles/mixins";

.select-button {
  $this: &;

  display: inline-flex;

  @include mixins.disabled;

  &_readonly &__item {
    cursor: default;

    &:hover:not(:disabled) {
      z-index: 1;
      background: var(--anyboom-surface-primary);
      border-color: var(--anyboom-border-default);
    }
  }

  &__item {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--anyboom-spacing-2);
    padding: var(--anyboom-spacing-2) var(--anyboom-spacing-4);
    border: 1px solid var(--anyboom-border-default);
    background: var(--anyboom-surface-primary);
    color: var(--anyboom-text-primary);
    cursor: pointer;
    outline: none;

    @include mixins.apply-text("button-sm");

    &:not(:first-child) {
      margin-left: -1px;
    }

    &:first-child {
      border-radius: var(--anyboom-radius-small) 0 0 var(--anyboom-radius-small);
    }

    &:last-child {
      border-radius: 0 var(--anyboom-radius-small) var(--anyboom-radius-small) 0;
    }

    &:hover:not(:disabled) {
      z-index: 1;
      background: var(--anyboom-surface-light);
      border-color: var(--anyboom-border-strong);
    }

    &:focus-visible:not(:disabled) {
      z-index: 2;
      border-color: var(--anyboom-border-focus);
    }

    &_active:not(:disabled) {
      z-index: 1;
      background: var(--anyboom-surface-brand);
      border-color: var(--anyboom-border-brand);
      color: var(--anyboom-text-inverse);

      &:hover {
        background: var(--anyboom-surface-brand-hover);
        border-color: var(--anyboom-border-brand-hover);
      }

      &:focus-visible {
        border-color: var(--anyboom-border-focus);
      }
    }

    &:disabled {
      cursor: not-allowed;
    }
  }
}
</style>
