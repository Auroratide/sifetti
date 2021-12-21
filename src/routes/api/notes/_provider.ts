import { NoteProvider } from '$lib/notes/note-provider'

export const notes = new NoteProvider([ {
    id: '1',
    content: 'Hello world',
} ])
