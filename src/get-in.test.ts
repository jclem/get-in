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

    const test = getIn(o).b.c.d.get()
    expect(test).toBeNull()
    const test2 = getIn(o).b.f.get()
    expect(test2).toBeNull()
    const test3 = getIn(o).b.g.get()
    expect(test3).toEqual('hello')
    const test4 = getIn(o).b['h'][1].foo[0].get()
    expect(test4).toEqual(2)
    const test5 = getIn(o).x[0].get()
    expect(test5).toEqual(1)
  })
})
