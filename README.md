# getIn

This package provides a function `getIn`, which allows null-error and type-safe traversal of objects.

The `getIn` function works by wrapping a value in a function that returns that value, and then wrapping that function in a `Proxy`. To use it, call `getIn` on the object you want to traverse (e.g. `getIn(object)`) and get properties as you normally would, but when you want an actual value, call the property like a function (e.g. `getIn(object).foo.bar[0][1].baz()`). The return value will be `null` or the value itself.

## Limitations

- There are likely edge cases here. I've mostly experimented with simple arrays and plain JavaScript objects.
- Even if a type is non-nullable (such as `firstName` in the below example), the type will be nullable when gotten through `getIn`, and you'll need to perform a check for the type checker to be happy. I haven't found a way around this, yet.

## Example

```ts
type Person = {
  firstName: string
  middleName?: string
  lastName: string
  
  address?: Address
}

type Address = {
  streets: string[]
  city: string
  state: string
  zip: string
}

const p1: Person = {
  firstName: 'Jonathan',
  lastName: 'Clem',
  
  address: {
    streets: ['123 Main St.'],
    city: 'Juneau',
    state: 'Alaska',
    zip: '11111'
  }
}

const p2: Person = {
  firstName: 'Bob',
  lastName: 'Clem'
}

getIn(p1).firstName() // Type is string | null
getIn(p1).address.state() // Type is string | null, value is `'Alaska'`.
getIn(p1).address.streets[0]() // Type is string | null, value is `'123 Main St.'`.
getIn(p2).address.streets[1]() // Type is string | null, value is `null`.
```
