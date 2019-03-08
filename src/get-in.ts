type CallableProxy<T> = {(): T | null}
type GetProxyArr<V> = {[index: number]: GetProxyObj<V>} & CallableProxy<V[]>
type GetProxyObj<V> = {[K in keyof Required<V>]: GetProxy<V[K]>} & CallableProxy<V>
type GetProxy<V> = V extends (infer T)[] ? GetProxyArr<T> : GetProxyObj<V>

/**
 * Create a `GetProxy` from `obj`.
 *
 * ```ts
 * type T = {a?: {b?: {c?: {d: string | null}}}}
 * const t: T = {}
 * const value = getIn(t).a.b.c.d.get() // type: string | null, value: null
 * ```
 */
export function getIn<O>(obj: O, isEmpty: boolean = false): GetProxy<O> {
  // We wrap the value in a function so that we can use `Proxy.apply` to get it.
  return (new Proxy(() => obj, {
    get<K extends keyof O>(target: () => O, prop: K): GetProxy<{}> | GetProxy<O[K]> {
      const targetValue = target()

      const value = targetValue[prop]

      if (value == null) {
        return nullProxy()
      }

      return getIn(value)
    },

    apply(target) {
      return isEmpty ? null : target()
    }
  }) as unknown) as GetProxy<O>
}

function nullProxy(): GetProxyObj<{}> {
  return getIn({}, true)
}
