import request from 'supertest'
import { suite } from 'uvu'
import * as assert from '../../assert'
import * as cookie from 'cookie'
import { withTestServer } from '../../server'
import { peopleInMemory } from '../../../src/lib/people/in-memory/people'
import { HttpStatus } from '../../../src/lib/routing/http-status'

import { FetchBinder, makeSugaryFetch } from '../../sugary-fetch'
import { PeopleApi } from '../../../src/lib/people/api'
import { ApiError } from '../../../src/lib/api/error'

type Context = {
    fetch: (url: RequestInfo, init?: RequestInit) => Promise<Response>,
    api: PeopleApi,
    binder: FetchBinder,
}

const test = withTestServer(suite<Context>('People Api'))

test.before.each(async (context) => {
    context.binder = {}
    context.fetch = makeSugaryFetch(context.binder)
    context.api = new PeopleApi(context.fetch, { baseUrl: context.server.url })
})

const assertHasCookie = (res: request.Response, key: string) => {
    const cookies = res.get('Set-Cookie').map(it => cookie.parse(it))
    assert.ok(cookies.some(it => Object.keys(it)[0] === key), `Lacks cookie with key '${key}'`)
}

test('signing in with valid credentials using form data', async ({ server }) => {
    let response = await request(server.url)
        .post('/api/people/sign-ins')
        .send(`email=${peopleInMemory.aurora.email}`)
        .send(`password=${peopleInMemory.aurora.password}`)
        .expect(HttpStatus.Found)

    assert.equal(response.get('Location'), '/me')
    assertHasCookie(response, 'access_token')
})

test('signing in with bad credentials using form data', async ({ server }) => {
    await request(server.url)
        .post('/api/people/sign-ins')
        .send(`email=${peopleInMemory.aurora.email}`)
        .send(`password=password`)
        .expect(HttpStatus.Found)
        .expect('Location', '/sign-in?status=bad-credentials')
})

test('signing in with valid credentials using json', async ({ api, binder }) => {
    const person = await api.signIn(peopleInMemory.aurora.email, peopleInMemory.aurora.password)

    assert.equal(person.id, peopleInMemory.aurora.id)
    assert.ok(binder.cookies?.access_token)
})

test('signing in with bad credentials using json', async ({ api, binder }) => {
    try {
        await api.signIn(peopleInMemory.aurora.email, 'not her password')
        assert.unreachable()
    } catch (err) {
        if (assert.isType(err, ApiError)) {
            assert.is(err.info.status, HttpStatus.Forbidden)
            assert.not.ok(binder.cookies?.access_token)
        }
    }
})

test('signing up using form data', async ({ server }) => {
    let response = await request(server.url)
        .post('/api/people')
        .send(`email=stephanie@sifetti.com`)
        .send(`password=graffiti`)
        .expect(HttpStatus.Found)

    assert.equal(response.get('Location'), '/please-verify')
})

test('signing up when the account already exists using form data', async ({ server }) => {
    let response = await request(server.url)
        .post('/api/people')
        .send(`email=${peopleInMemory.aurora.email}`)
        .send(`password=${peopleInMemory.aurora.password}`)
        .expect(HttpStatus.Found)

        .expect('Location', '/sign-up?status=duplicate-account')
})

test('signing up using json', async ({ api }) => {
    await api.signUp('ling@sifetti.com', 'taxi')
    // shouldn't throw
})

test('signing up when the account already exists using json', async ({ api }) => {
    try {
        await api.signUp(peopleInMemory.aurora.email, peopleInMemory.aurora.password)
        assert.unreachable()
    } catch (err) {
        if (assert.isType(err, ApiError)) {
            assert.is(err.info.status, HttpStatus.Conflict)
        }
    }
})

test('signing out', async ({ api, binder }) => {
    await api.signIn(peopleInMemory.aurora.email, peopleInMemory.aurora.password)
    assert.ok(binder.cookies?.access_token)

    await api.signOut()
    assert.not.ok(binder.cookies?.access_token)
})

test.run()
