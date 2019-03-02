type GetProxyArr<V> = GetProxyObj<V>[] & {
  get: () => NonNullable<V[]> | null
}

type GetProxyObj<V> = {[K in keyof Required<V>]: GetProxy<V[K]>} & {
  get: () => NonNullable<V> | null
}

type GetProxy<V> = V extends (infer T)[] ? GetProxyArr<T> : GetProxyObj<V>

type ValueWrapper<T> = {value: T}

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
  if (obj.hasOwnProperty('get')) {
    throw new Error(
      'Can not create a getIn proxy for an object with a `get` key'
    )
  }

  // We wrap each value, since `Proxy` must wrap an object.
  return (new Proxy(wrap(obj), {
    get<K extends keyof O>(target: ValueWrapper<O>, prop: K) {
      const targetValue = unwrap(target)

      if (prop === 'get') {
        return () => (isEmpty ? null : targetValue)
      }

      const value = targetValue[prop]

      if (value == null) {
        return nullProxy()
      }

      return getIn(value)
    }
  }) as unknown) as GetProxy<O>
}

function wrap<T>(value: T): ValueWrapper<T> {
  return {value}
}

function unwrap<T>(wrapper: ValueWrapper<T>): T {
  return wrapper.value
}

function nullProxy(): GetProxyObj<{}> {
  return getIn({}, true)
}
