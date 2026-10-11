<script setup lang="ts">
import type { Ref } from 'vue'
import type { InputNumberButtonLayout } from '@/components/input-number/input-number-button-layout.ts'
import CaretDownIcon from '@iconify-vue/ph/caret-down'

import CaretUpIcon from '@iconify-vue/ph/caret-up'
import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,

  ref,
  useId,
  watch,
} from 'vue'
import { inputNumberConstants } from '@/components/input-number/input-number-constants.ts'

interface Emits {
  'update:modelValue': [value: number]
}

interface Props {
  modelValue?: number | string | null
  inputId?: string
  required?: boolean
  placeholder?: string
  disabled?: boolean
  error?: boolean
  hidden?: boolean
  min?: number
  max?: number
  step?: number
  integer?: boolean
  minFractionDigits?: number
  maxFractionDigits?: number
  useGrouping?: boolean
  decimalSeparator?: string
  groupingSeparator?: string
  prefix?: string
  suffix?: string
  showButtons?: boolean
  buttonLayout?: InputNumberButtonLayout
  readonly?: boolean
  autofocus?: boolean
  autocomplete?: string
  defaultValue?: number | string | null
  ariaLabel?: string
  ariaDescribedby?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  inputId: undefined,
  required: false,
  placeholder: '',
  disabled: false,
  hidden: false,
  min: -Infinity,
  max: Infinity,
  step: inputNumberConstants.STEP,
  integer: false,
  minFractionDigits: inputNumberConstants.MIN_FRACTION_DIGITS,
  maxFractionDigits: inputNumberConstants.MAX_FRACTION_DIGITS,
  useGrouping: false,
  decimalSeparator: inputNumberConstants.SEPARATORS.DECIMAL,
  groupingSeparator: inputNumberConstants.SEPARATORS.GROUPING,
  prefix: '',
  suffix: '',
  showButtons: false,
  buttonLayout: 'horizontal',
  readonly: false,
  autofocus: false,
  autocomplete: 'off',
  defaultValue: null,
  ariaLabel: '',
  ariaDescribedby: '',
})

const emit = defineEmits<Emits>()

const inputElement: Ref<HTMLInputElement | null> = ref(null)
const isFocused = ref(false)
const inputDisplayValue = ref('')
const numericValue = ref<number | null>(getInitialNumericValue())

const autoId = useId()
const fieldId = computed(() => props.inputId ?? autoId)

let longPressTimer: ReturnType<typeof setTimeout> | null = null

let decimalRegex: RegExp
let groupingRegex: RegExp
let minusSignRegex: RegExp
let prefixRegex: RegExp
let suffixRegex: RegExp

function getInitialNumericValue(): number | null {
  if (props.modelValue === undefined) {
    return null
  }

  const num
    = typeof props.modelValue === 'number'
      ? props.modelValue
      : parseFloat(props.modelValue ?? '')
  return isNaN(num) ? null : num
}

function escapeRegExp(text: string): string {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}

function buildRegularExpressions(): void {
  const decimalSep
    = props.decimalSeparator || inputNumberConstants.SEPARATORS.DECIMAL
  decimalRegex = new RegExp(`[${decimalSep}]`, 'g')

  const groupingChar
    = props.useGrouping && props.groupingSeparator ? props.groupingSeparator : ''
  groupingRegex = groupingChar
    ? new RegExp(`[${groupingChar}]`, 'g')
    : /^$/g

  minusSignRegex = /[-−]/g

  prefixRegex = props.prefix
    ? new RegExp(escapeRegExp(props.prefix), 'g')
    : /^$/g
  suffixRegex = props.suffix
    ? new RegExp(escapeRegExp(props.suffix), 'g')
    : /^$/g
}

function formatIntegerPart(intPart: string): string {
  if (!props.useGrouping || !groupingRegex.source || props.integer) {
    return intPart
  }

  const isNegative = intPart.startsWith('-')
  const absoluteInt = isNegative ? intPart.slice(1) : intPart

  const grouped = absoluteInt.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    props.groupingSeparator || inputNumberConstants.SEPARATORS.GROUPING,
  )

  return isNegative ? `-${grouped}` : grouped
}

function formatFractionPart(fracPart: string): string {
  let formattedFrac = fracPart

  if (
    props.minFractionDigits > 0
    && formattedFrac.length < props.minFractionDigits
  ) {
    formattedFrac = formattedFrac.padEnd(props.minFractionDigits, '0')
  }

  if (
    props.maxFractionDigits < inputNumberConstants.MAX_FRACTION_DIGITS
    && formattedFrac.length > props.maxFractionDigits
  ) {
    formattedFrac = formattedFrac.slice(0, props.maxFractionDigits)
  }

  return formattedFrac
}

function formatNumber(value: number | null): string {
  if (value === null || isNaN(value)) {
    return ''
  }

  if (props.integer) {
    return Math.round(value).toString()
  }

  const fractionDigits = Math.min(
    props.maxFractionDigits,
    inputNumberConstants.MAX_FRACTION_DIGITS,
  )

  const rounded
    = fractionDigits < inputNumberConstants.MAX_FRACTION_DIGITS
      ? parseFloat(value.toFixed(fractionDigits))
      : value

  const [intPart, fracPart = ''] = rounded.toString().split('.')
  const formattedInt = formatIntegerPart(intPart)
  const formattedFrac = formatFractionPart(fracPart)

  if (formattedFrac && parseInt(formattedFrac) > 0) {
    return `${formattedInt}${props.decimalSeparator}${formattedFrac}`
  }

  if (props.minFractionDigits > 0) {
    return `${formattedInt}${props.decimalSeparator}${'0'.repeat(props.minFractionDigits)}`
  }

  return formattedInt
}

function formatDisplayValue(value: number | null): string {
  if (value === null || isNaN(value)) {
    return ''
  }
  const formatted = formatNumber(value)
  return `${props.prefix}${formatted}${props.suffix}`
}

function parseValue(text: string): number | null {
  if (!text)
    return null

  let filtered = text.replace(suffixRegex, '').replace(prefixRegex, '').trim()

  if (props.useGrouping && groupingRegex.source) {
    filtered = filtered.replace(groupingRegex, '')
  }

  filtered = filtered.replace(minusSignRegex, '-').replace(decimalRegex, '.')

  if (filtered === '-' || filtered === '')
    return null

  const numValue = parseFloat(filtered)
  if (isNaN(numValue)) {
    return null
  }

  if (
    !props.integer
    && props.maxFractionDigits < inputNumberConstants.MAX_FRACTION_DIGITS
  ) {
    return parseFloat(numValue.toFixed(props.maxFractionDigits))
  }

  return numValue
}

function clampValue(value: number): number {
  let clamped = value

  if (props.min !== -Infinity && !isNaN(props.min) && isFinite(props.min)) {
    clamped = Math.max(clamped, props.min)
  }

  if (props.max !== Infinity && !isNaN(props.max) && isFinite(props.max)) {
    clamped = Math.min(clamped, props.max)
  }

  if (props.integer) {
    clamped = Math.round(clamped)
  }

  return clamped
}

function updateValue(value: number | null): void {
  if (value === null || isNaN(value)) {
    numericValue.value = null

    if (!isFocused.value) {
      inputDisplayValue.value = ''
    }
    return
  }

  const clamped = clampValue(value)
  numericValue.value = clamped
  emit('update:modelValue', clamped)

  if (!isFocused.value) {
    inputDisplayValue.value = formatDisplayValue(clamped)
  }
}

function spin(direction: 1 | -1): void {
  if (props.disabled || props.readonly)
    return

  const isMaxReached
    = numericValue.value !== null
      && props.max !== Infinity
      && numericValue.value >= props.max
  const isMinReached
    = numericValue.value !== null
      && props.min !== -Infinity
      && numericValue.value <= props.min

  if ((direction > 0 && isMaxReached) || (direction < 0 && isMinReached))
    return

  const currentValue = numericValue.value ?? 0
  let newValue = currentValue + props.step * direction

  if (
    !props.integer
    && props.maxFractionDigits < inputNumberConstants.MAX_FRACTION_DIGITS
  ) {
    newValue = parseFloat(newValue.toFixed(props.maxFractionDigits))
  }

  updateValue(newValue)

  if (isFocused.value && inputElement.value) {
    const displayValue
      = !props.integer
        && props.maxFractionDigits < inputNumberConstants.MAX_FRACTION_DIGITS
        ? newValue.toFixed(props.maxFractionDigits)
        : newValue.toString()

    inputElement.value.value = displayValue
    inputDisplayValue.value = displayValue
  }
}

function startLongPress(direction: 1 | -1): void {
  if (props.readonly || props.disabled)
    return
  if (longPressTimer)
    clearTimeout(longPressTimer)

  spin(direction)

  longPressTimer = setTimeout(() => {
    const repeat = (): void => {
      spin(direction)
      longPressTimer = setTimeout(
        repeat,
        inputNumberConstants.LONG_PRESS.REPEAT_INTERVAL,
      )
    }
    repeat()
  }, inputNumberConstants.LONG_PRESS.INITIAL_DELAY)
}

function stopLongPress(): void {
  if (longPressTimer) {
    clearTimeout(longPressTimer)
    longPressTimer = null
  }
}

function handleIncrementMouseDown(event: MouseEvent): void {
  if (!props.disabled && !props.readonly) {
    inputElement.value?.focus()
    startLongPress(1)
    event.preventDefault()
  }
}

function handleDecrementMouseDown(event: MouseEvent): void {
  if (!props.disabled && !props.readonly) {
    inputElement.value?.focus()
    startLongPress(-1)
    event.preventDefault()
  }
}

function handleInput(event: Event): void {
  const target = event.target as HTMLInputElement
  const rawValue = target.value
  const sanitized = sanitizeNumericText(rawValue)

  if (sanitized !== rawValue) {
    target.value = sanitized
  }

  inputDisplayValue.value = sanitized

  if (!sanitized || sanitized === '-') {
    updateValue(null)
    return
  }

  const parsed = parseValue(sanitized)
  if (parsed !== null && !isNaN(parsed)) {
    updateValue(parsed)
  }
}

function isNumericChar(
  char: string,
  currentText: string,
  caretIndex = 0,
): boolean {
  if (/\d/.test(char)) {
    return true
  }

  if (char === '-' || char === '−') {
    const hasMinus = currentText.includes('-') || currentText.includes('−')
    return !hasMinus && caretIndex === 0
  }

  if (char === props.decimalSeparator) {
    return !props.integer && !currentText.includes(props.decimalSeparator)
  }

  if (props.useGrouping && char === props.groupingSeparator) {
    return true
  }

  return false
}

function handleBeforeInput(event: InputEvent): void {
  if (props.readonly || props.disabled) {
    return
  }

  if (
    event.inputType !== 'insertText'
    || !event.data
    || event.data.length > 1
  ) {
    return
  }

  const target = event.target as HTMLInputElement
  const caretIndex = target.selectionStart ?? target.value.length

  if (!isNumericChar(event.data, target.value, caretIndex)) {
    event.preventDefault()
  }
}

function sanitizeNumericText(text: string): string {
  if (!text) {
    return ''
  }

  let result = ''

  for (const char of text) {
    if (isNumericChar(char, result, result.length)) {
      result += char
    }
  }

  return result
}

function handleKeydown(event: KeyboardEvent): void {
  if (props.readonly || props.disabled)
    return

  switch (event.key) {
    case 'ArrowUp':
      event.preventDefault()
      if (numericValue.value !== props.max)
        spin(1)
      break

    case 'ArrowDown':
      event.preventDefault()
      if (numericValue.value !== props.min)
        spin(-1)
      break

    case 'Enter':
    case 'NumpadEnter':
      event.preventDefault()
      if (inputElement.value) {
        commitValue()
      }
      break
  }
}

function commitValue(): void {
  if (!inputElement.value)
    return

  const parsed = parseValue(inputDisplayValue.value)

  if (parsed !== null && !isNaN(parsed)) {
    updateValue(parsed)
    const formatted = formatDisplayValue(parsed)
    inputElement.value.value = formatted
    inputDisplayValue.value = formatted
  }
  else if (numericValue.value !== null) {
    const formatted = formatDisplayValue(numericValue.value)
    inputElement.value.value = formatted
    inputDisplayValue.value = formatted
  }
}

function handleFocus(): void {
  isFocused.value = true

  if (
    inputElement.value
    && numericValue.value !== null
    && !isNaN(numericValue.value)
  ) {
    const displayValue
      = !props.integer
        && props.maxFractionDigits < inputNumberConstants.MAX_FRACTION_DIGITS
        ? numericValue.value.toFixed(props.maxFractionDigits)
        : numericValue.value.toString()

    inputElement.value.value = displayValue
    inputDisplayValue.value = displayValue
  }
  else if (inputElement.value) {
    inputElement.value.value = ''
    inputDisplayValue.value = ''
  }
}

function handleBlur(): void {
  isFocused.value = false
  stopLongPress()

  if (!inputElement.value)
    return

  const parsed = parseValue(inputDisplayValue.value)

  if (parsed !== null && !isNaN(parsed)) {
    updateValue(parsed)
    const formatted = formatDisplayValue(parsed)
    inputElement.value.value = formatted
    inputDisplayValue.value = formatted
  }
  else if (numericValue.value !== null && !isNaN(numericValue.value)) {
    const formatted = formatDisplayValue(numericValue.value)
    inputElement.value.value = formatted
    inputDisplayValue.value = formatted
  }
  else {
    inputElement.value.value = ''
    inputDisplayValue.value = ''
    updateValue(null)
  }
}

function focusInput(): void {
  inputElement.value?.focus()
}

defineExpose({
  focus: focusInput,
  inputId: fieldId,
})

const isFilled = computed(() => {
  return numericValue.value !== null && !isNaN(numericValue.value)
})

const isMinReached = computed(() => {
  if (numericValue.value === null || isNaN(numericValue.value))
    return false
  if (props.min === -Infinity)
    return false
  return numericValue.value <= props.min
})

const isMaxReached = computed(() => {
  if (numericValue.value === null || isNaN(numericValue.value))
    return false
  if (props.max === Infinity)
    return false
  return numericValue.value >= props.max
})

watch(
  () => props.modelValue,
  (newValue) => {
    if (isFocused.value)
      return

    let numValue: number | null = null

    if (newValue !== undefined) {
      numValue = typeof newValue === 'number' ? newValue : parseFloat(newValue ?? '')
      if (isNaN(numValue))
        numValue = null
    }

    if (numValue !== numericValue.value) {
      numericValue.value = numValue
      const formatted = formatDisplayValue(numValue)
      inputDisplayValue.value = formatted

      if (inputElement.value && document.activeElement !== inputElement.value) {
        inputElement.value.value = formatted
      }
    }
  },
)

watch(
  () => [
    props.useGrouping,
    props.decimalSeparator,
    props.groupingSeparator,
    props.prefix,
    props.suffix,
    props.minFractionDigits,
    props.maxFractionDigits,
  ],
  () => {
    buildRegularExpressions()

    if (!isFocused.value && inputElement.value) {
      const formatted = formatDisplayValue(numericValue.value)
      inputDisplayValue.value = formatted
      inputElement.value.value = formatted
    }
  },
)

onMounted(() => {
  buildRegularExpressions()

  if (props.defaultValue !== undefined) {
    const numValue
      = typeof props.defaultValue === 'number'
        ? props.defaultValue
        : parseFloat(props.defaultValue ?? '')
    if (!isNaN(numValue))
      updateValue(numValue)
  }

  if (props.modelValue !== undefined) {
    const numValue
      = typeof props.modelValue === 'number'
        ? props.modelValue
        : parseFloat(String(props.modelValue))
    if (!isNaN(numValue))
      numericValue.value = numValue
  }

  const formatted = formatDisplayValue(numericValue.value)
  inputDisplayValue.value = formatted

  if (inputElement.value) {
    inputElement.value.value = formatted
  }

  if (props.autofocus) {
    nextTick(focusInput)
  }
})

onUnmounted(() => {
  stopLongPress()
})
</script>

<template>
  <div
    class="input-number"
    :class="{
      'input-number_disabled': disabled,
      'input-number_error': error,
      'input-number_hidden': hidden,
      'input-number_filled': isFilled,
      'input-number_focused': isFocused,
      'input-number_show-buttons': showButtons,
      [`input-number_button-layout_${buttonLayout}`]: showButtons,
    }"
  >
    <div class="input-number__wrapper">
      <div
        v-if="$slots['icon-left']"
        class="input-number__icon input-number__icon_left"
      >
        <slot name="icon-left" />
      </div>

      <button
        v-if="showButtons && buttonLayout === 'horizontal'"
        type="button"
        class="input-number__button input-number__button_decrement"
        :disabled="disabled || readonly || isMinReached"
        @mousedown="handleDecrementMouseDown"
        @mouseup="stopLongPress"
        @mouseleave="stopLongPress"
      >
        <span class="input-number__button-icon">
          <slot name="icon-decrement">
            <CaretDownIcon height="1em" />
          </slot>
        </span>
      </button>

      <input
        :id="fieldId"
        ref="inputElement"
        type="text"
        inputmode="decimal"
        :value="inputDisplayValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :autofocus="autofocus"
        :autocomplete="autocomplete"
        :aria-label="ariaLabel || undefined"
        :aria-describedby="ariaDescribedby || undefined"
        class="input-number__input"
        @input="handleInput"
        @beforeinput="handleBeforeInput"
        @keydown="handleKeydown"
        @focus="handleFocus"
        @blur="handleBlur"
      >

      <button
        v-if="showButtons && buttonLayout === 'vertical'"
        type="button"
        class="input-number__button input-number__button_increment"
        :disabled="disabled || readonly || isMaxReached"
        @mousedown="handleIncrementMouseDown"
        @mouseup="stopLongPress"
        @mouseleave="stopLongPress"
      >
        <span class="input-number__button-icon">
          <slot name="icon-increment">
            <CaretUpIcon height="1em" />
          </slot>
        </span>
      </button>

      <div
        v-if="
          $slots['icon-right'] && (!showButtons || buttonLayout !== 'vertical')
        "
        class="input-number__icon input-number__icon_right"
      >
        <slot name="icon-right" />
      </div>

      <button
        v-if="showButtons && buttonLayout === 'horizontal'"
        type="button"
        class="input-number__button input-number__button_increment"
        :disabled="disabled || readonly || isMaxReached"
        @mousedown="handleIncrementMouseDown"
        @mouseup="stopLongPress"
        @mouseleave="stopLongPress"
      >
        <span class="input-number__button-icon">
          <slot name="icon-increment">
            <CaretUpIcon height="1em" />
          </slot>
        </span>
      </button>

      <button
        v-if="showButtons && buttonLayout === 'vertical'"
        type="button"
        class="input-number__button input-number__button_decrement"
        :disabled="disabled || readonly || isMinReached"
        @mousedown="handleDecrementMouseDown"
        @mouseup="stopLongPress"
        @mouseleave="stopLongPress"
      >
        <span class="input-number__button-icon">
          <slot name="icon-decrement">
            <CaretDownIcon height="1em" />
          </slot>
        </span>
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/styles/mixins";

.input-number {
  $this: &;

  display: flex;
  flex-direction: column;
  gap: var(--anyboom-spacing-2);

  &_hidden {
    display: none;
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

  &_show-buttons {
    #{$this}__wrapper {
      display: flex;
      align-items: stretch;
    }
  }

  &__button-icon {
    display: flex;
    align-items: center;
    color: var(--anyboom-icon-neutral-default);

    @include mixins.apply-text("body-base");
  }

  &_button-layout_horizontal {
    #{$this}__input {
      position: relative;
      z-index: 1;
      margin-right: -1px;
      margin-left: -1px;
      border-radius: 0;
      text-align: center;
    }

    #{$this}__button {
      &_decrement {
        border-radius: var(--anyboom-radius-small) 0 0 var(--anyboom-radius-small);
      }

      &_increment {
        border-radius: 0 var(--anyboom-radius-small) var(--anyboom-radius-small) 0;
      }
    }
  }

  &_button-layout_vertical {
    #{$this}__wrapper {
      flex-direction: column;
      position: relative;
    }

    #{$this}__input {
      text-align: center;
      padding-right: var(--anyboom-spacing-3);
      padding-left: var(--anyboom-spacing-3);
    }

    #{$this}__button {
      position: absolute;
      right: var(--anyboom-spacing-1);
      width: var(--anyboom-spacing-6);
      height: 40%;
      display: flex;
      align-items: center;
      justify-content: center;

      &_increment {
        top: var(--anyboom-spacing-1);
        border-radius: var(--anyboom-radius-small) var(--anyboom-radius-small) 0 0;
      }

      &_decrement {
        bottom: var(--anyboom-spacing-1);
        border-radius: 0 0 var(--anyboom-radius-small) var(--anyboom-radius-small);
      }
    }
  }

  &__wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  &__input {
    flex: 1;
    width: 100%;
    padding: var(--anyboom-spacing-3) var(--anyboom-spacing-4);
    color: var(--anyboom-input-primary-text);
    background: var(--anyboom-input-primary-background);
    border: 1px solid var(--anyboom-input-primary-border);
    border-radius: var(--anyboom-radius-small);
    outline: none;

    @include mixins.apply-text("input-md");

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
      color: var(--anyboom-input-primary-text);
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

      & ~ .input-number__input {
        padding-left: var(--anyboom-spacing-10);
      }
    }

    &_right {
      right: var(--anyboom-spacing-1);

      & ~ .input-number__input {
        padding-right: var(--anyboom-spacing-10);
      }
    }
  }

  &__button {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: var(--anyboom-spacing-8);
    padding: 0 var(--anyboom-spacing-2);
    color: var(--anyboom-button-secondary-outlined-text);
    background: var(--anyboom-button-secondary-outlined-background);
    border: 1px solid var(--anyboom-button-secondary-outlined-border);
    border-radius: var(--anyboom-radius-small);
    cursor: pointer;
    user-select: none;

    @include mixins.apply-text("button-sm");

    &:hover:not(:disabled) {
      background: var(--anyboom-button-secondary-outlined-background-hover);
      border-color: var(--anyboom-button-secondary-outlined-border-hover);
      color: var(--anyboom-button-secondary-outlined-text-hover);

      #{$this}__button-icon {
        color: var(--anyboom-icon-neutral-hover);
      }
    }

    &:active:not(:disabled) {
      background: var(--anyboom-button-secondary-outlined-background-active);
      border-color: var(--anyboom-button-secondary-outlined-border-active);
      color: var(--anyboom-button-secondary-outlined-text-active);
      transform: scale(0.95);

      #{$this}__button-icon {
        color: var(--anyboom-icon-neutral-active);
      }
    }

    &:disabled {
      cursor: not-allowed;
      background: var(--anyboom-button-disabled-outlined-background);
      border-color: var(--anyboom-button-disabled-outlined-border);
      color: var(--anyboom-button-disabled-outlined-text);

      #{$this}__button-icon {
        color: var(--anyboom-icon-disabled);
      }
    }
  }
}
</style>
