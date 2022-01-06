import { ServerRequest } from '@sveltejs/kit/types/hooks'
import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { isFormData, isJson } from '../../../src/lib/routing/request-type'

const test = suite('Request Types')

const mockRequest = {
    form: (): ServerRequest => ({
        method: 'POST',
        host: '',
        path: '/',
        query: new URLSearchParams(),
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
        },
        rawBody: null,
        params: {},
        body: '',
        locals: {},
    }),
    json: (): ServerRequest => ({
        method: 'POST',
        host: '',
        path: '/',
        query: new URLSearchParams(),
        headers: {
            'content-type': 'application/json',
        },
        rawBody: null,
        params: {},
        body: '',
        locals: {},
    })
}

test('form data', async () => {
    const req = mockRequest.form()

    assert.ok(isFormData(req))
    assert.not.ok(isJson(req))
})

test('form data', async () => {
    const req = mockRequest.json()

    assert.not.ok(isFormData(req))
    assert.ok(isJson(req))
})

test.run()
