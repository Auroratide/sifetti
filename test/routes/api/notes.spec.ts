import request from 'supertest'
import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { TestServer, withTestServer } from '../../server'

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

const newNote = async (server: TestServer) => (
    await request(server.url)
        .post('/api/notes')
        .expect(201)
    ).headers.location

test('create note', async ({ signInAs, api }) => {
    await signInAs(peopleInMemory.aurora)

    const noteIds = await api.create()

    assert.ok(noteIds.id)
    assert.match(noteIds.api, /^\/api\/notes\/.+$/)
    assert.match(noteIds.view, /^\/notes\/.+$/)
})

test('creating a note without being signed in', async ({ api }) => {
    try {
        await api.create()
        assert.unreachable()
    } catch (err) {
        if (isApiError(err)) {
            assert.equal(err.info.status, HttpStatus.Unauthorized)
        }
    }  
})

test.skip('no note', async ({ server }) => {
    await request(server.url)
        .get('/api/notes/nonexistent')
        .expect(404)
})

test.skip('get note', async ({ server }) => {
    const location = await newNote(server)

    await request(server.url)
        .get(location)
        .expect(200)
})

test.skip('edit note', async ({ server }) => {
    const location = await newNote(server)

    await request(server.url)
        .post(`${location}/edits`)
        .send({
            content: 'Hello',
        })
        .expect(201)
    
    const body = (await request(server.url)
        .get(location)
        .expect(200)).body
    
    assert.equal(body.content, 'Hello')
})

test.run()

const isApiError = (err: unknown): err is ApiError => {
    assert.instance(err, ApiError)
    return true
}