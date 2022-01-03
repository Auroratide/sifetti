import type { RequestHandler } from '@sveltejs/kit'
import { notes } from '$lib/beans'

export const get: RequestHandler = async ({ params }) => {
    const note = notes.findById(params.id)

    if (note) {
        return {
            body: note,
        }
    }
}
