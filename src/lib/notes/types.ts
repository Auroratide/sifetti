import type { Id as PersonId } from '../people/types'
import type { Tag } from '../tags/types'

export type Id = string

export type EditableContent = {
    title: string,
    content: string,
}

export type WithTags = {
    tags: Tag[],
}

export type Note = {
    id: Id,
    author: PersonId,
} & EditableContent
