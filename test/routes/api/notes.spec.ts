import { suite } from 'uvu'
import * as assert from '../../assert'
import { withTestServer } from '../../server'

import { makeSugaryFetch } from '../../sugary-fetch'
import { PeopleApi } from '../../../src/lib/people/api'
import { NotesApi } from '../../../src/lib/notes/api'
import { PersonInMemory, peopleInMemory } from '../../../src/lib/people/in-memory/people'
import { notesInMemory } from '../../../src/lib/notes/in-memory/notes'
import { noteTagsInMemory, tagsInMemory } from '../../../src/lib/tags/in-memory/tags'
import { ApiError } from '../../../src/lib/api/error'
import { HttpStatus } from '../../../src/lib/routing/http-status'

type Context = {
    fetch: (url: RequestInfo, init?: RequestInit) => Promise<Response>,
    api: NotesApi,
    signInAs: (person: PersonInMemory) => Promise<void>,
}

const test = withTestServer(suite<Context>('Notes Api'))

test.before.each(async (context) => {
    context.fetch = makeSugaryFetch().bind({})
    context.api = new NotesApi(context.fetch, { baseUrl: context.server.url })

    const people = new PeopleApi(context.fetch, { baseUrl: context.server.url })
    context.signInAs = (person) => people.signIn(person.email, person.password).then(() => {})
})

test('creating a note', async ({ signInAs, api }) => {
    await signInAs(peopleInMemory.aurora)

    const noteIds = await api.create()

    assert.ok(noteIds.id)
    assert.match(noteIds.api, /^\/api\/notes\/.+$/)
    assert.match(noteIds.view, /^\/notes\/.+$/)

    const note = await api.getById(noteIds.id)

    assert.equal(note?.id, noteIds.id)
    assert.equal(note?.content, '')
})

test('attempting to create a note without being signed in', async ({ api }) => {
    try {
        await api.create()
        assert.unreachable()
    } catch (err) {
        if (assert.isType(err, ApiError)) {
            assert.equal(err.info.status, HttpStatus.Unauthorized)
        }
    }  
})

test('attempting to get a note without being signed in', async ({ api }) => {
    try {
        await api.getById('something')
        assert.unreachable()
    } catch (err) {
        if (assert.isType(err, ApiError)) {
            assert.equal(err.info.status, HttpStatus.Unauthorized)
        }
    }  
})

test('attempting to get all notes without being signed in', async ({ api }) => {
    try {
        await api.getAll()
        assert.unreachable()
    } catch (err) {
        if (assert.isType(err, ApiError)) {
            assert.equal(err.info.status, HttpStatus.Unauthorized)
        }
    }  
})

test('getting a nonexistent note', async ({ signInAs, api }) => {
    await signInAs(peopleInMemory.aurora)

    const note = await api.getById('nonexistent')

    assert.not.ok(note)
})

test('getting someone else\'s note', async ({ signInAs, api }) => {
    await signInAs(peopleInMemory.aurora)
    const { id } = await api.create()

    await signInAs(peopleInMemory.eventide)
    const note = await api.getById(id)

    assert.not.ok(note)
})

test('getting all notes', async ({ signInAs, api }) => {
    await signInAs(peopleInMemory.eventide)

    let notes = await api.getAll()
    assert.equal(notes.length, 0)

    await api.create()
    await api.create()

    notes = await api.getAll()
    assert.equal(notes.length, 2)
})

test('editing a note', async ({ signInAs, api }) => {
    await signInAs(peopleInMemory.aurora)

    const { id } = await api.create()
    await api.edit(id, {
        title: 'Hello',
        content: 'World',
    })

    const note = await api.getById(id)

    assert.equal(note.title, 'Hello')
    assert.equal(note.content, 'World')
})

test('editing a note that does not exist', async ({ signInAs, api }) => {
    await signInAs(peopleInMemory.aurora)

    try {
        await api.edit('nonexistent', {
            title: 'Hello',
            content: 'World',
        })

        assert.unreachable()
    } catch (err) {
        if (assert.isType(err, ApiError)) {
            assert.equal(err.info.status, HttpStatus.NotFound)
        }
    }
})

test('getting tags for a note', async ({ signInAs, api }) => {
    await signInAs(peopleInMemory.aurora)

    const tags = await api.getTags(notesInMemory.borealis.id)

    assert.sameSet(tags.map(it => it.id), Array.from(noteTagsInMemory[notesInMemory.borealis.id]))
})

test('adding a tag to a note', async ({ signInAs, api }) => {
    await signInAs(peopleInMemory.aurora)
    const notInAustralis = Object.values(tagsInMemory).find(it => !noteTagsInMemory[notesInMemory.australis.id].has(it.id))
    assert.ok(notInAustralis, 'Was unable to find a tag id not already in the australis note')
    
    let tags = await api.getTags(notesInMemory.australis.id)
    assert.equal(tags.length, noteTagsInMemory[notesInMemory.australis.id].size)

    await api.addTag(notesInMemory.australis.id, notInAustralis.id)
    tags = await api.getTags(notesInMemory.australis.id)
    assert.equal(tags.length, noteTagsInMemory[notesInMemory.australis.id].size + 1, 'Australis should have had an additional tag')
    assert.ok(tags.map(it => it.id).includes(notInAustralis.id))
})

test('removing a tag from a note', async ({ signInAs, api }) => {
    await signInAs(peopleInMemory.aurora)
    await api.addTag(notesInMemory.australis.id, tagsInMemory.natural.id)

    let tags = await api.getTags(notesInMemory.australis.id)
    assert.ok(tags.map(it => it.id).includes(tagsInMemory.natural.id))

    await api.removeTag(notesInMemory.australis.id, tagsInMemory.natural.id)
    tags = await api.getTags(notesInMemory.australis.id)
    assert.not.ok(tags.map(it => it.id).includes(tagsInMemory.natural.id), 'Tag should have been removed')
})

test.run()
