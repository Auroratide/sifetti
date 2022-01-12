import type { RequestHandler } from '@sveltejs/kit'
import { handle, withAuth } from '../_middleware'
import { tags } from '$lib/beans'
import { HttpStatus } from '$lib/routing/http-status'

export const get: RequestHandler = handle(withAuth)(async ({ locals }) => {
    const items = await tags.getAll(locals.accessToken)

    return {
        status: HttpStatus.Ok,
        body: {
            items,
        },
    }
})