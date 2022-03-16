import request from 'supertest'
import { suite } from 'uvu'
import * as assert from '../../assert'
import * as cookie from 'cookie'
import { withTestServer } from '../../server'
import { peopleInMemory } from '../../../src/lib/server/people/people-in-memory'
import { HttpStatus } from '$lib/shared/http-status'
import * as jwt from '../../../src/lib/server/jwt'

import { FetchBinder, makeSugaryFetch } from '../../sugary-fetch'
import { PeopleApi } from '../../../src/lib/client/people/api'
import { ApiError } from '../../../src/lib/client/api/error'

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
    assertHasCookie(response, 'refresh_token')
    assertHasCookie(response, 'token_expiry')
})

test('signing in with valid credentials and destination using form data', async ({ server }) => {
    let response = await request(server.url)
        .post('/api/people/sign-ins')
        .send(`email=${peopleInMemory.aurora.email}`)
        .send(`password=${peopleInMemory.aurora.password}`)
        .send('destination=/notes/1')
        .expect(HttpStatus.Found)

    assert.equal(response.get('Location'), '/notes/1')
    assertHasCookie(response, 'access_token')
    assertHasCookie(response, 'refresh_token')
    assertHasCookie(response, 'token_expiry')
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
        .send(`username=stephanie`)
        .send(`email=stephanie@sifetti.com`)
        .send(`password=graffiti`)
        .send(`confirm-password=graffiti`)
        .expect(HttpStatus.Found)

    assert.equal(response.get('Location'), '/please-verify')
})

test('signing up when the account already exists using form data', async ({ server }) => {
    await request(server.url)
        .post('/api/people')
        .send(`username=stephanie`)
        .send(`email=${peopleInMemory.aurora.email}`)
        .send(`password=${peopleInMemory.aurora.password}`)
        .send(`confirm-password=${peopleInMemory.aurora.password}`)
        .expect(HttpStatus.Found)

        .expect('Location', '/sign-up?status=duplicate-account')
})

test('signing up with mismatched passwords using form data', async ({ server }) => {
    await request(server.url)
        .post('/api/people')
        .send(`username=elle la dalia`)
        .send(`email=elle@sifetti.com`)
        .send(`password=shovel`)
        .send(`confirm-password=shovwl`)
        .expect(HttpStatus.Found)

        .expect('Location', '/sign-up?status=mismatched-passwords')
})

test('signing up with invalid profile name using form data', async ({ server }) => {
    await request(server.url)
        .post('/api/people')
        .send(`username='elle la dalia`)
        .send(`email=elle@sifetti.com`)
        .send(`password=shovel`)
        .send(`confirm-password=shovel`)
        .expect(HttpStatus.Found)

        .expect('Location', '/sign-up?status=invalid-profile-name')
})

test('signing up using json', async ({ api }) => {
    await api.signUp('ling@sifetti.com', 'taxi', 'lingcab')
    // shouldn't throw
})

test('signing up when the account already exists using json', async ({ api }) => {
    const aurora = peopleInMemory.aurora

    try {
        await api.signUp(aurora.email, aurora.password, aurora.name)
        assert.unreachable()
    } catch (err) {
        if (assert.isType(err, ApiError)) {
            assert.is(err.info.status, HttpStatus.Conflict)
        }
    }
})

test('signing up with an invalid account name', async ({ api }) => {
    try {
        await api.signUp('zaur@sifetti.com', 'heypeeps!', 'lauren.zaur')
        assert.unreachable()
    } catch (err) {
        if (assert.isType(err, ApiError)) {
            assert.is(err.info.status, HttpStatus.BadRequest)
        }
    }
})

test('signing out', async ({ api, binder }) => {
    await api.signIn(peopleInMemory.aurora.email, peopleInMemory.aurora.password)
    assert.ok(binder.cookies?.access_token)

    await api.signOut()
    assert.not.ok(binder.cookies?.access_token)
})

test('inviting someone', async ({ api, binder }) => {
    const location = await api.authEvent('invite', {
        accessToken: jwt.sign({}),
        expiresIn: 3600,
        refreshToken: '1234567890',
    })

    assert.match(location, 'reset-password')
    assert.ok(binder.cookies?.access_token)
})

test('resetting a password', async ({ api, binder }) => {
    await api.signIn(peopleInMemory.eventide.email, peopleInMemory.eventide.password)
    await api.resetPassword('new-password')

    try {
        // old password is now invalid
        await api.signIn(peopleInMemory.eventide.email, peopleInMemory.eventide.password)
        assert.unreachable()
    } catch (err) {
        if (assert.isType(err, ApiError)) {
            assert.is(err.info.status, HttpStatus.Forbidden)
        }
    }

    const person = await api.signIn(peopleInMemory.eventide.email, 'new-password')

    assert.equal(person.id, peopleInMemory.eventide.id)
    assert.ok(binder.cookies?.access_token)
})

test('getting my info when already signed in', async ({ api }) => {
    await api.signIn(peopleInMemory.aurora.email, peopleInMemory.aurora.password)

    const result = await api.myInfo()
    assert.equal(result.email, peopleInMemory.aurora.email)
})

test('changing profile name', async ({ api }) => {
    await api.signIn(peopleInMemory.aurora.email, peopleInMemory.aurora.password)
    await api.rename('SatelliteGirl')
    const result = await api.myInfo()

    assert.equal(result.name, 'SatelliteGirl')
})

test('changing to already taken profile name', async ({ api }) => {
    await api.signIn(peopleInMemory.aurora.email, peopleInMemory.aurora.password)
    try {
        await api.rename(peopleInMemory.eventide.name)
        assert.unreachable()
    } catch (err) {
        if (assert.isType(err, ApiError)) {
            assert.equal(err.info.status, HttpStatus.Conflict)
        }
    }
})

test.run()
