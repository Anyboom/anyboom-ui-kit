<script setup lang="ts">
import type { FloatingPlacement } from '@/utils/floating-placement.ts'

import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
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

let resizeObserver: ResizeObserver | null = null
let contentResizeObserver: ResizeObserver | null = null

async function openPopover(): Promise<void> {
  if (props.disabled) {
    return
  }

  isOpen.value = true
  await updatePosition()
}

function closePopover(): void {
  isOpen.value = false
}

function togglePopover(): void {
  if (isOpen.value) {
    closePopover()
  }
  else {
    openPopover()
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

function handleGlobalKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape' && isOpen.value) {
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
  document.addEventListener('keydown', handleGlobalKeydown)
})

onBeforeUnmount(() => {
  resetObservers()

  window.removeEventListener('scroll', updatePosition, true)
  window.removeEventListener('resize', updatePosition)
  document.removeEventListener('click', handleGlobalClick)
  document.removeEventListener('keydown', handleGlobalKeydown)
})

defineExpose({
  openPopover,
  closePopover,
  togglePopover,
})
</script>

<template>
  <div class="popover">
    <div ref="triggerRef" class="popover__trigger" @click="togglePopover">
      <slot name="trigger" />
    </div>

    <Teleport to="body">
      <Transition name="popover">
        <div
          v-if="isOpen"
          ref="contentRef"
          class="popover__content"
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
