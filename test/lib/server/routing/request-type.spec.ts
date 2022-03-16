import { Headers } from 'node-fetch'
import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { isFormData, isJson } from '$lib/server/routing/request-type'

const test = suite('Request Types')

const mockRequest = {
    form: () => ({
        request: {
            method: 'POST',
            headers: new Headers({
                'content-type': 'application/x-www-form-urlencoded',
            }),
        } as any,
        url: new URL('http://localhost:3000'),
        params: {},
        locals: {},
        platform: {},
    }),
    json: () => ({
        request: {
            method: 'POST',
            headers: new Headers({
                'content-type': 'application/json',
            }),
        } as any,
        url: new URL('http://localhost:3000'),
        params: {},
        locals: {},
        platform: {},
    })
}

test('form data', async () => {
    const req = mockRequest.form()

    assert.ok(isFormData(req.request))
    assert.not.ok(isJson(req.request))
})

test('form data', async () => {
    const req = mockRequest.json()

    assert.not.ok(isFormData(req.request))
    assert.ok(isJson(req.request))
})

test.run()
