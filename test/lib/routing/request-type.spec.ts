import { Headers } from 'node-fetch'
import type { RequestEvent } from '@sveltejs/kit/types/hooks'
import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { isFormData, isJson } from '../../../src/lib/server/routing/request-type'

const test = suite('Request Types')

const mockRequest = {
    form: (): RequestEvent => ({
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
    json: (): RequestEvent => ({
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

    assert.ok(isFormData(req))
    assert.not.ok(isJson(req))
})

test('form data', async () => {
    const req = mockRequest.json()

    assert.not.ok(isFormData(req))
    assert.ok(isJson(req))
})

test.run()
