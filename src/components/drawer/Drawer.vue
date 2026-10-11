<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import XBoldIcon from '@iconify-vue/ph/x-bold'
import { computed, onUnmounted, ref, useSlots, watch } from 'vue'

import Button from '@/components/button/Button.vue'
import Overlay from '@/components/overlay/Overlay.vue'
import { useBodyScrollLock } from '@/composables/use-body-scroll-lock.ts'
import { useFocusTrap } from '@/composables/use-focus-trap.ts'
import { useOverlayStack } from '@/composables/use-overlay-stack.ts'

interface Props {
  modelValue: boolean
  title?: string
  position?: 'left' | 'right' | 'top' | 'bottom'
  size?: string
  closable?: boolean
  maskClosable?: boolean
  escClosable?: boolean
}

const {
  title = '',
  position = 'right',
  size = '400px',
  closable = true,
  maskClosable = true,
  escClosable = true,
  modelValue,
} = defineProps<Props>()

const emit = defineEmits<AppDrawerEmits>()

interface AppDrawerEmits {
  'update:modelValue': [value: boolean]
  'open': []
  'close': []
}

const { lock, unlock } = useBodyScrollLock()

const slots = useSlots()
const panelRef = ref<HTMLElement>()
const overlayRef = ref<ComponentPublicInstance>()

useFocusTrap(panelRef, computed(() => modelValue), {
  excludedRefs: [overlayRef],
})

useOverlayStack(computed(() => modelValue && escClosable), close)

const showHeader = computed<boolean>(() =>
  Boolean(title || closable || slots.header),
)

const hasFooterSlot = computed<boolean>(() => Boolean(slots.footer))

const drawerModifiers = computed<string[]>(() => {
  const modifiers: string[] = [`drawer_${position}`]

  if (showHeader.value) {
    modifiers.push('drawer_with-header')
  }

  if (hasFooterSlot.value) {
    modifiers.push('drawer_with-footer')
  }

  return modifiers
})

const drawerTransitionName = computed<string>(
  () => `drawer__slide-${position}`,
)

const drawerStyles = computed(() => {
  const positionConfig = {
    left: 'width',
    right: 'width',
    top: 'height',
    bottom: 'height',
  } as const

  const config = positionConfig[position]

  if (config === undefined) {
    return undefined
  }

  return {
    [config]: size,
  }
})

function close() {
  emit('update:modelValue', false)
  emit('close')
}

function handleOverlayClick() {
  if (maskClosable) {
    close()
  }
}

watch(
  () => modelValue,
  (newValue) => {
    if (newValue) {
      emit('open')
      lock()
    }
    else {
      unlock()
    }
  },
  { immediate: true },
)

onUnmounted(() => {
  unlock()
})
</script>

<template>
  <Teleport to="body">
    <Transition name="drawer-overlay">
      <Overlay
        v-if="modelValue"
        ref="overlayRef"
        @click="handleOverlayClick"
      />
    </Transition>

    <Transition :name="drawerTransitionName">
      <div
        v-if="modelValue"
        ref="panelRef"
        tabindex="-1"
        class="drawer"
        :class="drawerModifiers"
        :style="drawerStyles"
        role="dialog"
        aria-modal="true"
        :aria-label="title"
      >
        <div v-if="showHeader" class="drawer__header">
          <div class="drawer__header-content">
            <h2 v-if="title" class="drawer__title">
              {{ title }}
            </h2>
            <slot name="header" />
          </div>

          <Button v-if="closable" variant="text" severity="secondary" icon-only @click="close">
            <slot name="close-icon">
              <XBoldIcon height="1em" />
            </slot>
          </Button>
        </div>

        <div class="drawer__body">
          <slot />
        </div>

        <div v-if="hasFooterSlot" class="drawer__footer">
          <slot name="footer" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
@use "@/styles/mixins";

.drawer {
  $block: &;

  position: fixed;
  background: var(--anyboom-modal-background);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  &_left {
    top: 0;
    left: 0;
    bottom: 0;
    border-radius: 0 var(--anyboom-radius-6) var(--anyboom-radius-6) 0;
  }

  &_right {
    top: 0;
    right: 0;
    bottom: 0;
    border-radius: var(--anyboom-radius-6) 0 0 var(--anyboom-radius-6);
  }

  &_top {
    top: 0;
    left: 0;
    right: 0;
    border-radius: 0 0 var(--anyboom-radius-6) var(--anyboom-radius-6);
  }

  &_bottom {
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: var(--anyboom-radius-6) var(--anyboom-radius-6) 0 0;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--anyboom-border-default);
    flex-shrink: 0;
    padding: var(--anyboom-spacing-3);

    &-content {
      flex: 1;
      margin-right: var(--anyboom-spacing-4);
    }
  }

  &__title {
    margin: 0;
    color: var(--anyboom-modal-text);

    @include mixins.apply-text("heading-h3");
  }

  &__body {
    flex: 1;
    overflow: auto;
    padding: var(--anyboom-spacing-3);
  }

  &__footer {
    padding: var(--anyboom-spacing-2) var(--anyboom-spacing-3);
    border-top: 1px solid var(--anyboom-border-default);
    flex-shrink: 0;
    background: var(--anyboom-modal-background);
  }

  &-overlay-enter-active,
  &-overlay-leave-active {
    transition: opacity 0.2s ease;
  }

  &-overlay-enter-from,
  &-overlay-leave-to {
    opacity: 0;
  }

  &__slide {
    &-left-enter-active,
    &-left-leave-active,
    &-right-enter-active,
    &-right-leave-active,
    &-top-enter-active,
    &-top-leave-active,
    &-bottom-enter-active,
    &-bottom-leave-active {
      transition: 0.2s ease;
    }

    &-left-enter-from {
      transform: translateX(-100%);
    }

    &-left-leave-to {
      transform: translateX(-100%);
    }

    &-right-enter-from {
      transform: translateX(100%);
    }

    &-right-leave-to {
      transform: translateX(100%);
    }

    &-top-enter-from {
      transform: translateY(-100%);
    }

    &-top-leave-to {
      transform: translateY(-100%);
    }

    &-bottom-enter-from {
      transform: translateY(100%);
    }

    &-bottom-leave-to {
      transform: translateY(100%);
    }
  }
}
</style>
