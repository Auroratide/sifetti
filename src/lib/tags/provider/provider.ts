import type { JwtToken } from '../../security/jwt'
import type { Tag, TagId } from '../types'
import type { Id as NoteId } from '../../notes/types'

export interface TagsProvider {
    create: (token: JwtToken, name: string) => Promise<TagId>
    getAll: (token: JwtToken) => Promise<Tag[]>
    addToNote: (token: JwtToken, tag: TagId, note: NoteId) => Promise<void>
    getForNote: (token: JwtToken, note: NoteId) => Promise<Tag[]>
}