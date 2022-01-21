import { suite } from 'uvu'
import * as assert from '../../assert'
import { cyclic } from '../../../src/lib/design/random/generators'

const test = suite('Cyclic Random Generator')

test('loops through the given digits', () => {
    const random = cyclic([1, 2, 3])

    assert.equal(random.next(), 1)
    assert.equal(random.next(), 2)
    assert.equal(random.next(), 3)
    assert.equal(random.next(), 1)
})

test.run()