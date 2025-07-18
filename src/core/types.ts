import type { Component, CSSProperties, HTMLAttributes } from 'vue'
import type { ValueOrFunction } from './utils'

export type RenderContent = Component | string | null

export interface AriaProps extends Record<string, string> {
  'role': 'status' | 'alert'
  'aria-live': 'assertive' | 'off' | 'polite'
}

export type ToastType
  = | 'success'
    | 'error'
    | 'loading'
    | 'blank'
    | 'custom'

export type ToastPosition
  = | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right'

export interface Toast {
  id: string
  type: ToastType
  message: ValueOrFunction<RenderContent, Toast>
  icon?: Component
  duration?: number
  pauseDuration: number
  position?: ToastPosition
  removeDelay?: number

  ariaProps: AriaProps

  style?: CSSProperties
  class?: HTMLAttributes['class']
  iconTheme?: IconTheme

  createdAt: number
  visible: boolean
  dismissed: boolean
  height?: number
}

export interface IconTheme {
  primary?: string
  secondary?: string
  darkPrimary?: string
  darkSecondary?: string
}

export type ToastOptions = Partial<
  Pick<
    Toast,
    | 'id'
    | 'icon'
    | 'duration'
    | 'ariaProps'
    | 'class'
    | 'style'
    | 'position'
    | 'iconTheme'
    | 'removeDelay'
  >
>

export type ToastDefaultOptions = ToastOptions & {
  [key in ToastType]?: ToastOptions
}

export interface ToasterProps {
  position?: ToastPosition
  toastOptions?: ToastDefaultOptions
  reverseOrder?: boolean
  gutter?: number
  offset?: number
}

export interface ToastBarProps {
  toast: Toast
  position?: ToastPosition
}

export interface ToastIconProps {
  type: ToastType
  icon?: Component
  iconTheme?: IconTheme
}
