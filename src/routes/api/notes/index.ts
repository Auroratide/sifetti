import type { RequestHandler } from '@sveltejs/kit'
import { notes } from './_provider'

export const get: RequestHandler = async () => {
    return {
        body: {
            items: notes.getAll(),
        }
    }
}

export const post: RequestHandler = async () => {
    const id = notes.createEmpty()

    return {
        status: 201,
        headers: {
            Location: `/api/notes/${id}`,
        },
    }
}
