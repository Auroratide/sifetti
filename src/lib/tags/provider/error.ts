import type { TagId } from '../types'
import type { Id as NoteId } from '../../shared/notes/types'

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

export class InvalidTagError extends TagsProviderError {
    readonly tagName: string

    constructor(tagName: string) {
        super(`Tag name "${tagName}" is not valid`)

        this.tagName = tagName
    }
}

export class NoteOrTagNotFoundError extends TagsProviderError {
    readonly note: NoteId
    readonly tag: TagId

    constructor(note: NoteId, tag: TagId) {
        super(`Note (${note}) or Tag (${tag}) does not exist`)
        this.note = note
        this.tag = tag
    }
}

export class TagNotOnNoteError extends TagsProviderError {
    readonly tag: TagId
    readonly note: NoteId

    constructor(tag: TagId, note: NoteId) {
        super(`Tag (${tag}) does not exist on note (${note})`)
        this.tag = tag
        this.note = note
    }
}
