import type { RequestHandler } from '@sveltejs/kit'
import { HttpStatus } from '$lib/shared/http-status'
import type { TagsProvider } from '$lib/shared/tags/types/provider/provider'

export const get = ({ tags }: { tags: TagsProvider }): RequestHandler => async ({ locals, params }) => {
    let items = await tags.getAll(locals.accessToken)
    let tag = items.find(it => it.id === params.id)

    if (tag) {
        return new Response(JSON.stringify(tag))
    } else {
        return new Response(null, {
            status: HttpStatus.NotFound,
        })
    }
}
