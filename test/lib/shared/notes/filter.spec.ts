import { suite } from 'uvu'
import * as assert from '$test/assert'
import * as filters from '$lib/shared/notes/filter'
import { buildTag } from '$test/builders/tag'
import { buildNote } from '$test/builders/note'
import { asType } from '$test/as-type'
import { TagName } from '$lib/shared/tags/types/tag-name'
import type { Tag } from '$lib/shared/tags/types'

const test = suite('Note Filters')

const tag = (name: string) => buildTag({ id: name, name: asType(name, TagName) })
const note = (title: string, tags: Tag[] = []) => buildNote({ title, tags })

test('containingAllTags - empty tags list', () => {
    const hasTags = filters.containingAllTags([])

    // matches all notes
    assert.ok(hasTags(note('apple')))
    assert.ok(hasTags(note('carrot')))
})

test('containingAllTags - single tag to find', () => {
    const fruitTag = tag('fruit')

    const hasTags = filters.containingAllTags([fruitTag])

    // the notes must have the given tag
    assert.ok(hasTags(note('apple', [ fruitTag ])))
    assert.not.ok(hasTags(note('carrot', [ ])))
})

test('containingAllTags - multiple tags to find', () => {
    const fruitTag = tag('fruit')
    const redTag = tag('red')

    const hasTags = filters.containingAllTags([ fruitTag, redTag ])

    // the note must have every tag
    assert.ok(hasTags(note('apple', [ fruitTag, redTag ])))
    assert.not.ok(hasTags(note('banana', [ fruitTag ])))
    assert.not.ok(hasTags(note('tomato', [ redTag ])))
})

test('textInTitle - empty string', () => {
    const hasText = filters.textInTitle('')

    // accept every note
    assert.ok(hasText(note('apple')))
    assert.ok(hasText(note('banana')))
})

test('textInTitle - some text specified', () => {
    const hasText = filters.textInTitle('Fruit')

    // text can be anywhere in the title
    assert.ok(hasText(note('Fruitcake')))
    assert.ok(hasText(note('Basket of Fruit')))
    assert.not.ok(hasText(note('Apple Pie')))
})

test('textInTitle - differing case', () => {
    const hasText = filters.textInTitle('fruit')

    // it is case insensitive
    assert.ok(hasText(note('Fruitcake')))
    assert.ok(hasText(note('Basket of FRUIT')))
    assert.not.ok(hasText(note('Apple Pie')))
})

test.run()