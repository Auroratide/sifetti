import type { RequestHandler } from '@sveltejs/kit'
import { notes } from '$lib/beans'
import { HttpStatus } from '$lib/routing/http-status'
import { handle, withAuth, withJson } from '../../_middleware'
import { error } from '$lib/routing/error'

type EditsRequestBody = {
    title: string,
    content: string,
}

export const post: RequestHandler = handle(withAuth, withJson)(async (req) => {
    const body = (await req.request.json()) as EditsRequestBody
    try {
        await notes.replaceContent(req.params.id, req.locals.accessToken, {
            title: body.title,
            content: body.content,
        })
        
        return {
            status: HttpStatus.NoContent,
        }
    } catch (err) {
        if (err instanceof Error && err.message.match(/not exist/)) {
            return error(HttpStatus.NotFound, err.message)
        } else {
            throw err
        }
    }
})
