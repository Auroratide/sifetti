import { ServerRequest } from '@sveltejs/kit/types/hooks'
import request from 'supertest'
import { test } from 'uvu'
import * as assert from 'uvu/assert'
import { peopleInMemory } from '../../../src/lib/people/in-memory/people'
import { HttpStatus } from '../../../src/lib/routing/http-status'

import { isFormData, isJson } from '../../../src/lib/routing/request-type'

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
