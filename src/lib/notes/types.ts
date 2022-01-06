import type { Id as PersonId } from '../people/types'
export type Id = string

export type Note = {
    id: Id,
    author: PersonId,
    title: string,
    content: string,
}
