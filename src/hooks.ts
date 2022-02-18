import type { Handle, GetSession } from '@sveltejs/kit'
import * as cookie from './lib/routing/cookie'
import type { Person } from '$lib/shared/people/types'
import { people } from '$lib/beans'

export const handle: Handle = async ({ event, resolve }) => {
    const cookies = cookie.parse(event.request.headers.get('cookie') || '')
    if (cookies.access_token) {
        event.locals.accessToken = cookies.access_token
    }

    return await resolve(event)
}

export const getSession: GetSession = async (request) => {
    let person: Person = null
    if (request.locals.accessToken) {
        person = await people.getByToken(request.locals.accessToken)
    }

    return {
        person,
    }
}
