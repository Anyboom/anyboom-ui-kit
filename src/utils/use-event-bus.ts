type EventCallback<T = unknown> = (payload?: T) => void
type EventListeners = Map<string, Set<EventCallback>>
type EventQueue = Map<string, unknown[]>

export type { EventCallback }

const MAX_QUEUED_EVENTS = 100

export function useEventBus() {
  const listeners: EventListeners = new Map()
  const queue: EventQueue = new Map()

  function emit<T = unknown>(event: string, payload?: T): void {
    const handlers = listeners.get(event)

    if (!handlers || handlers.size === 0) {
      const pending = queue.get(event) ?? []
      pending.push(payload)

      if (pending.length > MAX_QUEUED_EVENTS) {
        pending.shift()
        console.warn(`[useEventBus] Event "${event}" was emitted without listeners more than ${MAX_QUEUED_EVENTS} times. Oldest events are being dropped.`)
      }

      queue.set(event, pending)
      return
    }

    const snapshot = Array.from(handlers)

    for (const callback of snapshot) {
      try {
        callback(payload)
      }
      catch (error) {
        console.error(`[useEventBus] Error in listener for event "${event}":`, error)
      }
    }
  }

  function on<T = unknown>(event: string, callback: EventCallback<T>): () => void {
    if (!listeners.has(event)) {
      listeners.set(event, new Set())
    }

    const handlers = listeners.get(event)!
    const cb = callback as EventCallback

    if (!handlers.has(cb)) {
      handlers.add(cb)
    }

    const pending = queue.get(event)

    if (pending && pending.length > 0) {
      for (const payload of pending) {
        try {
          cb(payload)
        }
        catch (error) {
          console.error(`[useEventBus] Error replaying queued event "${event}":`, error)
        }
      }

      queue.delete(event)
    }

    return () => off(event, callback)
  }

  function off<T = unknown>(event: string, callback?: EventCallback<T>): void {
    if (!callback) {
      console.warn(`[useEventBus] off("${event}") called without a callback. Use the unsubscribe function returned by on() instead.`)
      return
    }

    const handlers = listeners.get(event)

    if (!handlers) {
      return
    }

    handlers.delete(callback as EventCallback)

    if (handlers.size === 0) {
      listeners.delete(event)
    }
  }

  return { emit, on, off }
}
