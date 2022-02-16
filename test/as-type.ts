import type { Type } from 'io-ts'

/**
 * Quickly validate a raw input as some type and use it. Useful for testing:
 *   asType('some value', TagName)
 * This is type safe, so if the definition of TagName changes and a test violates
 * the new constraint, an error will be thrown.
 * 
 * If the idea is to intentionally use an invalid value, then:
 *   'some value' as TagName
 */
export const asType = <A, I>(value: I, type: Type<A, any, I>): A => {
    if (type.is(value))
        return value
    else
        throw new Error(`asType error: "${value}" was not type "${type.name}"`)
}
