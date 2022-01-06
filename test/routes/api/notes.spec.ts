import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { withTestServer } from '../../server'

import { makeSugaryFetch } from '../../sugary-fetch'
import { PeopleApi } from '../../../src/lib/people/api'
import { NotesApi } from '../../../src/lib/notes/api'
import { PersonInMemory, peopleInMemory } from '../../../src/lib/people/in-memory/people'
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
        if (isApiError(err)) {
            assert.equal(err.info.status, HttpStatus.Unauthorized)
        }
    }  
})

test('attempting to get a note without being signed in', async ({ api }) => {
    try {
        await api.getById('something')
        assert.unreachable()
    } catch (err) {
        if (isApiError(err)) {
            assert.equal(err.info.status, HttpStatus.Unauthorized)
        }
    }  
})

test('attempting to get all notes without being signed in', async ({ api }) => {
    try {
        await api.getAll()
        assert.unreachable()
    } catch (err) {
        if (isApiError(err)) {
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

test.run()

const isApiError = (err: unknown): err is ApiError => {
    assert.instance(err, ApiError)
    return true
}