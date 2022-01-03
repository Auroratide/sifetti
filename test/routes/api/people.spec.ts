import request from 'supertest'
import { test } from 'uvu'
import * as assert from 'uvu/assert'
import * as cookie from 'cookie'
import { TestServer } from '../../server'
import { peopleInMemory } from '../../../src/lib/people/in-memory/people'
import { HttpStatus } from '../../../src/lib/routing/http-status'

let server: TestServer

test.before(async () => {
    server = await TestServer.start()
})

test.after(() => {
    server.close()
})

const assertHasCookie = (res: request.Response, key: string) => {
    const cookies = res.get('Set-Cookie').map(it => cookie.parse(it))
    assert.ok(cookies.some(it => Object.keys(it)[0] === key), `Lacks cookie with key '${key}'`)
}

test('signing in with valid credentials', async () => {
    let response = await request(server.url)
        .post('/api/people/sign-ins')
        .send(`email=${peopleInMemory.aurora.email}`)
        .send(`password=${peopleInMemory.aurora.password}`)
        .expect(HttpStatus.Found)

    assert.equal(response.get('Location'), '/me')
    assertHasCookie(response, 'access_token')
})

test('signing in with bad credentials', async () => {
    await request(server.url)
        .post('/api/people/sign-ins')
        .send(`email=${peopleInMemory.aurora.email}`)
        .send(`password=password`)
        .expect(HttpStatus.Found)
        .expect('Location', '/sign-in?status=bad-credentials')
})

test.run()
