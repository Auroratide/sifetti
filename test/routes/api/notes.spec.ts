import request from 'supertest'
import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { TestServer, withTestServer } from '../../server'

const test = withTestServer(suite('Notes Api'))

const newNote = async (server: TestServer) => (
    await request(server.url)
        .post('/api/notes')
        .expect(201)
    ).headers.location

test.skip('create note', async ({ server }) => {
    assert.match(await newNote(server), /^\/api\/notes\/.+$/)
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
