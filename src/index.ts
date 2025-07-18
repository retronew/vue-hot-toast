import { toast } from './core/toast'

export { default as Toaster } from './components/Toaster.vue'
export { useStore as useToasterStore } from './core/store'
export * from './core/types'
export { useToaster } from './core/useToaster'

export { toast }
export default toast
