import type { RequestHandler } from '@sveltejs/kit'
import { handle, withAuth } from '../../../_middleware'
import { tags } from '$lib/beans'
import { HttpStatus } from '$lib/routing/http-status'
import { TagNotOnNoteError } from '$lib/tags/provider/error'

export const del: RequestHandler = handle(withAuth)(async ({ locals, params }) => {
    try {
        await tags.removeFromNote(locals.accessToken, params.tag, params.id)
    } catch(err) {
        if (err instanceof TagNotOnNoteError) {
            return {
                status: HttpStatus.NotFound,
            }
        } else {
            throw err
        }
    }

    return {
        status: HttpStatus.NoContent,
    }
})