import type { JwtToken } from '../../../jwt'
import type { Tag, TagId } from '$lib/shared/tags/types'
import type { Id as NoteId } from '$lib/shared/notes/types'
import type { TagName } from '$lib/shared/tags/types/tag-name'

export interface TagsProvider {
    create: (token: JwtToken, name: TagName) => Promise<TagId>
    getAll: (token: JwtToken) => Promise<Tag[]>
    addToNote: (token: JwtToken, tag: TagId, note: NoteId) => Promise<void>
    getForNote: (token: JwtToken, note: NoteId) => Promise<Tag[]>
    removeFromNote: (token: JwtToken, tag: TagId, note: NoteId) => Promise<void>
}