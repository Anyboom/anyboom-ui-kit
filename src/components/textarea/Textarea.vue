<script setup lang="ts">
import type { TextareaResize } from '@/components/textarea/textarea-resize.ts'

import type { TextareaWrap } from '@/components/textarea/textarea-wrap.ts'
import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  useId,
  watch,
} from 'vue'

interface Props {
  modelValue?: string
  inputId?: string
  placeholder?: string
  disabled?: boolean
  error?: boolean
  maxlength?: number
  showCharCount?: boolean
  readonly?: boolean
  autofocus?: boolean
  autocomplete?: string
  rows?: number
  wrap?: TextareaWrap
  resize?: TextareaResize
  autoHeight?: boolean
  maxHeight?: number
  minHeight?: number
  defaultValue?: string
  ariaLabel?: string
  ariaDescribedby?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  inputId: undefined,
  placeholder: '',
  disabled: false,
  error: false,
  maxlength: undefined,
  readonly: false,
  autofocus: false,
  autocomplete: 'off',
  rows: 3,
  wrap: 'soft',
  resize: 'none',
  autoHeight: false,
  maxHeight: undefined,
  minHeight: undefined,
  defaultValue: '',
  showCharCount: false,
  ariaLabel: '',
  ariaDescribedby: '',
})

const emit = defineEmits<Emits>()

interface Emits {
  'update:modelValue': [value: string]
}

const textareaElement = ref<HTMLTextAreaElement | null>(null)
const textareaWrapper = ref<HTMLDivElement | null>(null)

const autoId = useId()
const fieldId = computed(() => props.inputId ?? autoId)
let resizeObserver: ResizeObserver | null = null

const isFilled = computed(() => (props.modelValue || '').length > 0)

const currentLength = computed(() => (props.modelValue || '').length)

function adjustHeight() {
  if (props.autoHeight === undefined) {
    return
  }

  if (!textareaElement.value) {
    return
  }

  const textarea = textareaElement.value

  const scrollTop = textarea.scrollTop

  textarea.style.height = 'auto'

  let newHeight = textarea.scrollHeight

  if (props.maxHeight !== undefined && props.maxHeight > 0) {
    newHeight = Math.min(newHeight, props.maxHeight)
  }

  if (props.minHeight !== undefined && props.minHeight > 0) {
    newHeight = Math.max(newHeight, props.minHeight)
  }

  textarea.style.height = `${newHeight}px`

  textarea.scrollTop = scrollTop

  if (
    props.maxHeight !== undefined
    && props.maxHeight > 0
    && textarea.scrollHeight > props.maxHeight
  ) {
    textarea.style.overflowY = 'auto'
  }
  else {
    textarea.style.overflowY = 'hidden'
  }
}

function handleInput(event: Event) {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)

  if (props.autoHeight) {
    adjustHeight()
  }
}

function focus() {
  textareaElement.value?.focus()
}

defineExpose({
  focus,
  inputId: fieldId,
})

function observeResize() {
  if (props.autoHeight === undefined) {
    return
  }

  if (!textareaWrapper.value) {
    return
  }

  resizeObserver = new ResizeObserver(() => {
    adjustHeight()
  })

  resizeObserver.observe(textareaWrapper.value)
}

watch(
  () => props.modelValue,
  () => {
    if (props.autoHeight && !props.disabled && !props.readonly) {
      nextTick(() => {
        adjustHeight()
      })
    }
  },
)

watch(
  () => [props.autoHeight, props.maxHeight, props.minHeight],
  () => {
    if (props.autoHeight) {
      nextTick(() => {
        adjustHeight()
      })
    }
  },
)

onMounted(() => {
  if (props.defaultValue && !props.modelValue) {
    emit('update:modelValue', props.defaultValue)
  }

  if (props.autoHeight) {
    nextTick(() => {
      adjustHeight()
      observeResize()
    })
  }

  if (props.autofocus) {
    nextTick(() => {
      focus()
    })
  }
})

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
})
</script>

<template>
  <div
    ref="textareaWrapper"
    class="textarea"
    :class="{
      'textarea_disabled': disabled,
      'textarea_error': error,
      'textarea_filled': isFilled,
      'textarea_auto-height': autoHeight,
      'textarea_resize-vertical': resize === 'vertical' && !autoHeight,
      'textarea_resize-horizontal': resize === 'horizontal' && !autoHeight,
      'textarea_resize-both': resize === 'both' && !autoHeight,
      'textarea_resize-none': resize === 'none' || autoHeight,
    }"
  >
    <div class="textarea__wrapper">
      <div
        v-if="$slots['icon-left']"
        class="textarea__icon textarea__icon_left"
      >
        <slot name="icon-left" />
      </div>

      <textarea
        :id="fieldId"
        ref="textareaElement"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :autofocus="autofocus"
        :autocomplete="autocomplete"
        :aria-label="ariaLabel || undefined"
        :aria-describedby="ariaDescribedby || undefined"
        :maxlength="maxlength"
        :rows="autoHeight ? 1 : rows"
        :wrap="wrap"
        class="textarea__input"
        :class="{
          'textarea__input_auto-height': autoHeight,
        }"
        @input="handleInput"
      />

      <div
        v-if="$slots['icon-right']"
        class="textarea__icon textarea__icon_right"
      >
        <slot name="icon-right" />
      </div>
    </div>

    <div
      v-if="maxlength && showCharCount"
      class="textarea__counter"
      :class="{
        textarea__counter_warning: currentLength >= maxlength * 0.9,
        textarea__counter_danger: currentLength >= maxlength,
      }"
    >
      {{ currentLength }} / {{ maxlength }}
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/styles/mixins";

.textarea {
  $this: &;

  display: flex;
  flex-direction: column;
  gap: var(--anyboom-spacing-1);

  &_auto-height {
    #{$this}__input {
      overflow-y: hidden;
    }
  }

  &_error {
    #{$this}__input {
      border: 1px solid var(--anyboom-input-danger-border);

      &:hover {
        border: 1px solid var(--anyboom-input-danger-border-hover);
      }

      &:focus {
        border-color: var(--anyboom-input-danger-border-focus);
      }
    }
  }

  &_resize {
    &-vertical {
      #{$this}__input {
        resize: vertical;
      }
    }

    &-horizontal {
      #{$this}__input {
        resize: horizontal;
      }
    }

    &-both {
      #{$this}__input {
        resize: both;
      }
    }

    &-none {
      #{$this}__input {
        resize: none;
      }
    }
  }

  &__wrapper {
    position: relative;
    display: flex;
    align-items: flex-start;
  }

  &__input {
    flex: 1;
    width: 100%;
    padding: var(--anyboom-spacing-3) var(--anyboom-spacing-4);
    color: var(--anyboom-input-primary-text);
    background: var(--anyboom-input-primary-background);
    border-radius: var(--anyboom-radius-small);
    outline: none;
    border: 1px solid var(--anyboom-input-primary-border);
    scrollbar-width: none;

    @include mixins.apply-text("input-md");

    &::placeholder {
      color: var(--anyboom-input-primary-placeholder);
    }

    &:hover {
      border-color: var(--anyboom-input-primary-border-hover);
    }

    &:focus {
      border-color: var(--anyboom-input-primary-border-focus);
    }

    &:disabled {
      background: var(--anyboom-input-disabled-background);
      border-color: var(--anyboom-input-disabled-border);
      cursor: not-allowed;
    }

    &_auto-height {
      overflow-y: hidden;
      resize: none;
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
      top: var(--anyboom-spacing-1);
    }

    &_right {
      right: var(--anyboom-spacing-1);
      top: var(--anyboom-spacing-1);
    }
  }

  #{$this}__icon_left + #{$this}__input {
    padding-left: var(--anyboom-spacing-10);
  }

  #{$this}__wrapper:has(#{$this}__icon_right) #{$this}__input {
    padding-right: var(--anyboom-spacing-10);
  }

  &__counter {
    text-align: right;
    color: var(--anyboom-text-secondary);

    @include mixins.apply-text("body-xs");

    &_warning {
      color: var(--anyboom-text-warn);
    }

    &_danger {
      color: var(--anyboom-text-danger);
    }
  }
}
</style>
