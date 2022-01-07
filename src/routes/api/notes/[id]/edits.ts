import type { RequestHandler } from '@sveltejs/kit'
import type { Locals } from '../../../../hooks'
import { notes } from '$lib/beans'
import { HttpStatus } from '$lib/routing/http-status'
import { withAuth, withJson } from '../../_middleware'
import { error } from '$lib/routing/error'

type EditsRequestBody = {
    title: string,
    content: string,
}

export const post: RequestHandler = withJson<Locals, EditsRequestBody>(withAuth(async (req) => {
    try {
        await notes.replaceContent(req.params.id, req.locals.accessToken, {
            title: req.body.title,
            content: req.body.content,
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
}))
