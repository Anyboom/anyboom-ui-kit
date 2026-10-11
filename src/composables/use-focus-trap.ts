import type { ComponentPublicInstance, Ref } from 'vue'
import { nextTick, onUnmounted, watch } from 'vue'

const FOCUSABLE_SELECTOR = [
  'button:not([disabled])',
  'a[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
].join(', ')

interface UseFocusTrapOptions {
  excludedRefs?: Ref<HTMLElement | ComponentPublicInstance | undefined>[]
}

function getElement(value: unknown): HTMLElement | undefined {
  if (value instanceof HTMLElement) {
    return value
  }

  if (
    value
    && typeof value === 'object'
    && '$el' in value
    && value.$el instanceof HTMLElement
  ) {
    return value.$el
  }

  return undefined
}

function getExcludedElements(
  excludedRefs: Ref<HTMLElement | ComponentPublicInstance | undefined>[],
): HTMLElement[] {
  return excludedRefs
    .map(ref => getElement(ref.value))
    .filter((el): el is HTMLElement => el !== undefined)
}

interface InertRestoreEntry {
  element: Element
  inert: string | null
  ariaHidden: string | null
}

/**
 * Перехватывает фокус внутри панели, фокусирует её при открытии
 * и возвращает фокус на предыдущий активный элемент при закрытии.
 */
export function useFocusTrap(
  panelRef: Ref<HTMLElement | undefined>,
  isOpen: Ref<boolean>,
  options: UseFocusTrapOptions = {},
) {
  const { excludedRefs = [] } = options

  let previousActiveElement: Element | null = null
  let inertRestoreStack: InertRestoreEntry[] = []

  function getFocusableElements(): HTMLElement[] {
    const panel = panelRef.value
    if (!panel)
      return []

    return Array.from(panel.querySelectorAll(FOCUSABLE_SELECTOR))
      .filter((el): el is HTMLElement => {
        return (
          el instanceof HTMLElement
          && el.offsetParent !== null
          && el.tabIndex >= 0
        )
      })
  }

  function handleTab(event: KeyboardEvent) {
    if (event.key !== 'Tab')
      return

    const focusable = getFocusableElements()
    if (focusable.length === 0) {
      event.preventDefault()
      panelRef.value?.focus()
      return
    }

    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    const active = document.activeElement

    if (event.shiftKey && active === first) {
      event.preventDefault()
      last.focus()
    }
    else if (!event.shiftKey && active === last) {
      event.preventDefault()
      first.focus()
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (!isOpen.value)
      return
    handleTab(event)
  }

  function setInert() {
    const panel = panelRef.value
    if (!panel || !panel.parentElement)
      return

    const excluded = new Set<Element>(getExcludedElements(excludedRefs))
    excluded.add(panel)

    const siblings = Array.from(panel.parentElement.children)
    inertRestoreStack = siblings
      .filter(sibling => !excluded.has(sibling))
      .map((sibling) => {
        return {
          element: sibling,
          inert: sibling.getAttribute('inert'),
          ariaHidden: sibling.getAttribute('aria-hidden'),
        }
      })

    inertRestoreStack.forEach(({ element }) => {
      element.setAttribute('inert', '')
      element.setAttribute('aria-hidden', 'true')
    })
  }

  function restoreInert() {
    inertRestoreStack.forEach(({ element, inert, ariaHidden }) => {
      if (inert === null) {
        element.removeAttribute('inert')
      }
      else {
        element.setAttribute('inert', inert)
      }

      if (ariaHidden === null) {
        element.removeAttribute('aria-hidden')
      }
      else {
        element.setAttribute('aria-hidden', ariaHidden)
      }
    })

    inertRestoreStack = []
  }

  async function open() {
    await nextTick()

    const panel = panelRef.value
    if (!panel)
      return

    previousActiveElement = document.activeElement
    panel.tabIndex = -1
    panel.focus()

    setInert()
    document.addEventListener('keydown', handleKeydown)
  }

  function close() {
    document.removeEventListener('keydown', handleKeydown)
    restoreInert()

    if (previousActiveElement instanceof HTMLElement) {
      previousActiveElement.focus()
    }

    previousActiveElement = null
  }

  const stopWatch = watch(
    isOpen,
    (value) => {
      if (value) {
        open()
      }
      else {
        close()
      }
    },
    { immediate: true },
  )

  onUnmounted(() => {
    stopWatch()
    document.removeEventListener('keydown', handleKeydown)
    restoreInert()
  })
}
