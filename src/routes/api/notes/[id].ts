import type { RequestHandler } from '@sveltejs/kit'

type Note = {
    id: string,
    content: string,
}

const db: Note[] = [ {
    id: '1',
    content: 'Hello world',
} ]

export const get: RequestHandler = async ({ params }) => {
    const note = db.find(n => n.id === params.id)

    if (note) {
        return {
            body: note,
        }
    }
}
