import type { Test } from 'uvu'
import * as assert from '../../../assert'
import type { NotesProvider } from '../../../../src/lib/shared/notes/provider/provider'
import type { JwtToken } from '../../../../src/lib/shared/jwt'
import { MissingNoteError } from '../../../../src/lib/shared/notes/provider/error'

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

        assert.sameSet((await provider.getAll(tokens.Cay)).map(it => it.id), cay)
        assert.sameSet((await provider.getAll(tokens.Antler)).map(it => it.id), antler)
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
            if (assert.isType(err, MissingNoteError)) {
                assert.match(err.message, /does not exist/)
            }
        }
    })

    test('timestamp updates', async ({ provider, tokens }) => {
        const testStarted = new Date()
        const id = await provider.createEmpty(tokens.Cay)
        let note = await provider.findById(id, tokens.Cay)
        const afterCreate = new Date()

        assert.ok(testStarted <= note.createdAt && note.createdAt <= afterCreate, 'creation date not accurately set')
        assert.ok(testStarted <= note.updatedAt && note.updatedAt <= afterCreate, 'update date not accurately set upon creation')

        // wait a couple milliseconds so edit time can be substantially different
        await new Promise(resolve => setTimeout(resolve, 2))

        await provider.replaceContent(id, tokens.Cay, { title: 'new title', content: 'new content' })
        note = await provider.findById(id, tokens.Cay)

        assert.ok(testStarted <= note.createdAt && note.createdAt <= afterCreate, 'creation date not accurately set')
        assert.ok(afterCreate < note.updatedAt, 'update date not updated after editing')
    })

    return test
}
