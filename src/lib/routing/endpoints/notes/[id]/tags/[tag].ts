import type { RequestHandler } from '@sveltejs/kit'
import { HttpStatus } from '$lib/routing/http-status'
import { TagNotOnNoteError } from '$lib/shared/tags/types/provider/error'
import type { TagsProvider } from '$lib/shared/tags/types/provider/provider'

export const del = ({ tags }: { tags: TagsProvider }): RequestHandler => async ({ locals, params }) => {
    try {
        await tags.removeFromNote(locals.accessToken, params.tag, params.id)
    } catch(err) {
        if (err instanceof TagNotOnNoteError) {
            return new Response(null, {
                status: HttpStatus.NotFound,
            })
        } else {
            throw err
        }
    }

    return new Response(null, {
        status: HttpStatus.NoContent,
    })
}
