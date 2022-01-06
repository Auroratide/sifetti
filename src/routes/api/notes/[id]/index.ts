import type { RequestHandler } from '@sveltejs/kit'
import { notes } from '$lib/beans'
import { HttpStatus } from '$lib/routing/http-status'

export const get: RequestHandler = async ({ locals, params }) => {
    if (locals.accessToken) {
        const note = await notes.findById(params.id, locals.accessToken)

        if (note) {
            return {
                body: note,
            }
        } else {
            return {
                status: HttpStatus.NotFound,
            }
        }
    } else {
        return {
            status: HttpStatus.Unauthorized,
            body: {
                message: 'must be signed in'
            }
        }
    }
}
