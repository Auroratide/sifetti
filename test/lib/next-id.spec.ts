import { suite } from 'uvu'
import * as assert from '../assert'
import { nextId } from '../../src/lib/next-id'

const test = suite('Next Id')

const o = (id: string) => ({ id })

test('first id', () => {
    assert.equal(nextId([], it => it.id), '1')
})

test('next id is numerically sequential', () => {
    assert.equal(nextId([ o('1') ], it => it.id), '2')
    assert.equal(nextId([ o('2') ], it => it.id), '3')
    assert.equal(nextId([ o('2'), o('1') ], it => it.id), '3')
})

test.run()