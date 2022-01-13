import type { RequestHandler } from '@sveltejs/kit'
import { handle, withAuth, withJson } from '../_middleware'
import { tags } from '$lib/beans'
import { HttpStatus } from '$lib/routing/http-status'
import type { Locals } from '../../../hooks'

export const get: RequestHandler = handle(withAuth)(async ({ locals }) => {
    const items = await tags.getAll(locals.accessToken)

    return {
        status: HttpStatus.Ok,
        body: {
            items,
        },
    }
})

type CreateTagRequest = {
    name: string,
}

export const post: RequestHandler<Locals, CreateTagRequest> = handle(withAuth, withJson)(async ({ locals, body }) => {
    const id = await tags.create(locals.accessToken, body.name)

    return {
        status: HttpStatus.Created,
        headers: {
            Location: `/api/tags/${id}`,
        },
    }
})
