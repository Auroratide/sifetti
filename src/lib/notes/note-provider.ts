import type { Id, Note } from './types'

export class NoteProvider {
    private db: Note[]

    constructor(initial: Note[]) {
        this.db = initial
    }

    findById = (id: Id): Note | null => {
        return this.db.find(n => n.id === id) ?? null
    }
}
