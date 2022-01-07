import type { RequestHandler } from '@sveltejs/kit'
import { HttpStatus } from '$lib/routing/http-status'
import { notes } from '$lib/beans'
import { handle, withAuth } from '../_middleware'

export const get: RequestHandler = handle(withAuth)(async ({ locals }) => {
    const items = await notes.getAll(locals.accessToken)

    return {
        body: {
            items: items
        }
    }
})

export const post: RequestHandler = handle(withAuth)(async (req) => {
    const id = await notes.createEmpty(req.locals.accessToken)

    return {
        status: HttpStatus.Created,
        headers: {
            Location: `/api/notes/${id}`,
        },
    }
})
