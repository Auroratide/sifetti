import type { Handle, GetSession } from '@sveltejs/kit'
import * as cookie from './lib/server/routing/cookie'
import type { Person } from '$lib/shared/people/types'
import { people } from '$lib/server/beans'

export const handle: Handle = async ({ event, resolve }) => {
    const cookies = cookie.parse(event.request.headers.get('cookie') || '')
    if (cookies.access_token) {
        event.locals.accessToken = cookies.access_token
        event.locals.refreshToken = cookies.refresh_token
        event.locals.tokenExpiry = new Date(parseInt(cookies.token_expiry))
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
