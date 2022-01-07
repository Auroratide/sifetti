import type { Locals } from '../../hooks'
import type { RequestHandler } from '@sveltejs/kit'
import { HttpStatus } from '$lib/routing/http-status'
import { error } from '$lib/routing/error'
import { isJson } from '$lib/routing/request-type'

export const withAuth = <L extends Locals = Locals, I = unknown>(handler: RequestHandler<L, I>): RequestHandler<L, I> => {
    return (req) => {
        if (req.locals.accessToken) {
            return handler(req)
        } else {
            return error(HttpStatus.Unauthorized, 'Must be signed in to access this resource')
        }
    }
}

export const withJson = <L extends Locals = Locals, I = unknown>(handler: RequestHandler<L, I>): RequestHandler<L, I> => {
    return (req) => {
        if (isJson(req)) {
            return handler(req)
        } else {
            return error(HttpStatus.BadRequest, 'Request body must be JSON')
        }
    }
}
