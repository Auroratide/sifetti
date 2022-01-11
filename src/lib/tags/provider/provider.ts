import type { JwtToken } from '../../security/jwt'
import type { Tag, TagId } from '../types'

export interface TagsProvider {
    create: (token: JwtToken, name: string) => Promise<TagId>
    getAll: (token: JwtToken) => Promise<Tag[]>
}