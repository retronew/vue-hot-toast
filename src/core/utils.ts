export const genId = (() => {
  let count = 0
  return () => {
    return (++count).toString()
  }
})()

export const prefersReducedMotion = (() => {
  let shouldReduceMotion: boolean | undefined

  return () => {
    if (shouldReduceMotion === undefined && typeof window !== 'undefined') {
      const mediaQuery = matchMedia('(prefers-reduced-motion: reduce)')
      shouldReduceMotion = !mediaQuery || mediaQuery.matches
    }
    return shouldReduceMotion
  }
})()

export type ValueFunction<TValue, TArg> = (arg: TArg) => TValue
export type ValueOrFunction<TValue, TArg>
  = | TValue
    | ValueFunction<TValue, TArg>

function isFunction<TValue, TArg>(
  valOrFunction: ValueOrFunction<TValue, TArg>,
): valOrFunction is ValueFunction<TValue, TArg> {
  return typeof valOrFunction === 'function'
}

export function resolveValue<TValue, TArg>(
  valOrFunction: ValueOrFunction<TValue, TArg>,
  arg: TArg,
): TValue {
  return isFunction(valOrFunction) ? valOrFunction(arg) : valOrFunction
}
