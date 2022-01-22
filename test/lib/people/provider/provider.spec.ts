import type { Test } from 'uvu'
import * as assert from 'uvu/assert'
import { PeopleProvider, DuplicatePersonError } from '../../../../src/lib/people/provider/provider'

export type Context<T extends PeopleProvider> = {
    provider: T,
}

export const TestPeople = {
    Aurora: {
        email: 'aurora@sifetti.com',
        password: 'bluegreen',
    },
    Eventide: {
        email: 'eventide@sifetti.com',
        password: 'blackred',
    },
}

export const withProvider = <T extends PeopleProvider>(test: Test<Context<T>>, createProvider: () => T): Test<Context<T>> => {
    test.before.each((context) => {
        context.provider = createProvider()
    })
    
    test('creating accounts', async ({ provider }) => {
        const aurora = await provider.createNew(TestPeople.Aurora)
        const eventide = await provider.createNew(TestPeople.Eventide)

        assert.not.equal(aurora.id, eventide.id)
    })

    test('person not registered', async ({ provider }) => {
        const aurora = await provider.authenticate(TestPeople.Aurora)

        assert.not.ok(aurora)
    })

    test('person is registered already', async ({ provider }) => {
        const created = await provider.createNew(TestPeople.Aurora)
        const authenticated = await provider.authenticate(TestPeople.Aurora)
        const person = await provider.getByToken(authenticated.token)

        assert.equal(person.id, created.id)
    })

    test('duplicating a person', async ({ provider }) => {
        await provider.createNew(TestPeople.Aurora)

        try {
            await provider.createNew(TestPeople.Aurora)
            assert.unreachable('should have thrown')
        } catch (err) {
            assert.instance(err, DuplicatePersonError)
        }
    })

    test('getting user with an invalid token', async ({ provider }) => {
        await provider.createNew(TestPeople.Aurora)
        const person = await provider.getByToken('not-a-token')

        assert.not.ok(person)
    })

    test('invalidating a valid token', async ({ provider }) => {
        await provider.createNew(TestPeople.Aurora)
        const authenticated = await provider.authenticate(TestPeople.Aurora)
        await provider.invalidate(authenticated.token)

        // JWTs cannot be invalidated at will
        // const person = await provider.getByToken(authenticated.token)
        // assert.not.ok(person)
    })

    test('resetting a password', async ({ provider }) => {
        await provider.createNew(TestPeople.Eventide)
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
