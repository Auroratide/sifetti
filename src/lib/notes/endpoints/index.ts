import type { RequestHandler } from '@sveltejs/kit'
import { HttpStatus } from '../../routing/http-status'
import type { NotesProvider } from '../provider/provider'

export const get = (notes: NotesProvider): RequestHandler => async ({ locals }) => {
    const items = await notes.getAll(locals.accessToken)

    return new Response(JSON.stringify({ items }))
}

export const post = (notes: NotesProvider): RequestHandler => (async (req) => {
    const id = await notes.createEmpty(req.locals.accessToken)

    return new Response(null, {
        status: HttpStatus.Created,
        headers: new Headers({
            Location: `/api/notes/${id}`,
        })
    })
})
