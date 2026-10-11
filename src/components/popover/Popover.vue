<script setup lang="ts">
import type { FloatingPlacement } from '@/utils/floating-placement.ts'

import { nextTick, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue'

import { useOverlayStack } from '@/composables/use-overlay-stack.ts'
import { pickPlacement } from '@/utils/pick-placement.ts'
import { resolvePosition } from '@/utils/resolve-position.ts'

interface Props {
  placement?: FloatingPlacement
  offset?: number
  autoPlacement?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placement: 'bottom',
  offset: 8,
  autoPlacement: true,
  disabled: false,
})

const isOpen = ref(false)
const triggerRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const contentStyle = ref<Record<string, string | number>>({})
const contentId = useId()

useOverlayStack(isOpen, closePopover)

let resizeObserver: ResizeObserver | null = null
let contentResizeObserver: ResizeObserver | null = null

async function openPopover(focusContent = false): Promise<void> {
  if (props.disabled) {
    return
  }

  isOpen.value = true
  await updatePosition()

  if (focusContent) {
    await nextTick()
    contentRef.value?.focus()
  }
}

function closePopover(): void {
  const content = contentRef.value

  if (content?.contains(document.activeElement)) {
    triggerRef.value?.focus()
  }

  isOpen.value = false
}

function togglePopover(focusContent = false): void {
  if (isOpen.value) {
    closePopover()
  }
  else {
    openPopover(focusContent)
  }
}

function handleTriggerKeydown(event: KeyboardEvent): void {
  if (event.target !== triggerRef.value) {
    return
  }

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    togglePopover(true)
  }
}

async function updatePosition(): Promise<void> {
  await nextTick()

  if (!triggerRef.value || !contentRef.value) {
    return
  }

  const triggerRect = triggerRef.value.getBoundingClientRect()
  const contentWidth = contentRef.value.offsetWidth
  const contentHeight = contentRef.value.offsetHeight
  const placement = props.autoPlacement
    ? pickPlacement(
        props.placement,
        triggerRect,
        contentWidth,
        contentHeight,
        props.offset,
      )
    : props.placement

  const { top, left } = resolvePosition(
    placement,
    triggerRect,
    contentWidth,
    contentHeight,
    props.offset,
  )

  contentStyle.value = {
    position: 'fixed',
    top: `${top}px`,
    left: `${left}px`,
  }

  observeContentSize()
}

function observeContentSize(): void {
  if (!contentRef.value) {
    return
  }

  if (!contentResizeObserver) {
    contentResizeObserver = new ResizeObserver(() => {
      if (isOpen.value) {
        updatePosition()
      }
    })
  }

  contentResizeObserver.observe(contentRef.value)
}

function initializeObservers(): void {
  if (!triggerRef.value) {
    return
  }

  resizeObserver = new ResizeObserver(() => {
    if (isOpen.value) {
      updatePosition()
    }
  })

  resizeObserver.observe(triggerRef.value)
}

function resetObservers(): void {
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }

  if (contentResizeObserver) {
    contentResizeObserver.disconnect()
    contentResizeObserver = null
  }
}

function handleGlobalClick(event: MouseEvent): void {
  if (!isOpen.value) {
    return
  }

  const target = event.target as Node
  const isInsideTrigger = triggerRef.value?.contains(target) || false
  const isInsideContent = contentRef.value?.contains(target) || false

  if (!isInsideTrigger && !isInsideContent) {
    closePopover()
  }
}

watch(isOpen, (val) => {
  if (!val && contentResizeObserver) {
    contentResizeObserver.disconnect()
    contentResizeObserver = null
  }
})

watch(
  () => props.disabled,
  (newVal) => {
    if (newVal) {
      closePopover()
    }
  },
)

onMounted(() => {
  initializeObservers()

  window.addEventListener('scroll', updatePosition, true)
  window.addEventListener('resize', updatePosition)
  document.addEventListener('click', handleGlobalClick)
})

onBeforeUnmount(() => {
  resetObservers()

  window.removeEventListener('scroll', updatePosition, true)
  window.removeEventListener('resize', updatePosition)
  document.removeEventListener('click', handleGlobalClick)
})

defineExpose({
  openPopover,
  closePopover,
  togglePopover,
})
</script>

<template>
  <div class="popover">
    <div
      ref="triggerRef"
      class="popover__trigger"
      role="button"
      tabindex="0"
      aria-haspopup="dialog"
      :aria-expanded="isOpen"
      :aria-controls="isOpen ? contentId : undefined"
      @click="togglePopover()"
      @keydown="handleTriggerKeydown"
    >
      <slot name="trigger" />
    </div>

    <Teleport to="body">
      <Transition name="popover">
        <div
          v-if="isOpen"
          :id="contentId"
          ref="contentRef"
          class="popover__content"
          role="dialog"
          tabindex="-1"
          :style="contentStyle"
        >
          <slot />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped lang="scss">
.popover {
  display: inline-block;
  position: relative;

  &__trigger {
    cursor: pointer;
    display: inline-block;

    &:focus-visible {
      outline: 2px solid var(--anyboom-border-focus);
      outline-offset: 2px;
      border-radius: var(--anyboom-radius-small);
    }
  }

  &__content {
    position: fixed;
    z-index: 1000;
    min-width: 150px;
    padding: var(--anyboom-spacing-2);
    background: var(--anyboom-input-primary-background);
    border: 1px solid var(--anyboom-input-primary-border);
    border-radius: var(--anyboom-radius-small);
    box-shadow: var(--anyboom-shadow-large);
  }
}

.popover-enter-active,
.popover-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.popover-enter-from,
.popover-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
