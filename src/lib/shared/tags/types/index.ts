import type { Id as PersonId } from '$lib/shared/people/types'
import type { TagName } from './tag-name'

export type TagId = string

export type Tag = {
    id: TagId,
    author: PersonId,
    name: TagName,
}