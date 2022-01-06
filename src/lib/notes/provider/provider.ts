import type { JwtToken } from '../../security/jwt'
import type { Id, Note } from '../types'

export interface NotesProvider {
    createEmpty: (token: JwtToken) => Promise<Id>
    findById: (id: Id, token: JwtToken) => Promise<Note | null>
    getAll: (token: JwtToken) => Promise<Note[]>
}
