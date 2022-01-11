import type { Id as PersonId } from '../people/types'

export type TagId = string

export type Tag = {
    id: TagId,
    author: PersonId,
    name: string,
}