import { suite, Test } from 'uvu'
import { Message, Assertion } from 'uvu/assert'
import { compare } from 'uvu/diff'

const suiteFor = (name: string, tests: (test: Test) => void): void => {
    let t = suite(name)
    tests(t)
    t.run()
}

// A blatant copy from uvu
const assert = (bool: boolean, actual: any, expects: any, operator: any, detailer: any, backup: any, msg: any) => {
	if (bool) return;
	let message = msg || backup;
	if (msg instanceof Error) throw msg;
	let details = detailer && detailer(actual, expects);
	throw new Assertion({ actual, expects, operator, message, details, generated: !msg });
}

const fails = (fn: () => void, msg?: Message) => {
    try {
        fn()
    } catch(err) {
        if (err instanceof Assertion) return

        assert(false, true, false, 'fails', false, `Should have failed, but threw an error\n\t${err}`, undefined)
    }

    assert(false, true, false, 'fails', false, 'Should have failed, but it did not!', msg)
}

export * from 'uvu/assert'

export const sameSet = <T>(actual: T[], expected: T[], msg?: Message) => {
    const aInE = actual.every(it => expected.includes(it))
    const eInA = expected.every(it => actual.includes(it))

    assert(aInE && eInA, actual, expected, 'sameSet', compare, 'Expected sets to have the same elements', msg)
}

suiteFor('Same Set Assertion', test => {
    test('sets are the same', () => {
        sameSet([], [])
        sameSet([1, 2, 3], [3, 2, 1])
        sameSet(['a', 'b', 'c'], ['b', 'c', 'a'])
    })

    test('sets are different sizes', () => {
        fails(() => sameSet([1, 2, 3], [1, 2]))
        fails(() => sameSet([], ['a', 'b']))
    })

    test('sets contain different elements', () => {
        fails(() => sameSet([1, 2, 3], [2, 3, 4]))
        fails(() => sameSet(['a', 'b', 'c'], ['1', '2', '3']))
    })
})

export const isType = <T>(obj: unknown, type: new(...args: any[]) => T, msg?: Message): obj is T => {
    assert(obj instanceof type, typeof obj, type, 'isType', false, `Expected object to be of a certain type (${type.name})`, msg)
    return true
}

suiteFor('Is Type Assertion', test => {
    class A { }
    class B { }
    class Aa extends A {
        // this is to ensure the type annotation if isType accepts classes with parameterful constructors
        constructor() { super() }
    }

    test('types are the same', () => {
        isType(new A(), A)
    })

    test('types are incompatible', () => {
        fails(() => isType(new A(), B))
        fails(() => isType(new B(), A))
    })

    test('type is derivative', () => {
        isType(new Aa(), A)
        isType(new Aa(), Aa)
    })
})