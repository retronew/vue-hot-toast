import type { Ref } from 'vue'
import type { Toast, ToastDefaultOptions, ToastPosition } from './types'
import { watch, watchEffect } from 'vue'
import { ActionType, dispatch, useStore } from './store'
import { toast } from './toast'

const DEFAULT_GUTTER = 8
const REMOVE_DELAY = 1000

type OnHeightUpdate = (id: string, height: number) => void

function updateHeight(toastId: string, height: number): void {
  if (!toastId || height < 0)
    return

  dispatch({
    type: ActionType.UPDATE_TOAST,
    toast: { id: toastId, height },
  })
}

function startPause(): void {
  dispatch({
    type: ActionType.START_PAUSE,
    time: Date.now(),
  })
}

const toastTimeouts = new Map<Toast['id'], ReturnType<typeof setTimeout>>()

function addToRemoveQueue(
  toastId: string,
  removeDelay = REMOVE_DELAY,
): void {
  if (!toastId || toastTimeouts.has(toastId))
    return

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: ActionType.REMOVE_TOAST,
      toastId,
    })
  }, Math.max(0, removeDelay))
  toastTimeouts.set(toastId, timeout)
}

interface CalculateOffsetOptions {
  reverseOrder?: boolean
  gutter?: number
  defaultPosition?: ToastPosition
}

export default function useToaster(toastOptions?: ToastDefaultOptions): {
  toasts: Ref<Toast[]>
  handlers: {
    updateHeight: OnHeightUpdate
    startPause: () => void
    endPause: () => void
    calculateOffset: (toast: Toast, opts?: CalculateOffsetOptions) => number
  }
} {
  const { toasts, pausedAt } = useStore(toastOptions)

  const toastTimers = new Map<string, ReturnType<typeof setTimeout>>()

  watchEffect((onCleanup) => {
    if (pausedAt.value)
      return

    const now = Date.now()

    const currentToastIds = new Set(toasts.value.map(t => t.id))
    for (const [id, timer] of toastTimers) {
      if (!currentToastIds.has(id)) {
        clearTimeout(timer)
        toastTimers.delete(id)
      }
    }

    toasts.value.forEach((t) => {
      if (t.duration === Infinity || toastTimers.has(t.id))
        return
      const durationLeft = (t.duration || 0) + t.pauseDuration - (now - t.createdAt)

      if (durationLeft < 0) {
        if (t.visible)
          toast.dismiss(t.id)
        return
      }
      const timer = setTimeout(() => {
        toast.dismiss(t.id)
        toastTimers.delete(t.id)
      }, durationLeft)

      toastTimers.set(t.id, timer)
    })

    onCleanup(() => {
      toastTimers.forEach(timer => clearTimeout(timer))
      toastTimers.clear()
    })
  })

  watch(toasts, (currentToasts) => {
    // Add dismissed toasts to remove queue
    currentToasts.forEach((t) => {
      if (t.dismissed) {
        addToRemoveQueue(t.id, t.removeDelay)
      }
      else {
        // If toast becomes visible again, remove it from the queue
        const timeout = toastTimeouts.get(t.id)
        if (timeout) {
          clearTimeout(timeout)
          toastTimeouts.delete(t.id)
        }
      }
    })
  }, { deep: true })

  const endPause = (): void => {
    if (pausedAt.value) {
      dispatch({ type: ActionType.END_PAUSE, time: Date.now() })
    }
  }

  const calculateOffset = (
    toast: Toast,
    opts?: CalculateOffsetOptions,
  ): number => {
    const {
      reverseOrder = false,
      gutter = DEFAULT_GUTTER,
      defaultPosition,
    } = opts || {}
    const toastPosition = toast.position || defaultPosition

    const offset = toasts.value.reduce((acc, t) => {
      if (
        t.height
        && t.visible
        && (t.position || defaultPosition) === toastPosition
      ) {
        const isToastBefore = reverseOrder
          ? t.createdAt > toast.createdAt
          : t.createdAt < toast.createdAt

        if (isToastBefore) {
          return acc + t.height + gutter
        }
      }
      return acc
    }, 0)

    return offset
  }

  return {
    toasts,
    handlers: {
      updateHeight,
      startPause,
      endPause,
      calculateOffset,
    },
  }
}

export { useToaster }
