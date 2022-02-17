import { HttpStatus } from '$lib/routing/http-status'
import { error } from '$lib/routing/respond'
import type { NotesProvider } from '$lib/notes/provider/provider'
import type { RequestHandler } from '@sveltejs/kit'

type EditsRequestBody = {
    title: string,
    content: string,
}

export const post = ({ notes }: { notes: NotesProvider }): RequestHandler => async (req) => {
    const body = (await req.request.json()) as EditsRequestBody
    try {
        await notes.replaceContent(req.params.id, req.locals.accessToken, {
            title: body.title,
            content: body.content,
        })
        
        return new Response(null, {
            status: HttpStatus.NoContent,
        })
    } catch (err) {
        if (err instanceof Error && err.message.match(/not exist/)) {
            return error(HttpStatus.NotFound, err.message)
        } else {
            throw err
        }
    }
}
