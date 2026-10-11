<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  modelValue?: number
  stars?: number
  disabled?: boolean
  readonly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
  stars: 5,
  disabled: false,
  readonly: false,
})

const emit = defineEmits<Emits>()

interface Emits {
  'update:modelValue': [value: number]
  'change': [event: Event, value: number]
}

const focusedOptionIndex = ref(-1)
const isFocusVisibleItem = ref(true)

function onClick(event: MouseEvent, value: number) {
  if (props.readonly || props.disabled)
    return

  isFocusVisibleItem.value = false
  onSelect(event, value)
}

function onFocus(value: number) {
  focusedOptionIndex.value = value
}

function onBlur() {
  focusedOptionIndex.value = -1
}

function onChange(event: Event, value: number) {
  onSelect(event, value)
  isFocusVisibleItem.value = true
}

function onSelect(event: Event, value: number) {
  if (focusedOptionIndex.value === value || props.modelValue === value) {
    focusedOptionIndex.value = -1
    updateModel(event, 0)
  }
  else {
    focusedOptionIndex.value = value
    updateModel(event, value)
  }
}

function updateModel(event: Event, value: number) {
  emit('update:modelValue', value)
  emit('change', event, value)
}
</script>

<template>
  <div
    class="rating"
    :class="{
      rating_readonly: readonly,
      rating_disabled: disabled,
    }"
    role="radiogroup"
  >
    <div
      v-for="value in stars"
      :key="value"
      class="rating__item"
      :class="{
        rating__item_active: value <= modelValue,
        rating__item_focused: value === focusedOptionIndex,
      }"
      @click="onClick($event, value)"
    >
      <input
        class="rating__hidden-input"
        type="radio"
        :value="value"
        :checked="modelValue === value"
        :disabled="disabled"
        :readonly="readonly"
        @focus="onFocus(value)"
        @blur="onBlur"
        @change="onChange($event, value)"
      >

      <span
        class="rating__icon"
        :class="{
          rating__icon_filled: value <= modelValue,
          rating__icon_empty: value > modelValue,
        }"
      >
        <slot v-if="value <= modelValue" name="on-icon"> ★ </slot>
        <slot v-else name="off-icon"> ☆ </slot>
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.rating {
  $this: &;

  display: inline-flex;
  gap: 4px;
  align-items: center;

  &_disabled {
    cursor: not-allowed;
  }

  &_readonly {
    cursor: default;
    pointer-events: none;
  }

  &__item {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.15s ease;

    &:hover {
      #{$this}__icon_empty {
        color: var(--anyboom-color-amber-500);
      }
    }

    &_active {
      #{$this}__icon_filled {
        color: var(--anyboom-color-amber-400);
      }
    }
  }

  &__hidden-input {
    display: none;
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    transition: all 0.15s ease;

    &_filled {
      color: var(--anyboom-color-amber-400);

      &:hover {
        color: var(--anyboom-color-amber-500);
      }
    }

    &_empty {
      color: var(--anyboom-color-gray-300);

      &:hover {
        color: var(--anyboom-color-amber-500);
      }
    }
  }
}
</style>
