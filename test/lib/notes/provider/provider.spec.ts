import type { Test } from 'uvu'
import * as assert from 'uvu/assert'
import type { NotesProvider } from '../../../../src/lib/notes/provider/provider'
import type { JwtToken } from '../../../../src/lib/security/jwt'

export const TestPeople = {
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

export type Context<T extends NotesProvider> = {
    provider: T,
    tokens: Record<keyof typeof TestPeople, JwtToken>,
}

export const withProvider = <T extends NotesProvider>(test: Test<Context<T>>, createProvider: () => T): Test<Context<T>> => {
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

    test('editing a note', async ({ provider, tokens }) => {
        const id = await provider.createEmpty(tokens.Cay)
        await provider.replaceContent(id, tokens.Cay, {
            title: 'Hello',
            content: 'Some content',
        })

        let note = await provider.findById(id, tokens.Cay)

        assert.equal(note.title, 'Hello')
        assert.equal(note.content, 'Some content')
    })

    test('editing a non-existent note', async ({ provider, tokens }) => {
        try {
            await provider.replaceContent('nonexistent', tokens.Cay, {
                title: 'Hello',
                content: 'Some content',
            })

            assert.unreachable()
        } catch(err) {
            assert.instance(err, Error)
            assert.match(err.message, /does not exist/)
        }
    })

    return test
}

const assertSameSet = <T>(s1: T[], s2: T[]) => {
    const s1InS2 = s1.every(i1 => s2.includes(i1))
    const s2InS1 = s2.every(i2 => s1.includes(i2))

    assert.ok(s2InS1 && s1InS2, `Set 1 is not the same as Set 2:\n\t${s1}\n\t${s2}`)
}