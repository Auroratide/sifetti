import type { RequestHandler } from '@sveltejs/kit'
import { notes } from '$lib/beans'
import { HttpStatus } from '$lib/routing/http-status'

export const get: RequestHandler = async ({ params }) => {
    return {
        status: HttpStatus.MethodNotAllowed,
    }
}
