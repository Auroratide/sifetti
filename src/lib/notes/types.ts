import type { Id as PersonId } from '../people/types'

export type Id = string

export type EditableContent = {
    title: string,
    content: string,
}

export type Note = {
    id: Id,
    author: PersonId,
} & EditableContent
