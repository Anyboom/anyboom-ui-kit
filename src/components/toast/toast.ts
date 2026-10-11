export interface Toast {
  id?: string | number
  message?: string
  title?: string
  severity?: 'primary' | 'secondary' | 'success' | 'danger' | 'info' | 'warn'
  duration?: number
  closable?: boolean
  showIcon?: boolean
  position?:
    | 'top-right'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-left'
    | 'top-center'
    | 'bottom-center'
}
