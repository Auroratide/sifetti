import type { RequestHandler } from '@sveltejs/kit'
import { NoteProvider } from '$lib/notes/note-provider'

const notes = new NoteProvider([ {
    id: '1',
    content: 'Hello world',
} ])

export const get: RequestHandler = async ({ params }) => {
    const note = notes.findById(params.id)

    if (note) {
        return {
            body: note,
        }
    }
}
