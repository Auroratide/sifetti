import type { Test } from 'uvu'
import * as assert from '../../../assert'
import { PeopleProvider, DuplicatePersonError } from '../../../../src/lib/people/provider/provider'
import { config } from '../../../config'
import {
    NameTakenError,
} from '../../../../src/lib/people/provider/error'
import { ProfileName } from '../../../../src/lib/people/profile-name'
import { Right } from 'fp-ts/lib/Either.js'

export type Context<T extends PeopleProvider> = {
    provider: T,
}

const makeUniqueName = (name: string): ProfileName => (ProfileName.decode(config.testAccountPrefix + name) as Right<ProfileName>).right

export const TestPeople = {
    Aurora: {
        email: 'aurora@sifetti.com',
        password: 'bluegreen',
        info: {
            name: makeUniqueName('Aurora'),
        },
    },
    Eventide: {
        email: 'eventide@sifetti.com',
        password: 'blackred',
        info: {
            name: makeUniqueName('Eventide'),
        },
    },
}

export const withProvider = <T extends PeopleProvider>(test: Test<Context<T>>, createProvider: () => T): Test<Context<T>> => {
    test.before.each((context) => {
        context.provider = createProvider()
    })
    
    test('creating accounts', async ({ provider }) => {
        const aurora = await provider.createNew(TestPeople.Aurora, TestPeople.Aurora.info)
        const eventide = await provider.createNew(TestPeople.Eventide, TestPeople.Eventide.info)

        assert.not.equal(aurora.id, eventide.id)
        assert.equal(aurora.name, makeUniqueName('Aurora'))
        assert.equal(eventide.name, makeUniqueName('Eventide'))
    })

    test('person not registered', async ({ provider }) => {
        const aurora = await provider.authenticate(TestPeople.Aurora)

        assert.not.ok(aurora)
    })

    test('person is registered already', async ({ provider }) => {
        const created = await provider.createNew(TestPeople.Aurora, TestPeople.Aurora.info)
        const authenticated = await provider.authenticate(TestPeople.Aurora)
        const person = await provider.getByToken(authenticated.token)

        assert.equal(person.id, created.id)
    })

    test('duplicating a name', async ({ provider }) => {
        await provider.createNew(TestPeople.Aurora, TestPeople.Aurora.info)
        try {
            await provider.createNew(TestPeople.Eventide, TestPeople.Aurora.info)
            assert.unreachable()
        } catch (err) {
            assert.isType(err, NameTakenError)
        }
    })

    test('duplicating a person', async ({ provider }) => {
        await provider.createNew(TestPeople.Aurora, TestPeople.Aurora.info)

        try {
            await provider.createNew(TestPeople.Aurora, { name: makeUniqueName('different-name') })
            assert.unreachable('should have thrown')
        } catch (err) {
            assert.instance(err, DuplicatePersonError)
        }
    })

    test('getting user with an invalid token', async ({ provider }) => {
        await provider.createNew(TestPeople.Aurora, TestPeople.Aurora.info)
        const person = await provider.getByToken('not-a-token')

        assert.not.ok(person)
    })

    test('invalidating a valid token', async ({ provider }) => {
        await provider.createNew(TestPeople.Aurora, TestPeople.Aurora.info)
        const authenticated = await provider.authenticate(TestPeople.Aurora)
        await provider.invalidate(authenticated.token)

        // JWTs cannot be invalidated at will
        // const person = await provider.getByToken(authenticated.token)
        // assert.not.ok(person)
    })

    test('resetting a password', async ({ provider }) => {
        await provider.createNew(TestPeople.Eventide, TestPeople.Aurora.info)
        const authenticated = await provider.authenticate(TestPeople.Eventide)
        await provider.resetPassword(authenticated.token, 'redAndBlack')

        let notAuthenticatedAnymore = await provider.authenticate(TestPeople.Eventide)
        assert.not.ok(notAuthenticatedAnymore)

        let authenticatedWithNewPassword = await provider.authenticate({
            email: TestPeople.Eventide.email,
            password: 'redAndBlack',
        })

        assert.ok(authenticatedWithNewPassword)
    })

    return test
}
