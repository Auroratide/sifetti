import { suite } from 'uvu'
import * as assert from '../../assert'
import { TagName } from '../../../src/lib/tags/tag-name'
import { isLeft, isRight } from 'fp-ts/Either'
import { PathReporter } from 'io-ts/lib/PathReporter'

const test = suite('Profile Name Type')

test('a valid name', () => {
    assert.ok(isRight(TagName.decode('A Tag')))
})

test('at least one character', () => {
    assert.ok(isLeft(TagName.decode('')))
})

test('terminal characters not a space', () => {
    assert.ok(isLeft(TagName.decode(' a')))
    assert.ok(isLeft(TagName.decode('a ')))
})

test('tabs and newlines not allowed', () => {
    assert.ok(isLeft(TagName.decode('name\tstuff')))
    assert.ok(isLeft(TagName.decode('name\nstuff')))
    assert.ok(isLeft(TagName.decode('name\rstuff')))
})

test('no consecutive spaces', () => {
    assert.ok(isLeft(TagName.decode('tag  name')))
})

test.run()
