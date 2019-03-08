import {getIn} from './get-in'

describe('get-in', () => {
  it('gets deeply nested values, or `null`', () => {
    type T = {
      x: number[]
      a?: boolean
      b?: {
        h: {foo: number[]}[]
        c?: {
          d: string | undefined
        }
        e: boolean | null
        f?: string
        g?: string
      }
    }

    const o: T = {
      x: [1],
      b: {
        e: true,
        c: {
          d: undefined
        },
        g: 'hello',
        h: [{foo: [1]}, {foo: [2]}]
      }
    }

    const test = getIn(o).b.c.d()
    expect(test).toBeNull()
    const test2 = getIn(o).x[0]()
    expect(test2).toEqual(1)
    const test3 = getIn(o).b.g()
    expect(test3).toEqual('hello')
    const test4 = getIn(o).b['h'][1].foo[0]()
    expect(test4).toEqual(2)
  })
})
