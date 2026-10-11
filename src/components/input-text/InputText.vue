<script setup lang="ts">
import type { EnterKeyHint } from '@/components/input-text/enter-key-hint.ts'

import type { InputMode } from '@/components/input-text/input-mode.ts'
import type { InputType } from '@/components/input-text/input-type.ts'
import { computed, nextTick, onMounted, ref, useId, watch } from 'vue'
import {
  applyMask,
  shouldClearMaskedValue,
  unmaskValue,
} from '@/components/input-text/input-mask.ts'

interface Props {
  size?: 'small' | 'medium' | 'large'
  inputId?: string
  modelValue?: string | number
  placeholder?: string
  disabled?: boolean
  error?: boolean
  success?: boolean
  mask?: string | null
  type?: InputType
  readonly?: boolean
  autofocus?: boolean
  autocomplete?: string
  inputmode?: InputMode
  enterkeyhint?: EnterKeyHint
  defaultValue?: string | number
  ariaLabel?: string
  ariaDescribedby?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  inputId: undefined,
  modelValue: '',
  placeholder: '',
  disabled: false,
  error: false,
  success: false,
  mask: null,
  type: 'text',
  readonly: false,
  autofocus: false,
  autocomplete: 'off',
  inputmode: 'text',
  enterkeyhint: 'enter',
  defaultValue: '',
  ariaLabel: '',
  ariaDescribedby: '',
})

const emit = defineEmits<Emits>()

interface Emits {
  'update:modelValue': [value: string | number]
}

const inputElement = ref<HTMLInputElement | undefined>(undefined)

const autoId = useId()
const fieldId = computed(() => props.inputId ?? autoId)

const inputType = computed(() => {
  if (props.mask) {
    return 'text'
  }

  return props.type
})

function fixCaret(
  target: HTMLInputElement,
  oldValue: string,
  newValue: string,
  caret: number,
  isDelete: boolean,
): void {
  if (caret === oldValue.length && !isDelete) {
    return
  }

  const oldPrefix = oldValue.slice(0, caret)
  const newPrefix = newValue.slice(0, caret)

  if (oldPrefix === newPrefix) {
    return
  }

  const newCaret = isDelete
    ? caret + newValue.length - oldValue.length
    : caret
      + unmaskValue(oldPrefix, props.mask).length
      - unmaskValue(newPrefix, props.mask).length

  target.setSelectionRange(newCaret, newCaret)
}

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  const inputEvent = event as InputEvent
  const isDelete = inputEvent.inputType?.startsWith('delete') ?? false
  const oldValue = target.value

  let newValue = applyMask(oldValue, props.mask)

  if (isDelete && shouldClearMaskedValue(oldValue, props.mask)) {
    newValue = ''
  }

  if (newValue !== oldValue) {
    const caret = target.selectionStart
    target.value = newValue

    if (caret !== null) {
      fixCaret(target, oldValue, newValue, caret, isDelete)
    }
  }

  emit('update:modelValue', target.value)
}

function focus() {
  inputElement.value?.focus()
}

defineExpose({
  focus,
  inputId: fieldId,
})

watch(
  () => props.modelValue,
  (newValue) => {
    if (inputElement.value === undefined) {
      return
    }

    if (document.activeElement === inputElement.value) {
      return
    }

    if (props.mask) {
      inputElement.value.value = applyMask(String(newValue), props.mask)
    }
  },
)

onMounted(() => {
  if (props.defaultValue && !props.modelValue) {
    emit('update:modelValue', props.defaultValue)
  }

  if (props.mask && inputElement.value) {
    const masked = applyMask(inputElement.value.value, props.mask)

    if (masked !== inputElement.value.value) {
      inputElement.value.value = masked
      emit('update:modelValue', masked)
    }
  }

  if (props.autofocus) {
    nextTick(focus)
  }
})
</script>

<template>
  <div
    class="input-text"
    :class="[
      `input-text_size_${size}`,
      {
        'input-text_disabled': disabled,
        'input-text_error': error,
        'input-text_success': success,
      },
    ]"
  >
    <div class="input-text__wrapper">
      <div
        v-if="$slots['icon-left']"
        class="input-text__icon input-text__icon_left"
      >
        <slot name="icon-left" />
      </div>

      <input
        :id="fieldId"
        ref="inputElement"
        class="input-text__input"
        :type="inputType"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :autofocus="autofocus"
        :autocomplete="autocomplete"
        :inputmode="inputmode"
        :enterkeyhint="enterkeyhint"
        :aria-label="ariaLabel || undefined"
        :aria-describedby="ariaDescribedby || undefined"
        @input="handleInput"
      >

      <div
        v-if="$slots['icon-right']"
        class="input-text__icon input-text__icon_right"
      >
        <slot name="icon-right" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/styles/mixins";

.input-text {
  $this: &;
  display: flex;
  flex-direction: column;

  &_disabled {
    cursor: not-allowed;
  }

  &_error {
    #{$this}__input {
      border: 1px solid var(--anyboom-input-negative-border);

      &:hover {
        border: 1px solid var(--anyboom-input-negative-border-hover);
      }

      &:focus {
        border-color: var(--anyboom-input-negative-border-focus);
        background: var(--anyboom-input-negative-background);
      }
    }
  }

  &_success {
    #{$this}__input {
      border: 1px solid var(--anyboom-input-positive-border);

      &:hover {
        border: 1px solid var(--anyboom-input-positive-border-hover);
      }

      &:focus {
        border-color: var(--anyboom-input-positive-border-focus);
        background: var(--anyboom-input-positive-background);
      }
    }
  }

  &__wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  &_size {
    &_small {
      #{$this}__input {
        padding: var(--anyboom-spacing-2) var(--anyboom-spacing-3);

        @include mixins.apply-text("input-md");
      }
    }
    &_medium {
      #{$this}__input {
        padding: var(--anyboom-spacing-3) var(--anyboom-spacing-4);

        @include mixins.apply-text("input-md");
      }
    }
    &_large {
      #{$this}__input {
        padding: var(--anyboom-spacing-2-5) var(--anyboom-spacing-4);

        @include mixins.apply-text("input-lg");
      }
    }
  }

  &__input {
    flex: 1;
    color: var(--anyboom-input-primary-text);
    background: var(--anyboom-input-primary-background);
    border: 1px solid var(--anyboom-input-primary-border);
    border-radius: var(--anyboom-radius-small);
    outline: none;

    &:hover {
      border-color: var(--anyboom-input-primary-border-hover);
    }

    &:focus {
      border-color: var(--anyboom-input-primary-border-focus);
    }

    &::placeholder {
      color: var(--anyboom-input-primary-placeholder);
    }

    &:disabled {
      background: var(--anyboom-input-disabled-background);
      border-color: var(--anyboom-input-disabled-border);
      cursor: not-allowed;

      &::placeholder {
        color: var(--anyboom-input-disabled-placeholder);
      }
    }
  }

  &__icon {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--anyboom-spacing-8);
    height: var(--anyboom-spacing-8);
    pointer-events: none;
    color: var(--anyboom-input-primary-icon);

    @include mixins.apply-text("body-base");

    &_left {
      left: var(--anyboom-spacing-1);
    }

    &_right {
      right: var(--anyboom-spacing-1);
    }
  }

  #{$this}__icon_left + #{$this}__input {
    padding-left: var(--anyboom-spacing-10);
  }

  #{$this}__wrapper:has(#{$this}__icon_right) #{$this}__input {
    padding-right: var(--anyboom-spacing-10);
  }
}
</style>
