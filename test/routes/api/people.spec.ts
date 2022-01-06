import request from 'supertest'
import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import * as cookie from 'cookie'
import { withTestServer } from '../../server'
import { peopleInMemory } from '../../../src/lib/people/in-memory/people'
import { HttpStatus } from '../../../src/lib/routing/http-status'

const test = withTestServer(suite('People Api'))

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

test('signing in with valid credentials using json', async ({ server }) => {
    let response = await request(server.url)
        .post('/api/people/sign-ins')
        .send({
            email: peopleInMemory.aurora.email,
            password: peopleInMemory.aurora.password,
        })
        .expect(HttpStatus.Created)

    assert.equal(response.body.person.id, peopleInMemory.aurora.id)

    assertHasCookie(response, 'access_token')
})

test('signing in with bad credentials using json', async ({ server }) => {
    await request(server.url)
        .post('/api/people/sign-ins')
        .send({
            email: peopleInMemory.aurora.email,
            password: 'not-a-password',
        })
        .expect(HttpStatus.Forbidden)
})

test.run()
