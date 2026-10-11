import type { Component } from 'vue'

export interface MenuItem {
  id: string | number
  label: string
  href?: string
  iconLeft?: Component
  iconRight?: Component
  disabled?: boolean
  active?: boolean
  target?: '_blank' | '_self' | '_parent' | '_top'
}
