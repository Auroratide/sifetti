import type { JwtToken } from '../../../security/jwt'
import type { Id, Note, EditableContent, WithTags } from '../types'

export interface NotesProvider {
    createEmpty: (token: JwtToken) => Promise<Id>
    findById: (id: Id, token: JwtToken) => Promise<Note | null>
    getAll: (token: JwtToken) => Promise<(Note & WithTags)[]>
    replaceContent: (id: Id, token: JwtToken, content: EditableContent) => Promise<void>
}
