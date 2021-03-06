import type { Test } from 'uvu'
import * as assert from '$test/assert'
import type { TagsProvider } from '$lib/shared/tags/types/provider/provider'
import type { JwtToken } from '$lib/shared/jwt'
import {
    DuplicateTagError,
    EmptyTagError,
    TagNotOnNoteError,
    NoteOrTagNotFoundError,
    InvalidTagError,
} from '$lib/shared/tags/types/provider/error'
import type { Id as NoteId } from '$lib/shared/notes/types'
import { asType } from '$test/as-type'
import { TagName } from '$lib/shared/tags/types/tag-name'

const nonexistent = '00000000-0000-0000-0000-000000000000'

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

export const TestNotes = {
    Vercon: {
        person: 'Cay',
    },
}

export type Context<T extends TagsProvider> = {
    provider: T,
    tokens: Record<keyof typeof TestPeople, JwtToken>,
    notes: Record<keyof typeof TestNotes, NoteId>,
}

const tag = (n: string) => asType(n, TagName)

export const withProvider = <T extends TagsProvider>(test: Test<Context<T>>, createProvider: () => T): Test<Context<T>> => {
    test.before.each((context) => {
        context.provider = createProvider()
    })

    test('getting all tags', async ({ provider, tokens }) => {
        await provider.create(tokens.Cay, tag('location'))
        let tags = await provider.getAll(tokens.Cay)
        
        assert.equal(tags.length, 1)
        assert.equal(tags[0].name, 'location')

        // Get only my tags
        await provider.create(tokens.Antler, tag('character'))
        tags = await provider.getAll(tokens.Antler)
        
        assert.equal(tags.length, 1)
        assert.equal(tags[0].name, 'character')
    })

    test('creating the same tag twice', async ({ provider, tokens }) => {
        await provider.create(tokens.Cay, tag('location'))
        try {
            await provider.create(tokens.Cay, tag('location'))
            assert.unreachable()
        } catch (err) {
            if (assert.isType(err, DuplicateTagError)) {
                assert.equal(err.tagName, 'location')
            }
        }

        // Another person may create a tag of the same name
        await provider.create(tokens.Antler, tag('location'))
    })

    test('creating an empty tag', async ({ provider, tokens }) => {
        try {
            await provider.create(tokens.Cay, '' as TagName)
            assert.unreachable()
        } catch (err) {
            assert.isType(err, EmptyTagError)
        }
    })

    test('creating an invalid tag', async ({ provider, tokens }) => {
        try {
            await provider.create(tokens.Cay, ' ' as TagName)
            assert.unreachable()
        } catch (err) {
            assert.isType(err, InvalidTagError)
        }
    })

    test('getting tags for a specific note', async ({ provider, tokens, notes }) => {
        const location = await provider.create(tokens.Cay, tag('location'))
        await provider.addToNote(tokens.Cay, location, notes.Vercon)

        let tags = await provider.getForNote(tokens.Cay, notes.Vercon)
        assert.sameSet(tags.map(it => it.id), [ location ])

        const downtown = await provider.create(tokens.Cay, tag('downtown'))
        await provider.addToNote(tokens.Cay, downtown, notes.Vercon)

        tags = await provider.getForNote(tokens.Cay, notes.Vercon)
        assert.sameSet(tags.map(it => it.id), [ location, downtown ])
    })

    test('tagging a nonexistent note', async ({ provider, tokens }) => {
        const location = await provider.create(tokens.Cay, tag('location'))
        try {
            await provider.addToNote(tokens.Cay, location, nonexistent)
            assert.unreachable()
        } catch (err) {
            assert.isType(err, NoteOrTagNotFoundError)
        }
    })

    test('tagging with a nonexistent tag', async ({ provider, tokens, notes }) => {
        try {
            await provider.addToNote(tokens.Cay, nonexistent, notes.Vercon)
            assert.unreachable()
        } catch (err) {
            assert.isType(err, NoteOrTagNotFoundError)
        }
    })

    test('removing tags from a specific note', async ({ provider, tokens, notes }) => {
        const location = await provider.create(tokens.Cay, tag('location'))
        const downtown = await provider.create(tokens.Cay, tag('downtown'))
        await provider.addToNote(tokens.Cay, location, notes.Vercon)
        await provider.addToNote(tokens.Cay, downtown, notes.Vercon)

        let tags = await provider.getForNote(tokens.Cay, notes.Vercon)
        assert.sameSet(tags.map(it => it.id), [ location, downtown ])

        await provider.removeFromNote(tokens.Cay, location, notes.Vercon)
        tags = await provider.getForNote(tokens.Cay, notes.Vercon)
        assert.sameSet(tags.map(it => it.id), [ downtown ])
    })

    test('removing an existing tag that is not on the note', async ({ provider, tokens, notes }) => {
        const location = await provider.create(tokens.Cay, tag('location'))
        try {
            await provider.removeFromNote(tokens.Cay, location, notes.Vercon)
            assert.unreachable()
        } catch (err) {
            assert.isType(err, TagNotOnNoteError)
        }
    })

    return test
}
