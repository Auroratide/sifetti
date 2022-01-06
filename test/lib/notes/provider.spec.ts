import type { Test } from 'uvu'
import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import type { NotesProvider } from '../../../src/lib/notes/provider/provider'
import { MemoryPeopleProvider } from '../../../src/lib/people/provider/memory'
import { MemoryNotesProvider } from '../../../src/lib/notes/provider/memory'
import { SupabaseNotesProvider } from '../../../src/lib/notes/provider/supabase'
import type { JwtToken } from '../../../src/lib/security/jwt'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { config } from '../../config'

const TestPeople = {
    Cay: {
        id: '1',
        email: 'cay@sifetti.com',
        password: 'patcher',
    },
    Antler: {
        id: '2',
        email: 'antler@sifetti.com',
        password: 'tracer',
    },
}

type Context<T extends NotesProvider> = {
    provider: T,
    tokens: Record<keyof typeof TestPeople, JwtToken>,
}

const withProvider = <T extends NotesProvider>(test: Test<Context<T>>, createProvider: () => T): Test<Context<T>> => {
    test.before.each((context) => {
        context.provider = createProvider()
    })

    test('accessing a note', async ({ provider, tokens }) => {
        const id = await provider.createEmpty(tokens.Cay)
        const note = await provider.findById(id, tokens.Cay)

        assert.equal(id, note.id)
    })

    test('accessing someone else\'s note', async ({ provider, tokens }) => {
        const id = await provider.createEmpty(tokens.Cay)
        const note = await provider.findById(id, tokens.Antler)

        assert.not.ok(note, 'Antler was able to access Cay\'s note, but he shouldn\'t be able to')
    })

    test('accessing all notes', async ({ provider, tokens }) => {
        const cay = [
            await provider.createEmpty(tokens.Cay),
            await provider.createEmpty(tokens.Cay),
        ]
        const antler = [
            await provider.createEmpty(tokens.Antler),
            await provider.createEmpty(tokens.Antler),
        ]

        assertSameSet((await provider.getAll(tokens.Cay)).map(it => it.id), cay)
        assertSameSet((await provider.getAll(tokens.Antler)).map(it => it.id), antler)
    })

    return test
}

const memoryPeopleProvider = new MemoryPeopleProvider(Object.values(TestPeople))
const memoryTests = withProvider(
    suite<Context<MemoryNotesProvider>>('MemoryNotesProvider'),
    () => new MemoryNotesProvider(memoryPeopleProvider, [])
)

memoryTests.before.each(async (context) => {
    context.tokens = {
        Cay: '',
        Antler: '',
    }
    const entries = Object.entries(TestPeople)

    for (let [ name, person ] of entries) {
        context.tokens[name] = (await memoryPeopleProvider.authenticate(person)).token
    }
})

const supabaseTests = withProvider(
    suite<Context<SupabaseNotesProvider>>('SupabaseNotesProvider'),
    () => new SupabaseNotesProvider({
        url: config.supabase.url,
        key: config.supabase.key,
    })
)

const ensureUserExists = async (supabase: SupabaseClient, creds: { email: string, password: string, }): Promise<string> => {
    let { session } = await supabase.auth.signIn(creds)

    if (!session) {
        session = (await supabase.auth.signUp(creds)).session
    }

    return session.access_token
}

const ensureUserHasNoNotes = async (supabase: SupabaseClient, person: JwtToken) => {
    const session = await supabase.auth.setAuth(person)
    const { user } = await supabase.auth.api.getUser(session.access_token)
    const { error } = await supabase.from('notes').delete().eq('user_id', user.id)

    if (error) {
        throw error
    }
}

supabaseTests.before.each(async (context) => {
    context.tokens = {
        Cay: '',
        Antler: '',
    }

    await Promise.all(Object.entries(TestPeople).map(([name, person]) => {
        const supabase = createClient(config.supabase.url, config.supabase.superkey)
        return ensureUserExists(supabase, person)
            .then(token => context.tokens[name] = token)
            .then(() => ensureUserHasNoNotes(supabase, context.tokens[name]))
    }))
})

memoryTests.run()

// TODO Eventually, these tests can only run on CI, or by explicit choice
supabaseTests.run()

const assertSameSet = <T>(s1: T[], s2: T[]) => {
    const s1InS2 = s1.every(i1 => s2.includes(i1))
    const s2InS1 = s2.every(i2 => s1.includes(i2))

    assert.ok(s2InS1 && s1InS2, `Set 1 is not the same as Set 2:\n\t${s1}\n\t${s2}`)
}