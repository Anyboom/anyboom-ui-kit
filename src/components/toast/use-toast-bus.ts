import type { Toast } from '@/components/toast/toast.ts'
import type { EventCallback } from '@/utils/use-event-bus.ts'
import { useEventBus } from '@/utils/use-event-bus.ts'

export function useToastBus() {
  const bus = useEventBus()

  return {
    emit: (event: string, payload?: Toast): void => {
      bus.emit(event, payload)
    },
    on: <T>(event: string, callback: EventCallback<T>): void => {
      bus.on(event, callback)
    },
    off: <T>(event: string, callback?: EventCallback<T>): void => {
      bus.off(event, callback)
    },
  }
}
