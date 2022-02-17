import { suite } from 'uvu'
import * as assert from '../../assert'
import { ProfileName, sameName } from '../../../src/lib/people/profile-name'
import { isLeft, isRight } from 'fp-ts/lib/Either.js'
import { asType } from '../../as-type'

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

// sameName(left)(right)
test('names are exactly the same', () => {
    assert.ok(sameName(asType('Aurora', ProfileName))(asType('Aurora', ProfileName)))
})

test('names have different cases', () => {
    assert.ok(sameName(asType('aurora', ProfileName))(asType('AurorA', ProfileName)))
    assert.ok(sameName(asType('auROra', ProfileName))(asType('AURorA', ProfileName)))
})

test('names are different', () => {
    assert.not.ok(sameName(asType('aurora', ProfileName))(asType('eventide', ProfileName)))
})

test('one or both names are undefined', () => {
    assert.not.ok(sameName(undefined)(asType('Aurora', ProfileName)))
    assert.not.ok(sameName(asType('Aurora', ProfileName))(undefined))
    assert.not.ok(sameName(undefined)(undefined))
})

test.run()
