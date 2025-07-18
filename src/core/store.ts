import type { ComputedRef } from 'vue'
import type { Toast, ToastDefaultOptions, ToastType } from './types'
import { computed, reactive } from 'vue'

const TOAST_LIMIT = 20

export const ActionType = {
  ADD_TOAST: 'ADD_TOAST',
  UPDATE_TOAST: 'UPDATE_TOAST',
  UPSERT_TOAST: 'UPSERT_TOAST',
  DISMISS_TOAST: 'DISMISS_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST',
  START_PAUSE: 'START_PAUSE',
  END_PAUSE: 'END_PAUSE',
} as const

interface ActionMap {
  [ActionType.ADD_TOAST]: { toast: Toast }
  [ActionType.UPDATE_TOAST]: { toast: Partial<Toast> }
  [ActionType.UPSERT_TOAST]: { toast: Toast }
  [ActionType.DISMISS_TOAST]: { toastId?: string }
  [ActionType.REMOVE_TOAST]: { toastId?: string }
  [ActionType.START_PAUSE]: { time: number }
  [ActionType.END_PAUSE]: { time: number }
}

type Action = {
  [K in keyof ActionMap]: { type: K } & ActionMap[K]
}[keyof ActionMap]

interface StoreState {
  toasts: Toast[]
  pausedAt: number | undefined
}

function updateToast(
  toasts: Toast[],
  id: string,
  updates: Partial<Toast>,
): Toast[] {
  const toastIndex = toasts.findIndex(t => t.id === id)

  if (toastIndex === -1)
    return toasts

  return toasts.map(t => t.id === id ? { ...t, ...updates } : t)
}

function dismissToasts(
  toasts: Toast[],
  toastId?: string,
): Toast[] {
  return toasts.map(t =>
    (t.id === toastId || toastId === undefined)
      ? { ...t, dismissed: true, visible: false }
      : t,
  )
}

function addPauseDuration(
  toasts: Toast[],
  duration: number,
): Toast[] {
  return toasts.map(t => ({
    ...t,
    pauseDuration: t.pauseDuration + duration,
  }))
}

export function reducer(state: StoreState, action: Action): StoreState {
  switch (action.type) {
    case ActionType.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case ActionType.UPDATE_TOAST:
      return {
        ...state,
        toasts: updateToast(state.toasts, action.toast.id!, action.toast),
      }

    case ActionType.UPSERT_TOAST: {
      const exists = state.toasts.some(t => t.id === action.toast.id)
      return reducer(state, {
        type: exists ? ActionType.UPDATE_TOAST : ActionType.ADD_TOAST,
        toast: action.toast,
      } as Action)
    }

    case ActionType.DISMISS_TOAST:
      return {
        ...state,
        toasts: dismissToasts(state.toasts, action.toastId),
      }

    case ActionType.REMOVE_TOAST:
      return {
        ...state,
        toasts: action.toastId === undefined
          ? []
          : state.toasts.filter(t => t.id !== action.toastId),
      }

    case ActionType.START_PAUSE:
      return { ...state, pausedAt: action.time }

    case ActionType.END_PAUSE: {
      if (!state.pausedAt)
        return state

      const pauseDuration = action.time - state.pausedAt
      return {
        ...state,
        pausedAt: undefined,
        toasts: addPauseDuration(state.toasts, pauseDuration),
      }
    }

    default:
      return state
  }
}

const memoryState = reactive<StoreState>({
  toasts: [],
  pausedAt: undefined,
})

export function dispatch(action: Action): void {
  const { toasts, pausedAt } = reducer(memoryState, action)
  Object.assign(memoryState, { toasts, pausedAt })
}

const defaultTimeouts: Record<ToastType, number> = {
  blank: 4000,
  error: 4000,
  success: 2000,
  loading: Infinity,
  custom: 4000,
} as const

export function useStore(toastOptions: ToastDefaultOptions = {}): {
  toasts: ComputedRef<Toast[]>
  pausedAt: ComputedRef<number | undefined>
} {
  return {
    toasts: computed(() => memoryState.toasts.map(t => ({
      ...toastOptions,
      ...toastOptions[t.type],
      ...t,
      removeDelay:
        t.removeDelay
        || toastOptions[t.type]?.removeDelay
        || toastOptions?.removeDelay,
      duration:
        t.duration
        || toastOptions[t.type]?.duration
        || toastOptions?.duration
        || defaultTimeouts[t.type],
      style: {
        ...toastOptions.style,
        ...toastOptions[t.type]?.style,
        ...t.style,
      },
    }))),
    pausedAt: computed(() => memoryState.pausedAt),
  }
}
