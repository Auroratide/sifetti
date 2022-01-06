import type { RequestHandler } from '@sveltejs/kit'
import type { ServerRequest } from '@sveltejs/kit/types/hooks'
import { notes } from '$lib/beans'
import { HttpStatus } from '$lib/routing/http-status'

type EditsRequestBody = {
    content: string,
}

export const post: RequestHandler = async (req) => {
    return {
        status: HttpStatus.MethodNotAllowed,
    }
}
