import type { Test } from 'uvu'
import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { PeopleProvider, DuplicatePersonError } from '../../../src/lib/people/provider/provider'
import { MemoryPeopleProvider } from '../../../src/lib/people/provider/memory'
import { SupabasePeopleProvider } from '../../../src/lib/people/provider/supabase'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { config } from '../../config'

type Context<T extends PeopleProvider> = {
    provider: T,
}

const TestPeople = {
    Aurora: {
        email: 'aurora@sifetti.com',
        password: 'bluegreen',
    },
    Eventide: {
        email: 'eventide@sifetti.com',
        password: 'blackred',
    },
}

const withProvider = <T extends PeopleProvider>(test: Test<Context<T>>, createProvider: () => T): Test<Context<T>> => {
    test.before.each((context) => {
        context.provider = createProvider()
    })
    
    test('creating accounts', async ({ provider }) => {
        const aurora = await provider.createNew(TestPeople.Aurora)
        const eventide = await provider.createNew(TestPeople.Eventide)

        assert.not.equal(aurora.id, eventide.id)
        assert.not.equal(aurora.token, eventide.token)
    })

    test('person not registered', async ({ provider }) => {
        const aurora = await provider.authenticate(TestPeople.Aurora)

        assert.not.ok(aurora)
    })

    test('person is registered already', async ({ provider }) => {
        const created = await provider.createNew(TestPeople.Aurora)
        const authenticated = await provider.authenticate(TestPeople.Aurora)

        assert.equal(created.id, authenticated.id)
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

    test('getting user with a valid token', async ({ provider }) => {
        await provider.createNew(TestPeople.Aurora)
        const authenticated = await provider.authenticate(TestPeople.Aurora)
        const person = await provider.getByToken(authenticated.token)

        assert.equal(person.email, TestPeople.Aurora.email)
    })

    test('getting user with an invalid token', async ({ provider }) => {
        await provider.createNew(TestPeople.Aurora)
        const person = await provider.getByToken('not-a-token')

        assert.not.ok(person)
    })

    return test
}

const memoryTests = withProvider(
    suite<Context<MemoryPeopleProvider>>('MemoryPeopleProvider'),
    () => new MemoryPeopleProvider([])
)

const supabase = createClient(config.supabase.url, config.supabase.key)
const supabaseTests = withProvider(
    suite<Context<SupabasePeopleProvider>>('SupabasePeopleProvider'),
    () => new SupabasePeopleProvider(supabase)
)

const ensureUserDoesNotExist = async (supabase: SupabaseClient, creds: { email: string, password: string, }) => {
    const { user } = await supabase.auth.signIn(creds)

    if (user) {
        await supabase.auth.api.deleteUser(user.id, config.supabase.superkey)
    }
}

supabaseTests.before.each(async () => {
    await Promise.all(Object.values(TestPeople).map(person => {
        return ensureUserDoesNotExist(supabase, person)
    }))
})

memoryTests.run()

// TODO Eventually, these tests can only run on CI, or by explicit choice
supabaseTests.run()
