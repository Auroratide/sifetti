import type { RequestHandler } from '@sveltejs/kit'
import { HttpStatus } from '$lib/shared/http-status'
import { error } from '$lib/server/routing/respond'
import { isJson, isFormData } from '$lib/server/routing/request-type'

type Middleware = (handler: RequestHandler) => RequestHandler

export const withAuth: Middleware = (handler) => {
    return (req) => {
        if (req.locals.accessToken) {
            return handler(req)
        } else {
            return error(HttpStatus.Unauthorized, 'Must be signed in to access this resource')
        }
    }
}

export const withJson: Middleware = (handler) => {
    return (req) => {
        if (isJson(req.request)) {
            return handler(req)
        } else {
            return error(HttpStatus.BadRequest, 'Request body must be JSON')
        }
    }
}

export const withFormData: Middleware = (handler) => {
    return (req) => {
        if (isFormData(req.request)) {
            return handler(req)
        } else {
            return error(HttpStatus.BadRequest, 'Request body must be Form Data')
        }
    }
}

export const withErrorHandler: Middleware = (handler) => {
    return async (req) => {
        try {
            return await handler(req)
        } catch (err) {
            console.error(err)

            return error(HttpStatus.InternalServerError, 'The server messed up.')
        }
    }
}

/**
 * The base of ALL api handlers which automatically includes error handling.
 * 
 * @param middleware List of middlewares, applied from left to right
 * @returns A Svelte handler
 */
export const handle: (...middleware: Middleware[]) => Middleware = (...middleware: Middleware[]) => (handler) =>
    [withErrorHandler].concat(middleware).reduceRight((h, cur) => cur(h), handler)
