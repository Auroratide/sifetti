import type { RequestHandler } from '@sveltejs/kit'
import { handle, withAuth } from '../_middleware'
import { tags } from '$lib/beans'
import { HttpStatus } from '$lib/routing/http-status'

export const get: RequestHandler = handle(withAuth)(async ({ locals, params }) => {
    let items = await tags.getAll(locals.accessToken)
    let tag = items.find(it => it.id === params.id)

    if (tag) {
        return {
            status: HttpStatus.Ok,
            body: tag,
        }
    } else {
        return {
            status: HttpStatus.NotFound,
        }
    }
})
