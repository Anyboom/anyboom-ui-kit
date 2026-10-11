<script setup lang="ts">
import type { Toast as ToastType } from './toast.ts'

import { computed, onUnmounted, ref } from 'vue'
import Toast from './Toast.vue'
import { claimToaster, releaseToaster, useToastBus } from './use-toast-bus.ts'

const toasts = ref<ToastType[]>([])

const POSITIONS = [
  'top-right',
  'top-left',
  'bottom-right',
  'bottom-left',
  'top-center',
  'bottom-center',
] as const

const groupedToasts = computed(() =>
  POSITIONS.map(position => ({
    position,
    toasts: toasts.value.filter(
      t => (t.position || 'top-right') === position,
    ),
  })),
)

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

function addToast(toast: ToastType | undefined): void {
  if (toast === undefined) {
    return
  }

  toasts.value.push({
    ...toast,
    id: toast.id ?? generateId(),
  })
}

function removeToast(toast: ToastType | undefined) {
  if (toast?.id === undefined) {
    return
  }

  const id = toast.id
  toasts.value = toasts.value.filter(t => t.id !== id)
}

function clearToasts() {
  toasts.value = []
}

const bus = useToastBus()
const toasterId = Symbol('toaster-instance')

if (claimToaster(toasterId)) {
  const unsubscribe = [
    bus.on('toast:add', addToast),
    bus.on('toast:clear', clearToasts),
    bus.on('toast:remove', removeToast),
  ]

  onUnmounted(() => {
    unsubscribe.forEach(fn => fn())
    releaseToaster(toasterId)
  })
}
else {
  console.warn('[Toaster] Another <Toaster /> instance is already active. This instance will not handle toasts.')
}
</script>

<template>
  <Teleport to="body">
    <div
      v-for="group in groupedToasts"
      :key="group.position"
      class="toaster"
      :class="`toaster_position_${group.position}`"
    >
      <transition-group
        name="toaster-animation"
        tag="div"
        class="toaster__list"
        appear
      >
        <Toast
          v-for="toast in group.toasts"
          :key="toast.id"
          v-bind="toast"
          @close="removeToast(toast)"
        />
      </transition-group>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
.toaster {
  position: fixed;
  display: flex;
  flex-direction: column;
  gap: var(--anyboom-spacing-2);
  z-index: 9999;
  padding: var(--anyboom-spacing-4);
  pointer-events: none;

  &_position {
    &_top-right {
      top: 0;
      right: 0;
      align-items: flex-end;
    }

    &_top-left {
      top: 0;
      left: 0;
      align-items: flex-start;
    }

    &_bottom-right {
      bottom: 0;
      right: 0;
      align-items: flex-end;
      flex-direction: column-reverse;
    }

    &_bottom-left {
      bottom: 0;
      left: 0;
      align-items: flex-start;
      flex-direction: column-reverse;
    }

    &_top-center {
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      align-items: center;
    }

    &_bottom-center {
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      align-items: center;
      flex-direction: column-reverse;
    }
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: var(--anyboom-spacing-2);
    pointer-events: auto;
  }
}

.toaster-animation {
  &-enter-active,
  &-leave-active {
    transition:
      opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1),
      transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &-enter-from,
  &-leave-to {
    opacity: 0;
  }

  &-enter-from {
    transform: translateY(-1rem) scale(0.95);
  }

  &-leave-to {
    transform: translateY(-1rem) scale(0.95);
  }

  &-move {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

.toaster_position_bottom-right,
.toaster_position_bottom-left,
.toaster_position_bottom-center {
  .toaster-animation-enter-from {
    transform: translateY(1rem) scale(0.95);
  }

  .toaster-animation-leave-to {
    transform: translateY(1rem) scale(0.95);
  }
}
</style>
