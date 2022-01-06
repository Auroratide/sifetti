import type { RequestHandler } from '@sveltejs/kit'
import { notes } from '$lib/beans'
import { HttpStatus } from '$lib/routing/http-status'
import { withAuth } from '../../_middleware'

export const get: RequestHandler = withAuth(async ({ locals, params }) => {
    const note = await notes.findById(params.id, locals.accessToken)

    if (note) {
        return {
            body: note,
        }
    } else {
        return {
            status: HttpStatus.NotFound,
        }
    }
})
