import type { Toast } from '@/components/toast/toast.ts'
import { useToastBus } from '@/components/toast/use-toast-bus.ts'

export function useToast() {
  const { emit } = useToastBus()

  function success(message: string, options?: Partial<Toast>) {
    show({
      title: 'Успешно',
      severity: 'success',
      ...options,
      message,
    })
  }
  function primary(message: string, options?: Partial<Toast>) {
    show({
      title: 'Информация',
      severity: 'primary',
      ...options,
      message,
    })
  }

  function info(message: string, options?: Partial<Toast>) {
    show({
      title: 'Информация',
      severity: 'info',
      ...options,
      message,
    })
  }

  function secondary(message: string, options?: Partial<Toast>) {
    show({
      title: 'Дополнительная информация',
      severity: 'secondary',
      ...options,
      message,
    })
  }

  function warning(message: string, options?: Partial<Toast>) {
    show({
      title: 'Предупреждение',
      severity: 'warning',
      ...options,
      message,
    })
  }

  function error(message: string, options?: Partial<Toast>) {
    show({ title: 'Ошибка', severity: 'error', ...options, message })
  }

  function show(options?: Partial<Toast>) {
    emit('toast:add', {
      ...options,
    })
  }

  function clear() {
    emit('toast:clear')
  }

  function remove(id: string | number) {
    emit('toast:remove', { id })
  }

  return {
    success,
    primary,
    info,
    secondary,
    warning,
    error,
    clear,
    remove,
  }
}
