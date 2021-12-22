import request from 'supertest'
import { test } from 'uvu'
import { TestServer } from '../../server'

let server: TestServer

test.before(async () => {
    server = await TestServer.start()
})

test.after(() => {
    server.close()
})

test('health check', async () => {
    await request(server.url)
        .get('/api/health')
        .expect(200)
})

test.run()
