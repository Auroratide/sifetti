import { suite } from 'uvu'
import * as assert from '../../assert'
import { seeded } from '../../../src/lib/design/random/generators'

const test = suite('Cyclic Random Generator')

test('same with same given seed', () => {
    const r1 = seeded('aurora')
    const r2 = seeded('aurora')

    assert.equal(r1.next(), r2.next())
    assert.equal(r1.next(), r2.next())
    assert.equal(r1.next(), r2.next())
})

test('different with different given seed', () => {
    const r1 = seeded('aurora')
    const r2 = seeded('eventide')

    assert.not.equal(r1.next(), r2.next())
})

test.run()