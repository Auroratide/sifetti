import { suite } from 'uvu'
import * as assert from '$test/assert'
import * as sorters from '$lib/shared/notes/sort'
import { buildNote } from '$test/builders/note'
import { Monday, Tuesday, Wednesday } from '$test/time'

const test = suite('Note Sorters')

const note = (title: string, updatedAt: Date = Monday) => buildNote({ title, updatedAt })

test('alphabetical - A to Z', () => {
    const unsorted = [note('banana'), note('orange'), note('apple')]

    assert.equal(unsorted.slice().sort(sorters.alphabetical(sorters.ascending)),
        [note('apple'), note('banana'), note('orange')]
    )
})

test('alphabetical - Z to A', () => {
    const unsorted = [note('banana'), note('orange'), note('apple')]

    assert.equal(unsorted.slice().sort(sorters.alphabetical(sorters.descending)),
        [note('orange'), note('banana'), note('apple')]
    )
})

test('alphabetical - case sensitivity', () => {
    const unsorted = [note('AaAA'), note('ACA'), note('aba')]

    assert.equal(unsorted.slice().sort(sorters.alphabetical(sorters.ascending)),
        [note('AaAA'), note('aba'), note('ACA')]
    )
})

test('updateDate - oldest to newest', () => {
    const apple = note('apple', Tuesday)
    const banana = note('apple', Monday)
    const orange = note('apple', Wednesday)

    const unsorted = [apple, banana, orange]

    assert.equal(unsorted.slice().sort(sorters.updateDate(sorters.ascending)),
        [banana, apple, orange]
    )
})

test('updateDate - newest to oldest', () => {
    const apple = note('apple', Tuesday)
    const banana = note('apple', Monday)
    const orange = note('apple', Wednesday)

    const unsorted = [apple, banana, orange]

    assert.equal(unsorted.slice().sort(sorters.updateDate(sorters.descending)),
        [orange, apple, banana]
    )
})

test.run()