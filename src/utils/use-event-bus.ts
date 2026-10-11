import { ref } from 'vue'

type EventCallback<T = unknown> = (payload?: T) => void
type EventMap = Record<string, EventCallback[]>

export type { EventCallback }

const events = ref<EventMap>({})

export function useEventBus() {
  function emit<T = unknown>(event: string, payload?: T): void {
    if (!events.value[event]) {
      return
    }

    events.value[event].forEach(callback => callback(payload))
  }

  function on<T = unknown>(event: string, callback: EventCallback<T>): void {
    if (events.value[event] === undefined) {
      events.value[event] = []
    }

    events.value[event].push(callback as EventCallback)
  }

  function off<T = unknown>(event: string, callback?: EventCallback<T>): void {
    if (!events.value[event]) {
      return
    }

    if (callback) {
      events.value[event] = events.value[event].filter(cb => cb !== callback)
    }
    else {
      delete events.value[event]
    }
  }

  return { emit, on, off }
}
