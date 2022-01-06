import type { Locals } from '../../../hooks'
import type { RequestHandler } from '@sveltejs/kit'
import { HttpStatus } from '$lib/routing/http-status'
import { notes } from '$lib/beans'
import { withAuth } from '../_middleware'

export const get: RequestHandler<Locals> = withAuth(async ({ locals }) => {
    const items = await notes.getAll(locals.accessToken)

    return {
        body: {
            items: items
        }
    }
})

export const post: RequestHandler<Locals> = withAuth(async (req) => {
    const id = await notes.createEmpty(req.locals.accessToken)

    return {
        status: HttpStatus.Created,
        headers: {
            Location: `/api/notes/${id}`,
        },
    }
})
