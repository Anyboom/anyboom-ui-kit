<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import XBoldIcon from '@iconify-vue/ph/x-bold'

import { computed, onUnmounted, ref, useId, useSlots, watch } from 'vue'

import Button from '@/components/button/Button.vue'
import Divider from '@/components/divider/Divider.vue'
import Overlay from '@/components/overlay/Overlay.vue'
import { useBodyScrollLock } from '@/composables/use-body-scroll-lock.ts'
import { useFocusTrap } from '@/composables/use-focus-trap.ts'
import { useOverlayStack } from '@/composables/use-overlay-stack.ts'

interface Props {
  modelValue: boolean
  title?: string
  size?: 'small' | 'medium' | 'large' | 'fullscreen'
  closable?: boolean
  maskClosable?: boolean
  escClosable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  size: 'medium',
  closable: true,
  maskClosable: true,
  escClosable: true,
})

const emit = defineEmits<Emits>()

interface Emits {
  'update:modelValue': [value: boolean]
  'open': []
  'close': []
}

const { lock, unlock } = useBodyScrollLock()

const slots = useSlots()

const titleId = useId()
const panelRef = ref<HTMLElement>()
const overlayRef = ref<ComponentPublicInstance>()

useFocusTrap(panelRef, computed(() => props.modelValue), {
  excludedRefs: [overlayRef],
})

useOverlayStack(computed(() => props.modelValue && props.escClosable), close)

const hasHeaderSlot = computed(() => Boolean(slots.header))
const hasFooterSlot = computed(() => Boolean(slots.footer))

const showHeader = computed(() =>
  Boolean(props.title || props.closable || hasHeaderSlot.value),
)

function close(): void {
  emit('update:modelValue', false)
  emit('close')
}

function handleOverlayClick(): void {
  if (props.maskClosable) {
    close()
  }
}

watch(
  () => props.modelValue,
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
    <Transition name="modal-overlay">
      <Overlay
        v-if="modelValue"
        ref="overlayRef"
        @click="handleOverlayClick"
      />
    </Transition>

    <Transition name="modal">
      <div
        v-if="modelValue"
        ref="panelRef"
        tabindex="-1"
        class="anyboom-modal"
        :class="`anyboom-modal_size_${size}`"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="title ? titleId : undefined"
      >
        <div v-if="showHeader" class="anyboom-modal__header">
          <div class="anyboom-modal__header-content">
            <slot name="header">
              <h2 v-if="title" :id="titleId" class="anyboom-modal__title">
                {{ title }}
              </h2>
            </slot>
          </div>

          <Button v-if="closable" variant="text" icon-only aria-label="Закрыть" @click="close">
            <slot name="close-icon">
              <XBoldIcon height="1em" />
            </slot>
          </Button>
        </div>

        <div class="anyboom-modal__body">
          <slot />
        </div>

        <div v-if="hasFooterSlot" class="anyboom-modal__footer">
          <Divider />
          <div class="anyboom-modal__footer-inner">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss">
@use "@/styles/mixins";

.anyboom-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10000;
  display: flex;
  flex-direction: column;
  max-height: calc(100dvh - var(--anyboom-spacing-10) * 2);
  width: min(
    calc(100vw - var(--anyboom-spacing-8) * 2),
    var(--modal-width, 560px)
  );
  background: var(--anyboom-modal-background);
  border-radius: var(--anyboom-radius-6);

  &_size {
    &_small {
      --modal-width: 400px;
    }

    &_medium {
      --modal-width: 560px;
    }

    &_large {
      --modal-width: 720px;
    }

    &_fullscreen {
      width: 100%;
      max-height: 100dvh;
      height: 100dvh;
      border-radius: 0;
    }
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--anyboom-spacing-4);
    flex-shrink: 0;
    padding: var(--anyboom-spacing-8) var(--anyboom-spacing-8)
      var(--anyboom-spacing-3) var(--anyboom-spacing-8);
  }

  &__header-content {
    flex: 1;
    min-width: 0;
  }

  &__title {
    margin: 0;
    color: var(--anyboom-modal-text);

    @include mixins.apply-text("heading-h3");
  }

  &__body {
    flex: 1;
    overflow: auto;
    padding: var(--anyboom-spacing-3) var(--anyboom-spacing-8)
      var(--anyboom-spacing-8) var(--anyboom-spacing-8);
    color: var(--anyboom-modal-text);

    @include mixins.apply-text("body-sm");
  }

  &__footer {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: var(--anyboom-spacing-6);
    padding: 0 var(--anyboom-spacing-8) var(--anyboom-spacing-6)
      var(--anyboom-spacing-8);
    flex-shrink: 0;
    position: relative;

    &-inner {
      display: flex;
      justify-content: flex-end;
      gap: var(--anyboom-spacing-2);
    }
  }
}

.modal-enter-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.modal-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.95);
}

.modal-overlay-enter-active,
.modal-overlay-leave-active {
  transition: opacity 0.2s ease;
}

.modal-overlay-enter-from,
.modal-overlay-leave-to {
  opacity: 0;
}
</style>
