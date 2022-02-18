import type { RequestHandler } from '@sveltejs/kit'
import { HttpStatus } from '$lib/routing/http-status'
import type { TagId } from '$lib/shared/tags/types'
import type { TagsProvider } from '$lib/shared/tags/types/provider/provider'

export const get = ({ tags }: { tags: TagsProvider }): RequestHandler => async ({ locals, params }) => {
    const items = await tags.getForNote(locals.accessToken, params.id)

    return new Response(JSON.stringify({ items }))
}

type AddTagRequest = {
    tagId: TagId,
}

export const post = ({ tags }: { tags: TagsProvider }): RequestHandler => async ({ request, locals, params }) => {
    const body = (await request.json()) as AddTagRequest
    await tags.addToNote(locals.accessToken, body.tagId, params.id)

    return new Response(null, {
        status: HttpStatus.Created,
    })
}
