import request from 'supertest'
import { suite } from 'uvu'
import { withTestServer } from '../../server'

const test = withTestServer(suite('Health Check Api'))

test('health check', async ({ server }) => {
    await request(server.url)
        .get('/api/health')
        .expect(200)
})

test.run()
