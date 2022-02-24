import type { Note } from '$lib/shared/notes/types'

export type DemoNote = Omit<Note, 'id' | 'author'> & {
    tags: string[],
}
