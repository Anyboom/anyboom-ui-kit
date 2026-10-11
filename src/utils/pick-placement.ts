import type { FloatingPlacement } from './floating-placement.ts'

export function pickPlacement(
  preferred: FloatingPlacement,
  triggerRect: DOMRect,
  contentWidth: number,
  contentHeight: number,
  offset: number,
): FloatingPlacement {
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  const space = {
    top: triggerRect.top,
    bottom: viewportHeight - triggerRect.bottom,
    left: triggerRect.left,
    right: viewportWidth - triggerRect.right,
  }

  const required = {
    top: contentHeight + offset,
    bottom: contentHeight + offset,
    left: contentWidth + offset,
    right: contentWidth + offset,
  }

  const placements: FloatingPlacement[] = ['top', 'bottom', 'left', 'right']

  const available = placements.filter(p => space[p] >= required[p])

  if (available.includes(preferred)) {
    return preferred
  }

  if (available.length > 0) {
    let bestPlacement = available[0]
    let maxSpace = space[available[0]] || 0

    for (const placement of available) {
      const currentSpace = space[placement] || 0
      if (currentSpace > maxSpace) {
        maxSpace = currentSpace
        bestPlacement = placement
      }
    }

    return bestPlacement
  }

  let bestPlacement = preferred
  let maxSpace = space[preferred] || 0

  for (const placement of placements) {
    const currentSpace = space[placement] || 0
    if (currentSpace > maxSpace) {
      maxSpace = currentSpace
      bestPlacement = placement
    }
  }

  return bestPlacement
}
