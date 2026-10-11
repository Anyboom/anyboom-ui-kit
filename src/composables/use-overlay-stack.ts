import type { Ref } from 'vue'
import { onUnmounted, useId, watch } from 'vue'

interface OverlayEntry {
  id: string
  close: () => void
}

const stack: OverlayEntry[] = []
let listenerAttached = false

function handleKeydown(event: KeyboardEvent): void {
  if (event.key !== 'Escape' || stack.length === 0) {
    return
  }

  event.stopPropagation()
  stack[stack.length - 1]!.close()
}

function attachListener(): void {
  if (listenerAttached) {
    return
  }

  document.addEventListener('keydown', handleKeydown, true)
  listenerAttached = true
}

function detachListener(): void {
  if (!listenerAttached) {
    return
  }

  document.removeEventListener('keydown', handleKeydown, true)
  listenerAttached = false
}

function push(entry: OverlayEntry): void {
  remove(entry.id)
  stack.push(entry)
  attachListener()
}

function remove(id: string): void {
  const index = stack.findIndex(entry => entry.id === id)

  if (index !== -1) {
    stack.splice(index, 1)
  }

  if (stack.length === 0) {
    detachListener()
  }
}

/**
 * Регистрирует оверлей в глобальном стеке.
 * При нажатии Escape закрывается только верхний оверлей.
 */
export function useOverlayStack(isOpen: Ref<boolean>, close: () => void): void {
  const id = useId()

  watch(
    isOpen,
    (value) => {
      if (value) {
        push({ id, close })
      }
      else {
        remove(id)
      }
    },
    { immediate: true },
  )

  onUnmounted(() => {
    remove(id)
  })
}
