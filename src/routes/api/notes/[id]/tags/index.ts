import type { RequestHandler } from '@sveltejs/kit'
import { handle, withAuth, withJson } from '../../../_middleware'
import { HttpStatus } from '$lib/routing/http-status'
import { tags } from '$lib/beans'
import type { TagId } from '$lib/tags/types'
import type { Locals } from '../../../../../hooks'

export const get: RequestHandler = handle(withAuth)(async ({ locals, params }) => {
    const items = await tags.getForNote(locals.accessToken, params.id)

    return {
        status: HttpStatus.Ok,
        body: {
            items,
        },
    }
})

type AddTagRequest = {
    tagId: TagId,
}

export const post: RequestHandler<Locals, AddTagRequest> = handle(withAuth, withJson)(async ({ locals, body, params }) => {
    await tags.addToNote(locals.accessToken, body.tagId, params.id)

    return {
        status: HttpStatus.Created,
    }
})