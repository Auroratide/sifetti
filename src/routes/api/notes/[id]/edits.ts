import type { RequestHandler } from '@sveltejs/kit'
import type { ServerRequest } from '@sveltejs/kit/types/hooks'
import { notes } from '../_provider'

type EditsRequestBody = {
    content: string,
}

const isJson = (req: ServerRequest): req is ServerRequest<Record<string, any>, EditsRequestBody> => {
    return true
}

export const post: RequestHandler = async (req) => {
    if (isJson(req)) {
        notes.edit(req.params.id, req.body.content)
    }

    return {
        status: 204,
    }
}
