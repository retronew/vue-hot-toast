import type {
  RenderContent,
  Toast,
  ToastDefaultOptions,
  ToastOptions,
  ToastType,
} from './types'
import type { ValueOrFunction } from './utils'
import { ActionType, dispatch } from './store'
import { genId, resolveValue } from './utils'

type Message = ValueOrFunction<RenderContent, Toast>

type ToastHandler = (message: Message, options?: ToastOptions) => string

function createToast(
  message: Message,
  type: ToastType = 'blank',
  opts?: ToastOptions,
): Toast {
  return {
    id: opts?.id || genId(),
    type,
    message,
    createdAt: Date.now(),
    visible: true,
    dismissed: false,
    pauseDuration: 0,
    ariaProps: {
      'role': 'status',
      'aria-live': 'polite',
    },
    ...opts,
  }
}

function createHandler(type: ToastType): ToastHandler {
  return (message, options) => {
    const toast = createToast(message, type, options)
    dispatch({ type: ActionType.UPSERT_TOAST, toast })
    return toast.id
  }
}

interface PromiseMessages<T> {
  loading: RenderContent
  success?: ValueOrFunction<RenderContent, T>
  error?: ValueOrFunction<RenderContent, any>
}

interface ToastAPI extends ToastHandler {
  error: ToastHandler
  success: ToastHandler
  loading: ToastHandler
  custom: ToastHandler
  dismiss: (toastId?: string) => void
  remove: (toastId?: string) => void
  promise: <T>(
    promise: Promise<T> | (() => Promise<T>),
    msgs: PromiseMessages<T>,
    opts?: ToastDefaultOptions
  ) => Promise<T>
}

function toast(message: Message, opts?: ToastOptions): string {
  return createHandler('blank')(message, opts)
}

toast.error = createHandler('error')
toast.success = createHandler('success')
toast.loading = createHandler('loading')
toast.custom = createHandler('custom')

toast.dismiss = (toastId?: string) =>
  dispatch({ type: ActionType.DISMISS_TOAST, toastId })
toast.remove = (toastId?: string) =>
  dispatch({ type: ActionType.REMOVE_TOAST, toastId })

toast.promise = async function promise<T>(
  promise: Promise<T> | (() => Promise<T>),
  msgs: PromiseMessages<T>,
  opts?: ToastDefaultOptions,
): Promise<T> {
  const id = toast.loading(msgs.loading, { ...opts, ...opts?.loading })

  const handleUpdate = (
    handler: ToastHandler,
    message: ValueOrFunction<RenderContent, any> | undefined,
    data: any,
    handlerOpts: ToastOptions | undefined,
  ): void => {
    const msgContent = message ? resolveValue(message, data) : null
    if (msgContent) {
      handler(msgContent, { id, ...opts, ...handlerOpts })
    }
    else {
      toast.dismiss(id)
    }
  }

  try {
    const promiseToAwait = typeof promise === 'function' ? promise() : promise
    const result = await promiseToAwait

    handleUpdate(toast.success, msgs.success, result, opts?.success)
    return result
  }
  catch (error) {
    handleUpdate(toast.error, msgs.error, error, opts?.error)
    throw error
  }
}

export { toast }
export type { PromiseMessages, ToastAPI }
