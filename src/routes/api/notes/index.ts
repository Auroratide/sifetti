import type { Locals } from '../../../hooks'
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

export const post: RequestHandler<Locals> = async (req) => {
    if (req.locals.accessToken) {
        const id = await notes.createEmpty(req.locals.accessToken)

        return {
            status: HttpStatus.Created,
            headers: {
                Location: `/api/notes/${id}`,
            },
        }
    } else {
        return {
            status: HttpStatus.Unauthorized,
            body: {
                message: 'must be signed in'
            }
        }
    }
}
