import type { JwtToken } from '../../security/jwt'
import type { Tag, TagId } from '../types'
import type { Id as NoteId } from '../../notes/types'
import type { TagName } from '../tag-name'

export interface TagsProvider {
    create: (token: JwtToken, name: TagName) => Promise<TagId>
    getAll: (token: JwtToken) => Promise<Tag[]>
    addToNote: (token: JwtToken, tag: TagId, note: NoteId) => Promise<void>
    getForNote: (token: JwtToken, note: NoteId) => Promise<Tag[]>
    removeFromNote: (token: JwtToken, tag: TagId, note: NoteId) => Promise<void>
}