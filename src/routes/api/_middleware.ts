import type { Locals } from '../../hooks'
import type { RequestHandler } from '@sveltejs/kit'
import { HttpStatus } from '$lib/routing/http-status'
import { error } from '$lib/routing/error'

export const withAuth = (handler: RequestHandler<Locals>): RequestHandler<Locals> => {
    return (req) => {
        if (req.locals.accessToken) {
            return handler(req)
        } else {
            return error(HttpStatus.Unauthorized, 'Must be signed in to access this resource')
        }
    }
}