<script setup lang="ts">
import { computed, nextTick, onMounted, ref, useId, watch } from 'vue'

interface Props {
  length?: number
  modelValue?: string
  inputId?: string
  ariaLabel?: string
  size?: 'small' | 'medium'
  disabled?: boolean
  autofocus?: boolean
  invalid?: boolean
  type?: 'text' | 'password'
  numeric?: boolean
  shape?: 'square' | 'circle'
  error?: boolean
  success?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  length: 6,
  modelValue: '',
  inputId: undefined,
  ariaLabel: undefined,
  size: 'medium',
  type: 'text',
  shape: 'square',
  disabled: false,
  autofocus: false,
  invalid: false,
  numeric: false,
})

const emit = defineEmits<Emits>()

interface Emits {
  'update:modelValue': [value: string]
  'complete': [value: string]
  'enter': [value: string]
}

const values = ref<string[]>(Array(props.length).fill(''))
const inputRefs = ref<(HTMLInputElement | null)[]>(Array(props.length).fill(null))
const focusedIndex = ref<number>(-1)
const fullValue = computed(() => values.value.join(''))

const autoId = useId()
const fieldId = computed(() => props.inputId ?? autoId)

defineExpose({
  inputId: fieldId,
})

function setInputRef(el: unknown, index: number) {
  if (el instanceof HTMLInputElement) {
    inputRefs.value[index] = el
  }
}

function focusInput(index: number) {
  const input = inputRefs.value[index]

  if (input && !props.disabled) {
    nextTick(() => {
      input.focus()
      input.select()
    })
  }
}

function handleInput(index: number, event: Event) {
  const target = event.target as HTMLInputElement
  let value = target.value

  if (props.numeric) {
    value = value.replace(/\D/g, '')
  }

  value = value.slice(0, 1)

  const newValues = [...values.value]
  newValues[index] = value
  values.value = newValues

  if (value.length === 1 && index < props.length - 1) {
    focusInput(index + 1)
  }

  emit('update:modelValue', fullValue.value)

  if (fullValue.value.length === props.length) {
    emit('complete', fullValue.value)
  }
}

function handleKeydown(index: number, event: KeyboardEvent) {
  switch (event.key) {
    case 'Enter':
      event.preventDefault()
      emit('enter', fullValue.value)
      break
    case 'Backspace':
      if (values.value[index] === '' && index > 0) {
        event.preventDefault()
        focusInput(index - 1)
      }
      else if (values.value[index] !== '') {
        const newValues = [...values.value]
        newValues[index] = ''
        values.value = newValues
        emit('update:modelValue', fullValue.value)
        event.preventDefault()
      }
      break
    case 'Delete':
      if (values.value[index] !== '') {
        const newValues = [...values.value]
        newValues[index] = ''
        values.value = newValues
        emit('update:modelValue', fullValue.value)
        event.preventDefault()
      }
      break
    case 'ArrowLeft':
      event.preventDefault()

      if (index > 0) {
        focusInput(index - 1)
      }
      break
    case 'ArrowRight':
      event.preventDefault()

      if (index < props.length - 1) {
        focusInput(index + 1)
      }
      break
  }
}

function handleFocus(index: number) {
  focusedIndex.value = index
}

function handleBlur() {
  focusedIndex.value = -1
}

function handlePaste(event: ClipboardEvent) {
  event.preventDefault()

  const pasteData = event.clipboardData?.getData('text') || ''

  let code = pasteData.trim()

  if (props.numeric) {
    code = code.replace(/\D/g, '')
  }

  code = code.slice(0, props.length)

  if (code.length > 0) {
    const newValues = [...values.value]

    for (let i = 0; i < code.length; i++) {
      if (i < props.length) {
        newValues[i] = code[i]
      }
    }

    values.value = newValues
    emit('update:modelValue', fullValue.value)

    const nextIndex = Math.min(code.length, props.length - 1)
    focusInput(nextIndex)

    if (fullValue.value.length === props.length) {
      emit('complete', fullValue.value)
    }
  }
}

watch(
  () => props.modelValue,
  (newVal) => {
    if (!newVal) {
      values.value = Array(props.length).fill('')
      return
    }

    if (newVal.length !== props.length) {
      return
    }

    const chars = newVal.split('')

    values.value = chars.map((char, index) => {
      if (index >= props.length)
        return ''
      return props.numeric ? char.replace(/\D/g, '') : char
    })
  },
  { immediate: true },
)

onMounted(toAutofocus)

function toAutofocus() {
  if (props.autofocus && !props.disabled) {
    focusInput(0)
  }
}
</script>

<template>
  <div
    class="input-otp"
    :class="[
      `input-otp_size_${size}`,
      `input-otp_shape_${shape}`,
      {
        'input-otp_disabled': disabled,
        'input-otp_status_error': error,
        'input-otp_status_success': success,
      },
    ]"
  >
    <input
      v-for="(_, index) in length"
      :id="index === 0 ? fieldId : undefined"
      :ref="(el) => setInputRef(el, index)"
      :key="index"
      v-model="values[index]"
      class="input-otp__input"
      :class="{
        'input-otp__input_disabled': disabled,
        'input-otp__input_status_error': error,
        'input-otp__input_status_success': success,
      }"
      :type="type"
      :maxlength="1"
      :disabled="disabled"
      :autofocus="index === 0 && autofocus"
      :aria-label="ariaLabel || undefined"
      @input="handleInput(index, $event)"
      @keydown="handleKeydown(index, $event)"
      @focus="handleFocus(index)"
      @blur="handleBlur"
      @paste="handlePaste($event)"
    >
  </div>
</template>

<style scoped lang="scss">
@use "@/styles/mixins";

.input-otp {
  $this: &;

  display: inline-flex;
  width: 100%;

  &_status {
    &_error {
      #{$this}__input {
        border: 1px solid var(--anyboom-input-danger-border);
        color: var(--anyboom-input-danger-text);
      }
    }

    &_success {
      #{$this}__input {
        border: 1px solid var(--anyboom-input-success-border);
        color: var(--anyboom-input-success-text);
      }
    }
  }

  &_shape {
    &_square {
      &#{$this}_size_small {
        #{$this}__input {
          border-radius: var(--anyboom-radius-small);
        }
      }

      &#{$this}_size_medium {
        #{$this}__input {
          border-radius: var(--anyboom-radius-main);
        }
      }
    }

    &_circle {
      &#{$this}_size_small,
      &#{$this}_size_medium {
        #{$this}__input {
          border-radius: var(--anyboom-radius-full);
        }
      }
    }
  }

  &_size {
    &_small {
      gap: var(--anyboom-spacing-2);

      #{$this}__input {
        width: 32px;

        @include mixins.apply-text("input-opt-sm");
      }
    }

    &_medium {
      gap: var(--anyboom-spacing-3);

      #{$this}__input {
        width: 40px;

        @include mixins.apply-text("input-opt-md");
      }
    }
  }

  &_disabled {
    cursor: not-allowed;
  }

  &__input {
    flex-shrink: 1;
    aspect-ratio: 1;
    min-width: 0;
    text-align: center;

    background: var(--anyboom-input-primary-background);
    border: 1px solid var(--anyboom-input-primary-border);
    color: var(--anyboom-input-primary-text);
    font-variant-numeric: tabular-nums;

    &:not(&_disabled):not(&_status_error):not(&_status_success) {
      &:hover {
        border-color: var(--anyboom-input-primary-border-hover);
      }

      &:focus {
        border-color: var(--anyboom-input-primary-border-focus);
      }
    }

    &:disabled {
      cursor: not-allowed;
      background: var(--anyboom-input-disabled-background);
      border-color: var(--anyboom-input-disabled-border);
      color: var(--anyboom-input-disabled-text);
    }
  }
}
</style>
