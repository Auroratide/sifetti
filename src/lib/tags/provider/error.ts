import type { TagId } from '../types'
import type { Id as NoteId } from '../../notes/types'

export class TagsProviderError extends Error { }

export class DuplicateTagError extends TagsProviderError {
    readonly tagName: string

    constructor(tagName: string) {
        super(`Cannot create duplicate of tag "${tagName}"`)

        this.tagName = tagName
    }
}

export class EmptyTagError extends TagsProviderError {
    constructor() {
        super('Cannot create an empty tag')
    }
}

export class NoteNotFoundError extends TagsProviderError {
    readonly id: NoteId

    constructor(id: NoteId) {
        super(`Note does not exist: ${id}`)
        this.id = id
    }
}

export class TagNotFoundError extends TagsProviderError {
    readonly id: TagId

    constructor(id: TagId) {
        super(`Tag does not exist: ${id}`)
        this.id = id
    }
}
