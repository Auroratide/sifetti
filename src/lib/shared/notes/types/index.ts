import type { Id as PersonId } from '$lib/shared/people/types'
import type { Tag } from '$lib/shared/tags/types'

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
