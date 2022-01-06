import type { RequestHandler } from '@sveltejs/kit'
import { HttpStatus } from '$lib/routing/http-status'
import { notes } from '$lib/beans'

export const get: RequestHandler = async () => {
    return {
        body: {
            items: [],
        }
    }
}

// not allowed until revisited
export const post: RequestHandler = async () => {
    return {
        status: HttpStatus.MethodNotAllowed,
    }
}
