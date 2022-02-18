import type { RequestHandler } from '@sveltejs/kit'
import { HttpStatus } from '$lib/routing/http-status'
import type { NotesProvider } from '$lib/shared/notes/provider/provider'
import { error } from '$lib/routing/respond'

export const get = ({ notes }: { notes: NotesProvider }): RequestHandler => async ({ locals, params }) => {
    const note = await notes.findById(params.id, locals.accessToken)

    if (note) {
        return new Response(JSON.stringify(note))
    } else {
        return error(HttpStatus.NotFound, 'Note not found')
    }
}
