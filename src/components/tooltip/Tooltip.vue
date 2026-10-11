<script setup lang="ts">
import type { FloatingPlacement } from '@/utils/floating-placement.ts'

import { nextTick, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue'

import { useOverlayStack } from '@/composables/use-overlay-stack.ts'
import { pickPlacement } from '@/utils/pick-placement.ts'
import { resolvePosition } from '@/utils/resolve-position.ts'

interface Props {
  content?: string
  placement?: FloatingPlacement
  delay?: number
  hideDelay?: number
  disabled?: boolean
  autoPlacement?: boolean
  offset?: number
  interactive?: boolean
  triggerOnClick?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  content: '',
  placement: 'top',
  delay: 0,
  hideDelay: 0,
  disabled: false,
  autoPlacement: true,
  offset: 8,
  interactive: false,
  triggerOnClick: false,
})

const isVisible = ref(false)
const tooltipStyle = ref<Record<string, string | number>>({})
const wrapperRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)
const tooltipRef = ref<HTMLElement | null>(null)
const tooltipId = useId()

let showTimer: ReturnType<typeof setTimeout> | null = null
let hideTimer: ReturnType<typeof setTimeout> | null = null
let resizeObserver: ResizeObserver | null = null
let tooltipResizeObserver: ResizeObserver | null = null

let isMouseOnTrigger = false
let isMouseOnTooltip = false

useOverlayStack(isVisible, forceHide)

function canHide(): boolean {
  if (props.interactive && isMouseOnTooltip) {
    return false
  }

  return !isMouseOnTrigger
}

function clearTimers(): void {
  clearTimeout(showTimer as ReturnType<typeof setTimeout>)
  clearTimeout(hideTimer as ReturnType<typeof setTimeout>)

  showTimer = null
  hideTimer = null
}

function show(): void {
  if (props.disabled) {
    return
  }

  clearTimers()

  showTimer = setTimeout(() => {
    showTimer = null
    isVisible.value = true
    updatePosition()
  }, props.delay)
}

function hide(): void {
  if (!canHide()) {
    return
  }

  clearTimeout(showTimer as ReturnType<typeof setTimeout>)
  showTimer = null
  clearTimeout(hideTimer as ReturnType<typeof setTimeout>)

  hideTimer = setTimeout(() => {
    hideTimer = null

    if (!canHide()) {
      return
    }

    isVisible.value = false
  }, props.hideDelay)
}

function forceHide(): void {
  clearTimers()

  isVisible.value = false
}

function toggle(): void {
  if (isVisible.value || showTimer !== null) {
    forceHide()
  }
  else {
    show()
  }
}

function handleGlobalClick(event: MouseEvent): void {
  if (!props.triggerOnClick || (!isVisible.value && showTimer === null)) {
    return
  }

  const target = event.target as Node
  const isInsideTrigger = triggerRef.value?.contains(target) || false
  const isInsideTooltip = tooltipRef.value?.contains(target) || false

  if (!isInsideTrigger && !isInsideTooltip) {
    forceHide()
  }
}

function handleTriggerMouseEnter(): void {
  isMouseOnTrigger = true

  if (!props.triggerOnClick) {
    show()
  }
}

function handleTriggerMouseLeave(): void {
  isMouseOnTrigger = false

  if (!props.triggerOnClick) {
    setTimeout(() => {
      if (!isMouseOnTooltip) {
        hide()
      }
    }, 0)
  }
}

function handleTriggerFocus(): void {
  if (props.triggerOnClick) {
    return
  }

  show()
}

function handleTriggerBlur(): void {
  if (props.triggerOnClick) {
    return
  }

  if (!props.interactive) {
    hide()
  }
}

function handleTriggerKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape' && isVisible.value) {
    event.preventDefault()
    forceHide()
    return
  }

  if (props.triggerOnClick && (event.key === 'Enter' || event.key === ' ')) {
    event.preventDefault()
    toggle()
  }
}

function handleTriggerClick(): void {
  if (props.triggerOnClick) {
    toggle()
  }
}

function handleTooltipMouseEnter(): void {
  isMouseOnTooltip = true

  if (props.interactive) {
    clearTimeout(hideTimer as ReturnType<typeof setTimeout>)
  }
}

function handleTooltipMouseLeave(): void {
  isMouseOnTooltip = false

  if (props.interactive) {
    setTimeout(() => {
      if (!isMouseOnTrigger) {
        hide()
      }
    }, 0)
  }
}

async function updatePosition(): Promise<void> {
  await nextTick()

  if (!triggerRef.value || !tooltipRef.value) {
    return
  }

  const triggerRect = triggerRef.value.getBoundingClientRect()
  const tooltipWidth = tooltipRef.value.offsetWidth
  const tooltipHeight = tooltipRef.value.offsetHeight
  const placement = props.autoPlacement
    ? pickPlacement(
        props.placement,
        triggerRect,
        tooltipWidth,
        tooltipHeight,
        props.offset,
      )
    : props.placement

  const { top, left } = resolvePosition(
    placement,
    triggerRect,
    tooltipWidth,
    tooltipHeight,
    props.offset,
  )

  tooltipStyle.value = {
    position: 'fixed',
    top: `${top}px`,
    left: `${left}px`,
    zIndex: 9999,
  }

  observeTooltipSize()
}

function observeTooltipSize(): void {
  if (!tooltipRef.value) {
    return
  }

  if (!tooltipResizeObserver) {
    tooltipResizeObserver = new ResizeObserver(() => {
      if (isVisible.value) {
        updatePosition()
      }
    })
  }

  tooltipResizeObserver.observe(tooltipRef.value)
}

function initializeObservers(): void {
  if (!wrapperRef.value)
    return

  resizeObserver = new ResizeObserver(() => {
    if (isVisible.value) {
      updatePosition()
    }
  })

  resizeObserver.observe(wrapperRef.value)
}

function resetObservers(): void {
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }

  if (tooltipResizeObserver) {
    tooltipResizeObserver.disconnect()
    tooltipResizeObserver = null
  }
}

watch(isVisible, (val) => {
  if (!val && tooltipResizeObserver) {
    tooltipResizeObserver.disconnect()
    tooltipResizeObserver = null
  }
})

watch(
  () => props.content,
  () => {
    if (isVisible.value) {
      updatePosition()
    }
  },
)

watch(
  () => props.disabled,
  (newVal) => {
    if (newVal) {
      forceHide()
    }
  },
)

watch(
  () => props.triggerOnClick,
  (newVal) => {
    if (newVal && isVisible.value) {
      forceHide()
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
  if (showTimer) {
    clearTimeout(showTimer)
  }

  if (hideTimer) {
    clearTimeout(hideTimer)
  }

  resetObservers()

  window.removeEventListener('scroll', updatePosition, true)
  window.removeEventListener('resize', updatePosition)
  document.removeEventListener('click', handleGlobalClick)
})
</script>

<template>
  <div ref="wrapperRef" class="anyboom-tooltip">
    <span
      ref="triggerRef"
      class="tooltip__trigger"
      tabindex="0"
      role="button"
      :aria-describedby="isVisible ? tooltipId : undefined"
      @mouseenter="handleTriggerMouseEnter"
      @mouseleave="handleTriggerMouseLeave"
      @focusin="handleTriggerFocus"
      @focusout="handleTriggerBlur"
      @click="handleTriggerClick"
      @keydown="handleTriggerKeydown"
    >
      <slot name="default"> Наведи на меня </slot>
    </span>

    <Teleport to="body">
      <Transition name="tooltip">
        <div
          v-if="isVisible"
          :id="tooltipId"
          ref="tooltipRef"
          class="tooltip__popup"
          role="tooltip"
          :class="{
            tooltip__popup_interactive: interactive,
          }"
          :style="tooltipStyle"
          @mouseenter="handleTooltipMouseEnter"
          @mouseleave="handleTooltipMouseLeave"
        >
          <div class="tooltip__popup-content">
            <slot name="content">
              <span>{{ content }}</span>
            </slot>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style lang="scss">
@use "@/styles/mixins";

.anyboom-tooltip {
  $this: &;

  display: inline-block;
  position: relative;

  &__trigger {
    display: inline-block;
    cursor: pointer;
    user-select: none;
    outline: none;

    &:focus-visible {
      outline: 2px solid var(--anyboom-border-focus);
      outline-offset: 2px;
      border-radius: var(--anyboom-radius-small);
    }
  }

  &__popup {
    position: fixed;
    color: var(--anyboom-tooltip-text);
    background-color: var(--anyboom-tooltip-background);
    padding: var(--anyboom-spacing-1) var(--anyboom-spacing-2);
    border-radius: var(--anyboom-radius-small);
    box-shadow: var(--anyboom-shadow-large);
    max-width: 300px;
    word-wrap: break-word;
    pointer-events: none;
    z-index: 9999;

    @include mixins.apply-text("body-xs-medium");

    &-content {
      position: relative;
      z-index: 1;
    }

    &_interactive {
      pointer-events: auto;
      cursor: default;
    }
  }
}

.tooltip-enter-active,
.tooltip-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.tooltip-enter-from,
.tooltip-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
