import type { Handle, GetSession } from '@sveltejs/kit'
import * as cookie from './lib/routing/cookie'
import { people } from './routes/api/people/_provider'

export const handle: Handle = async ({ request, resolve }) => {
    const cookies = cookie.parse(request.headers.cookie || '')
    const person = await people.getByToken(cookies.access_token)

    request.locals.person = person

    return await resolve(request)
}

export const getSession: GetSession = async (request) => {
    return request.locals
}
