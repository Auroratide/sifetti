import request from 'supertest'
import { test } from 'uvu'
import * as assert from 'uvu/assert'
import { TestServer } from '../../server'

let server: TestServer

test.before(async () => {
    server = await TestServer.start()
})

test.after(() => {
    server.close()
})

const newNote = async () => (
    await request(server.url)
        .post('/api/notes')
        .expect(201)
    ).headers.location

test.skip('create note', async () => {
    assert.match(await newNote(), /^\/api\/notes\/.+$/)
})

test.skip('no note', async () => {
    await request(server.url)
        .get('/api/notes/nonexistent')
        .expect(404)
})

test.skip('get note', async () => {
    const location = await newNote()

    await request(server.url)
        .get(location)
        .expect(200)
})

test.skip('edit note', async () => {
    const location = await newNote()

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
