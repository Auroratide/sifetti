import type { Id } from '../../shared/notes/types'

export class MissingNoteError extends Error {
    readonly id: Id

    constructor(id: Id) {
        super(`Note with id (${id}) does not exist`)
    }
}
