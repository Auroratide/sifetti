import { suite } from 'uvu'
import * as assert from '../../assert'
import { ProfileName } from '../../../src/lib/people/profile-name'
import { isLeft, isRight } from 'fp-ts/Either'

const test = suite('Profile Name Type')

test('a valid name', () => {
    assert.ok(isRight(ProfileName.decode('Timothy Foster')))
})

test('at least one character', () => {
    assert.ok(isLeft(ProfileName.decode('')))
})

test('first character alphanumeric', () => {
    assert.ok(isLeft(ProfileName.decode('_a')))
    assert.ok(isLeft(ProfileName.decode('-a')))
    assert.ok(isLeft(ProfileName.decode(' a')))
})

test('only _, -, and space are allowed', () => {
    assert.ok(isLeft(ProfileName.decode('name$')))
    assert.ok(isLeft(ProfileName.decode('name@')))
    assert.ok(isLeft(ProfileName.decode('name%')))
})

test('max length is 64', () => {
    assert.ok(isLeft(ProfileName.decode('12345678901234567890123456789012345678901234567890123456789012345')))
})

test('no consecutive spaces', () => {
    assert.ok(isLeft(ProfileName.decode('Timothy  Foster')))
})

test('last character is not a space', () => {
    assert.ok(isLeft(ProfileName.decode('Timothy Foster ')))
})

test.run()
