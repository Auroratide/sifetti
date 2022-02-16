import { suite } from 'uvu'
import * as assert from '../../assert'
import * as t from 'io-ts'
import { makeReporter } from '../../../src/lib/api/validation'

const test = suite('Validation Utilities')

const MustContainA = t.brand(
    t.string,
    (n): n is t.Branded<string, { readonly MustContainA: unique symbol }> => /a/i.test(n),
    'MustContainA'
)

const MustNotContainB = t.brand(
    t.string,
    (n): n is t.Branded<string, { readonly MustNotContainB: unique symbol }> => /^[^b]*$/i.test(n),
    'MustNotContainB'
)

export const SampleType = t.intersection([
    MustContainA,
    MustNotContainB,
], 'SampleType')

const SampleTypeReporter = makeReporter([ {
    type: MustContainA,
    message: 'It must contain the letter "a"',
}, {
    type: MustNotContainB,
    message: 'It must NOT contain the letter "b"',
} ], 'Default message reached')

test('no errors', () => {
    const validation = SampleType.decode('apple')
    assert.sameSet(SampleTypeReporter.report(validation), ['No errors!'])
})

test('one violation', () => {
    const validation = SampleType.decode('kiwi')
    assert.sameSet(SampleTypeReporter.report(validation), ['It must contain the letter "a"'])
})

test('multiple violations', () => {
    const validation = SampleType.decode('blueberry')
    assert.sameSet(SampleTypeReporter.report(validation), [
        'It must contain the letter "a"',
        'It must NOT contain the letter "b"',
    ])
})

test.run()