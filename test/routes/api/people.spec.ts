import request from 'supertest'
import { test } from 'uvu'
import { TestServer } from '../../server'
import { peopleInMemory } from '../../../src/routes/api/people/_in-memory/_people'
import { HttpStatus } from '../../../src/lib/routing/http-status'

let server: TestServer

test.before(async () => {
    server = await TestServer.start()
})

test.after(() => {
    server.close()
})

test('signing in with valid credentials', async () => {
    await request(server.url)
        .post('/api/people/sign-ins')
        .send(`email=${peopleInMemory.aurora.email}`)
        .send(`password=${peopleInMemory.aurora.password}`)
        .expect(HttpStatus.Found)
        .expect('Location', '/me')
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
