import type { Id } from '../types'

export class MissingNoteError extends Error {
    readonly id: Id

    constructor(id: Id) {
        super(`Note with id (${id}) does not exist`)
    }
}
