import type { RequestHandler } from '@sveltejs/kit'
import { handle, withAuth } from '../../_middleware'
import { HttpStatus } from '$lib/routing/http-status'
import { tags } from '$lib/beans'

export const get: RequestHandler = handle(withAuth)(async ({ locals, params }) => {
    const items = await tags.getForNote(locals.accessToken, params.id)

    return {
        status: HttpStatus.Ok,
        body: {
            items,
        },
    }
})
