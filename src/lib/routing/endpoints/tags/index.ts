import type { RequestHandler } from '@sveltejs/kit'
import { HttpStatus } from '$lib/routing/http-status'
import { DuplicateTagError } from '$lib/tags/provider/error'
import { error } from '$lib/routing/error'
import type { TagsProvider } from '$lib/tags/provider/provider'

export const get = ({ tags }: { tags: TagsProvider }): RequestHandler => async ({ locals }) => {
    const items = await tags.getAll(locals.accessToken)

    return new Response(JSON.stringify({ items }))
}

type CreateTagRequest = {
    name: string,
}

export const post = ({ tags }: { tags: TagsProvider }): RequestHandler => async ({ locals, request }) => {
    const body = (await request.json()) as CreateTagRequest
    try {
        const id = await tags.create(locals.accessToken, body.name)
        return new Response(null, {
            status: HttpStatus.Created,
            headers: {
                Location: `/api/tags/${id}`,
            },
        })
    } catch (err) {
        if (err instanceof DuplicateTagError) {
            return error(HttpStatus.BadRequest, err.message)
        }

        throw err
    }
}
