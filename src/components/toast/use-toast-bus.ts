import type { Toast } from '@/components/toast/toast.ts'
import type { EventCallback } from '@/utils/use-event-bus.ts'
import { useEventBus } from '@/utils/use-event-bus.ts'

const bus = useEventBus()
const activeToasters = new Set<symbol>()

export function useToastBus() {
  return {
    emit: (event: string, payload?: Toast): void => {
      bus.emit(event, payload)
    },
    on: <T>(event: string, callback: EventCallback<T>): (() => void) => {
      return bus.on(event, callback)
    },
    off: <T>(event: string, callback?: EventCallback<T>): void => {
      bus.off(event, callback)
    },
  }
}

export function claimToaster(id: symbol): boolean {
  if (activeToasters.size > 0) {
    return false
  }

  activeToasters.add(id)
  return true
}

export function releaseToaster(id: symbol): void {
  activeToasters.delete(id)
}
