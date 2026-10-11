import type { FloatingPlacement } from './floating-placement.ts'

const VIEWPORT_PADDING = 10

export interface FloatingPosition {
  top: number
  left: number
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

function verticalOverlap(
  top: number,
  triggerRect: DOMRect,
  contentHeight: number,
): number {
  return Math.max(
    0,
    Math.min(top + contentHeight, triggerRect.bottom)
    - Math.max(top, triggerRect.top),
  )
}

function horizontalOverlap(
  left: number,
  triggerRect: DOMRect,
  contentWidth: number,
): number {
  return Math.max(
    0,
    Math.min(left + contentWidth, triggerRect.right)
    - Math.max(left, triggerRect.left),
  )
}

export function resolvePosition(
  placement: FloatingPlacement,
  triggerRect: DOMRect,
  contentWidth: number,
  contentHeight: number,
  offset: number,
): FloatingPosition {
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  if (placement === 'top' || placement === 'bottom') {
    const left = clamp(
      triggerRect.left + (triggerRect.width - contentWidth) / 2,
      VIEWPORT_PADDING,
      viewportWidth - VIEWPORT_PADDING - contentWidth,
    )

    const belowTop = clamp(
      triggerRect.bottom + offset,
      VIEWPORT_PADDING,
      viewportHeight - VIEWPORT_PADDING - contentHeight,
    )
    const aboveTop = clamp(
      triggerRect.top - contentHeight - offset,
      VIEWPORT_PADDING,
      viewportHeight - VIEWPORT_PADDING - contentHeight,
    )

    const belowOverlap = verticalOverlap(belowTop, triggerRect, contentHeight)
    const aboveOverlap = verticalOverlap(aboveTop, triggerRect, contentHeight)

    const top
      = placement === 'bottom'
        ? belowOverlap <= aboveOverlap
          ? belowTop
          : aboveTop
        : aboveOverlap <= belowOverlap
          ? aboveTop
          : belowTop

    return { top, left }
  }

  const top = clamp(
    triggerRect.top + (triggerRect.height - contentHeight) / 2,
    VIEWPORT_PADDING,
    viewportHeight - VIEWPORT_PADDING - contentHeight,
  )

  const rightLeft = clamp(
    triggerRect.right + offset,
    VIEWPORT_PADDING,
    viewportWidth - VIEWPORT_PADDING - contentWidth,
  )
  const leftLeft = clamp(
    triggerRect.left - contentWidth - offset,
    VIEWPORT_PADDING,
    viewportWidth - VIEWPORT_PADDING - contentWidth,
  )

  const rightOverlap = horizontalOverlap(rightLeft, triggerRect, contentWidth)
  const leftOverlap = horizontalOverlap(leftLeft, triggerRect, contentWidth)

  const left
    = placement === 'right'
      ? rightOverlap <= leftOverlap
        ? rightLeft
        : leftLeft
      : leftOverlap <= rightOverlap
        ? leftLeft
        : rightLeft

  return { top, left }
}
