import type { Handle, GetSession } from '@sveltejs/kit'
import * as cookie from './lib/routing/cookie'
import type { Person } from '$lib/people/types'
import { people } from '$lib/beans'

export type Locals = {
    person: Person,
}

export type SessionData = {
    person: Person,
}

export const handle: Handle<Locals, unknown> = async ({ request, resolve }) => {
    const cookies = cookie.parse(request.headers.cookie || '')
    if (cookies.access_token) {
        const person = await people.getByToken(cookies.access_token)
        request.locals.person = person
    }

    return await resolve(request)
}

export const getSession: GetSession<Locals, unknown, SessionData> = async (request) => {
    return request.locals
}
